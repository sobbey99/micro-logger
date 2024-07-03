import { Injectable } from '@nestjs/common';
import * as path from 'path';
import { appendFileSync, ensureDir, existsSync, writeFileSync } from 'fs-extra';
import { path as AppRootPath } from 'app-root-path';

@Injectable()
export class PublisherService {
	async log(
		message: string,
		{ archive, terminal } = { archive: true, terminal: true },
	) {
		if (terminal) {
			const color = '\x1b[36m%s\x1b[0m'; // tail
			console.log(color, message);
		}

		if (archive) await this.publish('logs', message);
	}

	async error(
		message: string,
		{ archive, terminal } = { archive: true, terminal: true },
	) {
		if (terminal) {
			const color = '\x1b[35m%s\x1b[0m'; // red
			console.error(color, message);
		}

		if (archive) await this.publish('exceptions', message);
	}

	async info(
		message: string,
		{ archive, terminal } = { archive: true, terminal: true },
	) {
		if (terminal) {
			const color = '\x1b[33m%s\x1b[0m'; // yellow
			console.info(color, message);
		}

		if (archive) await this.publish('info', message);
	}

	async critical(
		message: string,
		{ archive, terminal } = { archive: true, terminal: true },
	) {
		if (terminal) {
			const color = '\x1b[31m%s\x1b[0m'; // red
			console.error(color, message);
		}

		if (archive) await this.publish('criticals', message);
	}

	private async publish(
		tag: 'info' | 'logs' | 'exceptions' | 'criticals',
		message: string,
	) {
		const partitions = new Date().toISOString().split('T');
		const date = partitions[0];

		message = `${partitions[1]}: ${message}`;

		const url = path.join(AppRootPath, `./logs/${tag}/${date}.log`);

		await ensureDir(path.join(AppRootPath, `./logs/${tag}`));

		if (!existsSync(url)) writeFileSync(url, `${message}\n`);
		else appendFileSync(url, `${message}\n`);
	}
}
