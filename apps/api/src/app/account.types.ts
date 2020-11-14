interface AlethioResponse {
  data: unknown;
  errors: any;
}

export interface AlethioAccountTransactionsResponse extends AlethioResponse {
  data: [];
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

export interface Account {
  id: string;
  isTracked: boolean;
  queryDate: number;
  transactions: {
    data: [];
    links: any;
    meta: {
      count: number;
      page: any;
    };
  };
}

export interface AccountResponse {
  data?: Account;
  errors?: any;
}
