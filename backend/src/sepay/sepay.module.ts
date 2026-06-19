import { Module } from '@nestjs/common';
import { SepayController } from './sepay.controller';
import { SepayService } from './sepay.service';
import { SettingsModule } from '../settings/settings.module';

@Module({
  imports: [SettingsModule],
  controllers: [SepayController],
  providers: [SepayService],
})
export class SepayModule {}
