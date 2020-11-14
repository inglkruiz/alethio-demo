import type { RxiosInstance } from '@alethio-demo/nest/axios';
import _orderBy from 'lodash/orderBy';
import { listVal, objectVal } from 'rxfire/database';
import { from, Observable, of } from 'rxjs';
import { concatMapTo, first, map, mergeMap } from 'rxjs/operators';

import { InjectAxiosInstance } from '@alethio-demo/nest/axios';
import { InjectFirebaseAdmin } from '@alethio-demo/nest/firebase';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import type {
  FirebaseAdmin,
  FirebaseDatabaseReference,
} from '@alethio-demo/nest/firebase';
import type {
  AccountResponse,
  AlethioAccountTransactionsResponse,
  Account,
} from './account.types';

@Injectable()
export class AccountService {
  private accountsDatabaseRef: FirebaseDatabaseReference;

  constructor(
    @InjectAxiosInstance() private readonly rxios: RxiosInstance,
    @InjectFirebaseAdmin() readonly firebaseAdmin: FirebaseAdmin
  ) {
    this.accountsDatabaseRef = firebaseAdmin.database.ref('accounts');
  }

  getList() {
    return this.retrieveDbList();
  }

  get(address: string): Observable<AccountResponse> {
    return this.retrieveDbObject(address).pipe(
      mergeMap<Account, Observable<AccountResponse>>((dataFromDatabase) => {
        if (dataFromDatabase?.id) {
          return of({
            data: dataFromDatabase,
          });
        }

        return this.getAlethioTransactions(address);
      })
    );
  }

  toggleIsTracked(address: string) {
    return this.retrieveDbObject(address).pipe(
      mergeMap((dataFromDatabase) => {
        if (!dataFromDatabase) {
          throw new HttpException(
            "Account's address not found",
            HttpStatus.NOT_FOUND
          );
        }

        return this.updateDbIsTracked(dataFromDatabase);
      })
    );
  }

  private getAlethioTransactions(address: string) {
    return this.rxios
      .get<AlethioAccountTransactionsResponse>('transactions', {
        'filter[account]': address,
        'page[limit]': 25,
      })
      .pipe(
        first(),
        map((transactions) => {
          if (transactions.errors) return { errors: transactions.errors };

          const data: Account = {
            id: address,
            isTracked: false,
            queryDate: Date.now(),
            transactions: {
              data: transactions.data,
              links: transactions.links,
              meta: {
                count: transactions.meta.count,
                page: transactions.meta.page,
              },
            },
          };

          this.saveDb(address, data);

          return {
            data,
          };
        })
      );
  }

  private updateDbIsTracked(
    account: Account
  ): Observable<{ data: Pick<Account, 'id' | 'isTracked'> }> {
    return from(
      this.accountsDatabaseRef.child(account.id).update({
        isTracked: !account.isTracked,
      })
    ).pipe(
      concatMapTo(
        objectVal<boolean>(
          this.accountsDatabaseRef.child(`${account.id}/isTracked`)
        )
      ),
      first(),
      map((isTracked) => ({ data: { id: account.id, isTracked } }))
    );
  }

  private retrieveDbObject(address: string): Observable<Account> {
    return objectVal<Account>(this.accountsDatabaseRef.child(address)).pipe(
      first()
    );
  }

  private retrieveDbList() {
    return listVal<Account>(this.accountsDatabaseRef).pipe(
      first(),
      map((data) => ({ data: _orderBy(data, ['queryDate'], ['desc']) }))
    );
  }

  private saveDb(address: string, data: Account) {
    this.accountsDatabaseRef.child(address).set(data);
  }
}
