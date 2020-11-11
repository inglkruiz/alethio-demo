import * as firebaseAdmin from 'firebase-admin';

import { ModuleMetadata, Type } from '@nestjs/common';

//#region  Interfaces

export interface FirebaseAdmin {
  database: firebaseAdmin.database.Database;
}

export interface FirebaseModuleOptionsFactory {
  createFirebaseModuleOptions():
    | Promise<FirebaseModuleOptions>
    | FirebaseModuleOptions;
}

//#endregion

//#region Types

export type FirebaseDatabaseReference = firebaseAdmin.database.Reference;

export type FirebaseModuleOptions = firebaseAdmin.ServiceAccount;

export type FirebaseModuleAsyncOptions = {
  useClass?: Type<FirebaseModuleOptionsFactory>;
  useFactory?: (
    ...args: any[]
  ) => Promise<FirebaseModuleOptions> | FirebaseModuleOptions;
  inject?: any[];
  useExisting?: Type<FirebaseModuleOptionsFactory>;
} & Pick<ModuleMetadata, 'imports'>;

//#endregion
