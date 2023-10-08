import { MiddlewareConsumer, Module, NestModule, ValidationPipe } from '@nestjs/common';
import * as httpContext from 'express-http-context';
import { APP_FILTER, APP_PIPE } from '@nestjs/core';

import { HealthCheckController, IdpController } from './controllers';
import { LoggingModule } from './modules/core/logging';
import { RequestContextModule } from './modules/core/requestContext';
import { HttpContextMiddleware } from './common/middlewares/HttpContextMiddleware';
import { tracerMiddleware } from './common/middlewares/tracerMiddleware';
import { AppConfigurationModule } from './modules/core/configuration';
import { AllExceptionsFilter } from './common/filters/AllExceptionsFilter';
import { AuditMiddleware } from './common/middlewares/AuditMiddleware';
import { MongoModule } from './modules/core/mongo';
import { UserModule } from './modules/domain/users';
import { AuthenticationModule } from './modules/domain/authentication';


const coreModules = [
	AppConfigurationModule,
	RequestContextModule,
	LoggingModule,
	MongoModule,
];

const domainModules = [
	AuthenticationModule,
	UserModule,
];

@Module({
	imports: [
		...coreModules,
		...domainModules,
	],
	controllers: [HealthCheckController, IdpController],
	providers: [
		{
			provide: APP_FILTER,
			useClass: AllExceptionsFilter,
		}, {
			provide: APP_PIPE,
			useClass: ValidationPipe,
		},
	],
})
export class AppModule implements NestModule {
	public configure(consumer: MiddlewareConsumer) {
		consumer
			.apply(
				httpContext.middleware,
				tracerMiddleware,
				AuditMiddleware,
				HttpContextMiddleware
			)
			.forRoutes(IdpController);
	}
};
