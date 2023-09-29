export const enum Types {
	REQUEST_CONTEXT = 'core:requestContext:IRequestContext'
}

export interface IRequestContext {
	setCorrelationId(correlationId: string): void;
	getCorrelationId(): string;
}
