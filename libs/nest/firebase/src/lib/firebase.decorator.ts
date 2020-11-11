import { Inject } from '@nestjs/common';

import { FIREBASE_TOKEN } from './firebase.constants';

export function InjectFirebaseAdmin() {
  return Inject(FIREBASE_TOKEN);
}
