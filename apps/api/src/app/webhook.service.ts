import { objectVal } from 'rxfire/database';
import { of } from 'rxjs';
import { catchError, first, map } from 'rxjs/operators';

import { InjectFirebaseAdmin } from '@alethio-demo/nest/firebase';
import { HttpService, Injectable } from '@nestjs/common';

import type {
  FirebaseAdmin,
  FirebaseDatabaseReference,
} from '@alethio-demo/nest/firebase';
import type { AlethioWebhookResponse } from './webhook.types';

@Injectable()
export class WebhookService {
  private webhooksDbRef: FirebaseDatabaseReference;
  constructor(
    private http: HttpService,
    @InjectFirebaseAdmin() readonly firebaseAdmin: FirebaseAdmin
  ) {
    this.webhooksDbRef = firebaseAdmin.database.ref('webhooks');
  }

  getList() {
    return this.http.get('webhooks').pipe(
      first(),
      map((response) => response.data),
      catchError((error) => {
        console.error(error);
        return of({});
      })
    );
  }

  delete(id: string) {
    return this.http.delete(`webhooks/${id}`).pipe(
      first(),
      map((response) => response.data)
    );
  }

  retrieveDbWebhook(address: string) {
    return objectVal<AlethioWebhookResponse>(
      this.webhooksDbRef.child(address)
    ).pipe(first());
  }

  saveDbWebhook(address: string, data: any) {
    this.webhooksDbRef.child(address).set(data);
  }
}
