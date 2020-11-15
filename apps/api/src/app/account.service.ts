import _isNil from 'lodash/isNil';
import _orderBy from 'lodash/orderBy';
import _pick from 'lodash/pick';
import { listVal, objectVal } from 'rxfire/database';
import { from, Observable, of } from 'rxjs';
import { concatMap, concatMapTo, exhaustMap, first, map, tap } from 'rxjs/operators';

import { InjectFirebaseAdmin } from '@alethio-demo/nest/firebase';
import { HttpException, HttpService, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { environment } from '../environments/environment';

import type {
  FirebaseAdmin,
  FirebaseDatabaseReference,
} from '@alethio-demo/nest/firebase';
import type {
  AccountResponse,
  AlethioAccountTransactionsResponse,
  Account,
  AlethioAccountTransaction,
} from './account.types';
import type { AlethioWebhookResponse } from './webhook.types';

@Injectable()
export class AccountService {
  private accountsDbRef: FirebaseDatabaseReference;
  private webhooksDbRef: FirebaseDatabaseReference;

  constructor(
    private http: HttpService,
    @InjectFirebaseAdmin() readonly firebaseAdmin: FirebaseAdmin,
    private config: ConfigService
  ) {
    this.accountsDbRef = firebaseAdmin.database.ref('accounts');
    this.webhooksDbRef = firebaseAdmin.database.ref('webhooks/accounts');
  }

  getList() {
    return this.retrieveDbList();
  }

  get(address: string): Observable<AccountResponse> {
    return this.retrieveDbObject(address).pipe(
      exhaustMap<Account, Observable<AccountResponse>>((dataFromDatabase) => {
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
      exhaustMap((dataFromDatabase) => {
        if (!dataFromDatabase) {
          throw new HttpException(
            "Account's address not found",
            HttpStatus.NOT_FOUND
          );
        }

        return this.updateDbIsTracked(dataFromDatabase).pipe(
          concatMap((account) =>
            this.retrieveDbWebhook(account.id).pipe(
              map((webhook) => ({ webhook, account }))
            )
          ),
          concatMap(({ webhook: webhookFromDB, account }) =>
            _isNil(webhookFromDB?.data)
              ? this.createAlethioWebhookOnTransaction(account)
              : this.updateAlethioWebhookOnTransaction(
                  webhookFromDB.data.id,
                  account
                )
          ),
          map(({ webhook, account }) => {
            this.saveDbWebhook(account.id, webhook);
            return { data: account };
          })
        );
      })
    );
  }

  private getAlethioTransactions(address: string) {
    return this.http
      .get<AlethioAccountTransactionsResponse>('transactions', {
        params: {
          'filter[account]': address,
          'page[limit]': 25,
        },
      })
      .pipe(
        first(),
        map((axiosResponse) => {
          const transactions = axiosResponse.data;

          if (transactions.errors) return { errors: transactions.errors };

          const data: Account = {
            id: address,
            isTracked: false,
            queryDate: Date.now(),
            transactions: {
              data: transactions.data.map((txn) => {
                const { id, attributes, relationships } = _pick(txn, [
                  'id',
                  'attributes',
                  'relationships',
                ]);
                const from = _pick(relationships.from, ['data.id']);
                const to = _pick(relationships.to, ['data.id']);

                return {
                  id,
                  attributes: _pick(attributes, ['fee', 'globalRank', 'value']),
                  relationships: {
                    from,
                    to,
                  },
                } as AlethioAccountTransaction;
              }),
              links: transactions.links,
              meta: {
                count: transactions.meta.count,
                page: transactions.meta.page,
              },
            },
          };

          this.saveDbObject(address, data);

          return {
            data,
          };
        })
      );
  }

  private createAlethioWebhookOnTransaction(account: Pick<Account, 'id'>) {
    if (!environment.production)
      return of({ webhook: null as AlethioWebhookResponse, account });

    return this.http
      .post<AlethioWebhookResponse>(
        'webhooks',
        {
          data: {
            type: 'Webhook',
            attributes: {
              source: 'api',
              target: `https://${this.config.get(
                'APP_NAME'
              )}.herokuapp.com/api/account/${account.id}`,
              config: {
                endpoint: 'https://api.aleth.io/v1/transactions',
                filters: {
                  'filter[account]': account.id,
                  'page[limit]': 25,
                },
                confirmations: 1,
              },
            },
          },
        },
        {
          headers: {
            'Content-Type': 'application/vnd.api+json',
          },
        }
      )
      .pipe(
        first(),
        tap((response) => console.log(`Webhook created: %O`, response.data)),
        map((response) => ({ webhook: response.data, account }))
      );
  }

  private updateAlethioWebhookOnTransaction(
    id: string,
    account: Pick<Account, 'id' | 'isTracked'>
  ) {
    if (!environment.production)
      return of({ webhook: null as AlethioWebhookResponse, account });

    const action = account.isTracked ? 'resume' : 'pause';

    return this.http
      .post<AlethioWebhookResponse>(`webhooks/${id}/${action}`)
      .pipe(
        first(),
        tap((response) => console.log(`Webhook ${action}: %O`, response.data)),
        map((response) => ({ webhook: response.data, account }))
      );
  }

  private updateDbIsTracked(
    account: Account
  ): Observable<Pick<Account, 'id' | 'isTracked'>> {
    return from(
      this.accountsDbRef.child(account.id).update({
        isTracked: !account.isTracked,
      })
    ).pipe(
      concatMapTo(
        objectVal<boolean>(this.accountsDbRef.child(`${account.id}/isTracked`))
      ),
      first(),
      map((isTracked) => ({ id: account.id, isTracked }))
    );
  }

  private retrieveDbWebhook(address: string) {
    return objectVal<AlethioWebhookResponse>(
      this.webhooksDbRef.child(address)
    ).pipe(first());
  }

  private retrieveDbObject(address: string): Observable<Account> {
    return objectVal<Account>(this.accountsDbRef.child(address)).pipe(first());
  }

  private retrieveDbList() {
    return listVal<Account>(this.accountsDbRef).pipe(
      first(),
      map((data) => ({ data: _orderBy(data, ['queryDate'], ['desc']) }))
    );
  }

  private saveDbObject(address: string, data: Account) {
    this.accountsDbRef.child(address).set(data);
  }

  private saveDbWebhook(address: string, data: any) {
    this.webhooksDbRef.child(address).set(data);
  }
}
