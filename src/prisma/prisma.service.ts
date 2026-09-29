import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '../generated/prisma/client.js';
import { PrismaPg } from '@prisma/adapter-pg'
import { getDatabaseUrl } from './database-url.js';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
    constructor() {
        const adapter = new PrismaPg({
            connectionString: getDatabaseUrl()
        });

        super({ adapter })
    }

    async onModuleInit() {
        await this.$connect();
    }
}
