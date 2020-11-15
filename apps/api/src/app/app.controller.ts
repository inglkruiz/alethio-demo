import Web3Utils from 'web3-utils';

import {
    Body, Controller, Get, HttpCode, HttpException, HttpStatus, Param, Post, Put,
} from '@nestjs/common';

import { AccountService } from './account.service';

@Controller('accounts')
export class AppController {
  constructor(private readonly accountsService: AccountService) {}

  @Get()
  getAccounts() {
    return this.accountsService.getList();
  }

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

    return this.accountsService.get(address);
  }

  @Post(':address')
  @HttpCode(200)
  updateAccountData(@Param('address') address: string, @Body() data) {
    console.dir(data);
    return;
  }

  @Put(':address/toggle-is-tracked')
  toggleAccountIsTracked(@Param('address') address: string) {
    return this.accountsService.toggleIsTracked(address);
  }
}
