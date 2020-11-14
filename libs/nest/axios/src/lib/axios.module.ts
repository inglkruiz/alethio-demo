import { Rxios } from 'rxios';

import { ClassProvider, DynamicModule, Module, Provider } from '@nestjs/common';

import { AXIOS_MODULE, AXIOS_TOKEN } from './axios.constants';
import {
  AxiosModuleAsyncOptions,
  AxiosModuleOptions,
  AxiosModuleOptionsFactory,
  RxiosInstance,
} from './axios.types';

function getAxiosInstance(options: AxiosModuleOptions): RxiosInstance {
  return new Rxios(options);
}

@Module({})
export class AxiosModule {
  public static forConfig(options: AxiosModuleOptions): DynamicModule {
    const provider: Provider<RxiosInstance> = {
      provide: AXIOS_TOKEN,
      useValue: getAxiosInstance(options),
    };

    return {
      exports: [provider],
      module: AxiosModule,
      providers: [provider],
    };
  }

  public static forConfigAsync(
    options: AxiosModuleAsyncOptions
  ): DynamicModule {
    const axiosProvider: Provider = {
      inject: [AXIOS_MODULE],
      provide: AXIOS_TOKEN,
      useFactory: (options: AxiosModuleOptions) => getAxiosInstance(options),
    };

    const asyncProviders = this.createAsyncProviders(options);
    return {
      module: AxiosModule,
      imports: [...(options.imports || [])],
      providers: [...asyncProviders, axiosProvider],
      exports: [axiosProvider],
    };
  }

  private static createAsyncProviders(
    options: AxiosModuleAsyncOptions
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
    options: AxiosModuleAsyncOptions
  ): Provider {
    if (options.useFactory) {
      return {
        provide: AXIOS_MODULE,
        useFactory: options.useFactory,
        inject: options.inject || [],
      };
    }

    return {
      provide: AXIOS_MODULE,
      useFactory: async (
        optionsFactory: AxiosModuleOptionsFactory
      ): Promise<AxiosModuleOptions> =>
        await optionsFactory.createAxiosModuleOptions(),
      inject: options.useClass ? [options.useClass] : [],
    };
  }
}
