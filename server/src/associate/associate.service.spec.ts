import { Test, TestingModule } from '@nestjs/testing';
import { AssociateService } from './associate.service';

describe('AssociateService', () => {
  let service: AssociateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AssociateService],
    }).compile();

    service = module.get<AssociateService>(AssociateService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
