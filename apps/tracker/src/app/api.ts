import axios from 'axios';

import { environment } from '../environments/environment';

const http = axios.create({
  baseURL: `${environment.api}`,
});

const basePath = '/accounts';

export function getAccounts() {
  return http.get(basePath);
}

export function getAccount(address: string) {
  return http.get(`${basePath}/${address}`);
}

export function toggleAccountIsTracked(address: string) {
  return http.put(`${basePath}/${address}/toggle-is-tracked`);
}
