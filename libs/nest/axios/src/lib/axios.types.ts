//#region Interfaces

import { Rxios as _Rxios, RxiosConfig } from 'rxios';

import { ModuleMetadata, Type } from '@nestjs/common';

export interface AxiosModuleOptionsFactory {
  createAxiosModuleOptions(): Promise<AxiosModuleOptions> | AxiosModuleOptions;
}

//#endregion

//#region Types

export type AxiosModuleOptions = RxiosConfig;
export type RxiosInstance = _Rxios;

export type AxiosModuleAsyncOptions = {
  useClass?: Type<AxiosModuleOptionsFactory>;
  useFactory?: (
    ...args: any[]
  ) => Promise<AxiosModuleOptions> | AxiosModuleOptions;
  inject?: any[];
  useExisting?: Type<AxiosModuleOptionsFactory>;
} & Pick<ModuleMetadata, 'imports'>;

//#endregion
