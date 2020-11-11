//#region Interfaces

import { AxiosInstance as _AxiosInstance, AxiosRequestConfig } from 'axios';

import { ModuleMetadata, Type } from '@nestjs/common';

export interface AxiosModuleOptionsFactory {
  createAxiosModuleOptions(): Promise<AxiosModuleOptions> | AxiosModuleOptions;
}

//#endregion

//#region Types

export type AxiosModuleOptions = AxiosRequestConfig;
export type AxiosInstance = _AxiosInstance;

export type AxiosModuleAsyncOptions = {
  useClass?: Type<AxiosModuleOptionsFactory>;
  useFactory?: (
    ...args: any[]
  ) => Promise<AxiosModuleOptions> | AxiosModuleOptions;
  inject?: any[];
  useExisting?: Type<AxiosModuleOptionsFactory>;
} & Pick<ModuleMetadata, 'imports'>;

//#endregion
