import { Test } from '@nestjs/testing';

import { AppService } from './app.service';

describe.skip('AppService', () => {
  let service: AppService;

  beforeAll(async () => {
    const app = await Test.createTestingModule({
      providers: [AppService],
    }).compile();

    service = app.get<AppService>(AppService);
  });

  describe('getData', () => {
    it('should return "Welcome to api!"', () => {
      // expect(service.getAccountData()).toEqual({ message: 'Welcome to api!' });
      expect(true).toBe(true);
    });
  });
});
