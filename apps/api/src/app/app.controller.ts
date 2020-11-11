import { Controller, Get, HttpException, HttpStatus, Param } from '@nestjs/common';

import { AppService } from './app.service';

@Controller('accounts')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get(':address')
  getAccountData(@Param('address') address: string) {
    // TODO: Validate Ethereum address string
    if (!address) {
      throw new HttpException(
        "Account's address not found in request",
        HttpStatus.BAD_REQUEST
      );
    }

    return this.appService.getAccountData(address);
  }
}
