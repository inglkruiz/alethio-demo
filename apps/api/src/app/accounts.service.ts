import type { RxiosInstance } from '@alethio-demo/nest/axios';
import { objectVal } from 'rxfire/database';
import { filter, first, map, mergeMapTo } from 'rxjs/operators';

import { InjectAxiosInstance } from '@alethio-demo/nest/axios';
import { InjectFirebaseAdmin } from '@alethio-demo/nest/firebase';
import { Injectable } from '@nestjs/common';

import type {
  FirebaseAdmin,
  FirebaseDatabaseReference,
} from '@alethio-demo/nest/firebase';
import { Observable } from 'rxjs';

interface AlethioResponse {
  data: unknown;
  errors: any;
}

interface AlethioAccountTransactionsResponse extends AlethioResponse {
  data: unknown[];
  links: {
    prev: string;
    next: string;
  };
  meta: {
    count: number;
    page: {
      prev: boolean;
      next: boolean;
    };
  };
}

@Injectable()
export class AccountsService {
  private accountsDatabaseRef: FirebaseDatabaseReference;

  constructor(
    @InjectAxiosInstance() private readonly rxios: RxiosInstance,
    @InjectFirebaseAdmin() readonly firebaseAdmin: FirebaseAdmin
  ) {
    this.accountsDatabaseRef = firebaseAdmin.database.ref('accounts');
  }

  getTransactions(address: string) {
    return this.retrieveDataFromDatabase(address).pipe(
      filter((dataFromDatabase) => !!dataFromDatabase?.data),
      mergeMapTo(
        this.rxios.get<AlethioAccountTransactionsResponse>(
          `transactions?filter[account]=${address}&page[limit]=25`
        )
      ),
      first(),
      map((transactions) => {
        if (transactions.errors) return transactions.errors;

        const data = {
          id: address,
          transactions: {
            data: transactions.data,
            links: transactions.links,
            meta: {
              count: transactions.meta.count,
              page: transactions.meta.page,
            },
          },
        };

        this.setAccountDataInDatabase(address, data);

        return {
          data,
        };
      })
    );
  }

  private retrieveDataFromDatabase(address: string) {
    return objectVal<AlethioAccountTransactionsResponse>(
      this.accountsDatabaseRef,
      address
    ).pipe(
      first(),
      map((data) => ({ data }))
    );
  }

  private setAccountDataInDatabase(address: string, data) {
    this.accountsDatabaseRef.child(address).set(data);
  }
}
