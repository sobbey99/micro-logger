import { Injectable } from '@nestjs/common';
import { PublisherService } from 'src/logger/logger.service';

@Injectable()
export class TestService {
	constructor(private readonly _publisher: PublisherService) {
		// _publisher.log('message');
		// _publisher.info('message');
		// _publisher.error('message');
		// _publisher.critical('message');
	}
}
