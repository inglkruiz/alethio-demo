import type { AxiosInstance } from '@alethio-demo/nest/axios';
import { InjectAxiosInstance } from '@alethio-demo/nest/axios';
import { InjectFirebaseAdmin } from '@alethio-demo/nest/firebase';
import { Injectable } from '@nestjs/common';

import type {
  FirebaseAdmin,
  FirebaseDatabaseReference,
} from '@alethio-demo/nest/firebase';
@Injectable()
export class AppService {
  private accountsDatabaseRef: FirebaseDatabaseReference;

  constructor(
    @InjectAxiosInstance() private readonly axios: AxiosInstance,
    @InjectFirebaseAdmin() readonly firebaseAdmin: FirebaseAdmin
  ) {
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
