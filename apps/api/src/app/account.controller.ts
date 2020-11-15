import Web3Utils from 'web3-utils';

import {
    Body, Controller, Get, HttpCode, HttpException, HttpStatus, Param, Post, Put,
} from '@nestjs/common';

import { AccountService } from './account.service';

@Controller('accounts')
export class AccountController {
  constructor(private readonly accounts: AccountService) {}

  @Get()
  getList() {
    return this.accounts.getList();
  }

  @Get(':address')
  getData(@Param('address') address: string) {
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

    return this.accounts.get(address);
  }

  @Post('webhook-handler')
  @HttpCode(200)
  handleWebhook(@Body() data) {
    console.dir(data);
    return;
  }

  @Put(':address/toggle-is-tracked')
  toggleIsTracked(@Param('address') address: string) {
    return this.accounts.toggleIsTracked(address);
  }
}
