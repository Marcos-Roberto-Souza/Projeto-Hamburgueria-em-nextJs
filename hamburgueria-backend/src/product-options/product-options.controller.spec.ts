import { Test, TestingModule } from '@nestjs/testing';
import { ProductOptionsController } from './product-options.controller';

describe('ProductOptionsController', () => {
  let controller: ProductOptionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductOptionsController],
    }).compile();

    controller = module.get<ProductOptionsController>(ProductOptionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
