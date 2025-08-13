import { Module } from '@nestjs/common';
import { PixController } from './pix.controller';
import { PixService } from './pix.service';
import { ConsentModule } from '../consent/consent.module';

@Module({
  imports: [ConsentModule],
  controllers: [PixController],
  providers: [PixService],
  exports: [PixService],
})
export class PixModule {}
