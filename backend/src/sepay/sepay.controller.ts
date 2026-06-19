import {
  Controller,
  Post,
  Body,
  Headers,
  HttpCode,
} from '@nestjs/common';
import { SepayService } from './sepay.service';
import { SettingsService } from '../settings/settings.service';

@Controller('webhooks')
export class SepayController {
  constructor(
    private sepayService: SepayService,
    private settingsService: SettingsService,
  ) {}

  @Post('sepay')
  @HttpCode(200)
  async handleWebhook(
    @Body() body: Record<string, unknown>,
    @Headers('authorization') authorization: string,
  ) {
    const settings = await this.settingsService.ensureSettings();
    this.sepayService.validateApiKey(authorization, settings.sepayWebhookKey);
    await this.sepayService.processWebhook(body as never);
    return { success: true };
  }
}
