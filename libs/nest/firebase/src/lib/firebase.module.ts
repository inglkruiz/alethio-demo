import * as firebaseAdmin from 'firebase-admin';

import { ClassProvider, DynamicModule, Module, Provider } from '@nestjs/common';

import { FIREBASE_MODULE, FIREBASE_TOKEN } from './firebase.constants';
import {
    FirebaseAdmin, FirebaseModuleAsyncOptions, FirebaseModuleOptions, FirebaseModuleOptionsFactory,
} from './firebase.interfaces';

function getFirebaseAdmin(options: FirebaseModuleOptions): FirebaseAdmin {
  const app = firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert({
      ...options,
      /**
       * Newline characters in Private keys are not properly parsed by dotenv,
       * and needs to be replaced accordingly.
       */
      privateKey: options.privateKey.replace(/\\n/g, '\n'),
    }),
    databaseURL: `https://${options.projectId}.firebaseio.com`,
  });

  return {
    database: app.database(),
  };
}

@Module({})
export class FirebaseModule {
  public static forConfig(options: FirebaseModuleOptions): DynamicModule {
    const provider: Provider<FirebaseAdmin> = {
      provide: FIREBASE_TOKEN,
      useValue: getFirebaseAdmin(options),
    };

    return {
      exports: [provider],
      module: FirebaseModule,
      providers: [provider],
    };
  }

  public static forConfigAsync(
    options: FirebaseModuleAsyncOptions
  ): DynamicModule {
    const firebaseProvider: Provider = {
      inject: [FIREBASE_MODULE],
      provide: FIREBASE_TOKEN,
      useFactory: (options: FirebaseModuleOptions) => getFirebaseAdmin(options),
    };

    const asyncProviders = this.createAsyncProviders(options);
    return {
      module: FirebaseModule,
      imports: [...(options.imports || [])],
      providers: [...asyncProviders, firebaseProvider],
      exports: [firebaseProvider],
    };
  }

  private static createAsyncProviders(
    options: FirebaseModuleAsyncOptions
  ): Provider[] {
    if (options.useFactory || options.useExisting) {
      return [this.createAsyncOptionsProvider(options)];
    }

    return [
      this.createAsyncOptionsProvider(options),
      {
        provide: options.useClass,
        useClass: options.useClass,
        inject: [options.inject || []],
      } as ClassProvider,
    ];
  }

  private static createAsyncOptionsProvider(
    options: FirebaseModuleAsyncOptions
  ): Provider {
    if (options.useFactory) {
      return {
        provide: FIREBASE_MODULE,
        useFactory: options.useFactory,
        inject: options.inject || [],
      };
    }

    return {
      provide: FIREBASE_MODULE,
      useFactory: async (
        optionsFactory: FirebaseModuleOptionsFactory
      ): Promise<FirebaseModuleOptions> =>
        await optionsFactory.createFirebaseModuleOptions(),
      inject: options.useClass ? [options.useClass] : [],
    };
  }
}
