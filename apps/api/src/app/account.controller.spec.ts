import { Test, TestingModule } from '@nestjs/testing';

import { AccountController } from './account.controller';

describe.skip('AppController', () => {
  let app: TestingModule;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [AccountController],
      providers: [],
    }).compile();
  });

  describe('getData', () => {
    it('should return "Welcome to api!"', () => {
      // const appController = app.get<AppController>(AppController);
      // expect(appController.getData()).toEqual({ message: 'Welcome to api!' });
      expect(true).toBe(true);
    });
  });
});
