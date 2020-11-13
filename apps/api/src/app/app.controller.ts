import Web3Utils from 'web3-utils';

import { Controller, Get, HttpException, HttpStatus, Param } from '@nestjs/common';

import { AccountsService } from './accounts.service';

@Controller('accounts')
export class AppController {
  constructor(private readonly accountsService: AccountsService) {}

  @Get(':address')
  getAccountData(@Param('address') address: string) {
    if (!address) {
      throw new HttpException(
        "Account's address not found in request",
        HttpStatus.BAD_REQUEST
      );
    } else if (!Web3Utils.isAddress(address)) {
      throw new HttpException(
        "Account's address is invalid",
        HttpStatus.BAD_REQUEST
      );
    }

    return this.accountsService.getTransactions(address);
  }
}
