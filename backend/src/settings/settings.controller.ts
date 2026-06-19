import { Controller, Get } from '@nestjs/common';
import { SettingsService } from './settings.service';

@Controller('settings')
export class SettingsController {
  constructor(private settingsService: SettingsService) {}

  @Get('payment')
  getPaymentSettings() {
    return this.settingsService.getPaymentSettings();
  }
}
