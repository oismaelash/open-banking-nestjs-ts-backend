import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConsentModule } from './consent/consent.module';
import { AccountsModule } from './accounts/accounts.module';
import { PixModule } from './pix/pix.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { SearchModule } from './search/search.module';
import { DocumentsModule } from './documents/documents.module';
import { UtilsModule } from './utils/utils.module'; // Added import

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    AuthModule,
    ConsentModule,
    AccountsModule,
    PixModule,
    DashboardModule,
    SearchModule,
    DocumentsModule,
    UtilsModule, // Added import
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {} 