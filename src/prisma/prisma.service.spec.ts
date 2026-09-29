import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from './prisma.service.js';

describe('PrismaService', () => {
  let service: PrismaService;

  beforeEach(async () => {
    // Only used to build the adapter; compile() doesn't connect to the database
    vi.stubEnv('DATABASE_URL', 'postgresql://test:test@localhost:5432/test');

    const module: TestingModule = await Test.createTestingModule({
      providers: [PrismaService],
    }).compile();

    service = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
