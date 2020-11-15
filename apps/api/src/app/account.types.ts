interface AlethioResponse {
  data: unknown;
  errors: any;
}

export interface AlethioAccountTransaction {
  id: string;
  attributes: {
    fee: string;
    globalRank: number[];
    value: string;
  };
  relationships: {
    from: {
      data: {
        id: string;
      };
    };
    to: {
      data: {
        id: string;
      };
    };
  };
}

export interface AlethioAccountTransactionsResponse extends AlethioResponse {
  data: AlethioAccountTransaction[];
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
    data: AlethioAccountTransaction[];
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
  };
}

export interface AccountResponse {
  data?: Account;
  errors?: any;
}
