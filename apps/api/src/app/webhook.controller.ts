import { Controller, Delete, Get, Param } from '@nestjs/common';

import { WebhookService } from './webhook.service';

@Controller('webhooks')
export class WebhookController {
  constructor(private readonly webhook: WebhookService) {}

  @Get()
  getList() {
    return this.webhook.getList();
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.webhook.delete(id);
  }
}
