import { Inject, Injectable } from '@nestjs/common';
import * as path from 'path';
import { appendFileSync, ensureDir, existsSync, writeFileSync } from 'fs-extra';
import { MICRO_LOGGER_MODULE_OPTIONS } from 'src/app.constants';
import { IMicroLoggerOptions } from 'src/app.interface';

@Injectable()
export class PublisherService {
	public LOG_PATH: string;
	public APP_NAME: string;

	constructor(
		@Inject(MICRO_LOGGER_MODULE_OPTIONS) options: IMicroLoggerOptions,
	) {
		this.LOG_PATH = options.LOG_PATH;
		this.APP_NAME = options.APP_NAME;
	}

	async log(
		message: string,
		{ archive, terminal } = { archive: true, terminal: true },
	) {
		if (terminal) {
			const color = '\x1b[36m%s\x1b[0m'; // tail
			console.log(color, `[${this.APP_NAME}] `, message);
		}

		if (archive) await this.publish('logs', message);
	}

	async error(
		message: string,
		{ archive, terminal } = { archive: true, terminal: true },
	) {
		if (terminal) {
			const color = '\x1b[35m%s\x1b[0m'; // red
			console.error(color, `[${this.APP_NAME}] `, message);
		}

		if (archive) await this.publish('exceptions', message);
	}

	async info(
		message: string,
		{ archive, terminal } = { archive: true, terminal: true },
	) {
		if (terminal) {
			const color = '\x1b[33m%s\x1b[0m'; // yellow
			console.info(color, `[${this.APP_NAME}] `, message);
		}

		if (archive) await this.publish('info', message);
	}

	async critical(
		message: string,
		{ archive, terminal } = { archive: true, terminal: true },
	) {
		if (terminal) {
			const color = '\x1b[31m%s\x1b[0m'; // red
			console.error(color, `[${this.APP_NAME}] `, message);
		}

		if (archive) await this.publish('criticals', message);
	}

	private async publish(
		tag: 'info' | 'logs' | 'exceptions' | 'criticals',
		message: string,
	) {
		const partitions = new Date().toISOString().split('T');
		const date = partitions[0];

		message = `[${this.APP_NAME}] ${partitions[1]}: ${message}`;

		const url = path.join(this.LOG_PATH, `./${tag}/${date}.log`);

		await ensureDir(path.join(this.LOG_PATH, `./${tag}`));

		if (!existsSync(url)) writeFileSync(url, `${message}\n`);
		else appendFileSync(url, `${message}\n`);
	}
}
