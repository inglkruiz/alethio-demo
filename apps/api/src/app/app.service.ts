import axios, { AxiosInstance } from 'axios';

import {
    FirebaseAdmin, FirebaseDatabaseReference, InjectFirebaseAdmin,
} from '@alethio-demo/nest/firebase';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  private axios: AxiosInstance;
  private accountsDatabaseRef: FirebaseDatabaseReference;

  constructor(
    config: ConfigService,
    @InjectFirebaseAdmin() firebaseAdmin: FirebaseAdmin
  ) {
    this.axios = axios.create({
      baseURL: 'https://api.aleth.io/v1',
      headers: {
        Authorization: `Bearer ${config.get('ALETHIO_API_KEY')}`,
      },
    });

    this.accountsDatabaseRef = firebaseAdmin.database.ref('accounts');
  }

  async getAccountData(address: string) {
    const dataFromDatabase = await this.retrieveAccountDataFromDatabase(
      address
    );

    if (dataFromDatabase) return dataFromDatabase;

    const axiosResponse = await this.axios.get(`/accounts/${address}`);
    const data = axiosResponse.data;

    this.setAccountDataInDatabase(address, data);

    return data;
  }

  private async retrieveAccountDataFromDatabase(address: string) {
    return await new Promise((resolve) => {
      this.accountsDatabaseRef.child(address).once('value', (snapshot) => {
        resolve(snapshot.val());
      });
    });
  }

  private setAccountDataInDatabase(address: string, data) {
    this.accountsDatabaseRef.child(address).set(data);
  }
}
