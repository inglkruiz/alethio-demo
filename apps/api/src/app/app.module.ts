import { AxiosModule } from '@alethio-demo/nest/axios';
import { FirebaseModule } from '@alethio-demo/nest/firebase';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { environment } from '../environments/environment';
import { AccountsService } from './accounts.service';
import { AppController } from './app.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      ignoreEnvFile: !environment.production,
    }),
    AxiosModule.forConfigAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => {
        return {
          baseURL: 'https://api.aleth.io/v1',
          headers: {
            Authorization: `Bearer ${config.get('ALETHIO_API_KEY')}`,
          },
        };
      },
      inject: [ConfigService],
    }),
    FirebaseModule.forConfigAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => {
        return {
          projectId: config.get('FIREBASE_PROJECT_ID'),
          privateKey: config.get('FIREBASE_PRIVATE_KEY'),
          clientEmail: config.get('FIREBASE_CLIENT_EMAIL'),
        };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [AppController],
  providers: [AccountsService],
})
export class AppModule {}
