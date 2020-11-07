import { FirebaseModule } from '@alethio-demo/nest/firebase';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { environment } from '../environments/environment';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      ignoreEnvFile: !environment.production,
      // isGlobal: true,
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
  providers: [AppService],
})
export class AppModule {}
