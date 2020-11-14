import { Inject } from '@nestjs/common';

import { AXIOS_TOKEN } from './axios.constants';

export function InjectAxiosInstance() {
  return Inject(AXIOS_TOKEN);
}
