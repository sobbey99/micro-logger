import { ModuleMetadata } from '@nestjs/common';

export interface IMicroLoggerOptions {
	loggFilePath: string;
}

export interface IMicroLoggerModuleAsyncOptions
	extends Pick<ModuleMetadata, 'imports'> {
	useFactory: (
		...args: any[]
	) => Promise<IMicroLoggerOptions> | IMicroLoggerOptions;
	inject?: any[];
}
