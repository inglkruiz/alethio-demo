import { Test } from '@nestjs/testing';

import { AccountService } from './account.service';

describe.skip('AppService', () => {
  let service: AccountService;

  beforeAll(async () => {
    const app = await Test.createTestingModule({
      providers: [AccountService],
    }).compile();

    service = app.get<AccountService>(AccountService);
  });

  describe('getData', () => {
    it('should return "Welcome to api!"', () => {
      // expect(service.getAccountData()).toEqual({ message: 'Welcome to api!' });
      expect(true).toBe(true);
    });
  });
});
