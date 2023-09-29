import {
	Body,
	Controller,
	Inject,
	Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { IGHubLogger, Types as TLog } from '../../modules/core/logging';
import { IUserService, Types as TUser } from '../../modules/business/users';

import * as dto from './ipdDto';


@ApiTags('idp')
@Controller('/v1/idp')
export class IdpController {
	constructor(
		@Inject(TLog.LOGGER_SVC) private readonly _logger: IGHubLogger,
		@Inject(TUser.USER_SVC) private readonly _usrSvc: IUserService,
	) {}

	@Post('/authorize')
	public authorize(@Body() loginDto: dto.PasswordLoginDto) {
		return this._usrSvc.create(loginDto);
	}

	@Post('/oauth/token')
	public issueToken() {
		return { status: 'Ok' };
	}
}
