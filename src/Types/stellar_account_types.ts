export interface StellarAccount {
  _links: {
    self: {
      href: string;
    };
    transactions: {
      href: string;
      templated: boolean;
    };
    operations: {
      href: string;
      templated: boolean;
    };
    payments: {
      href: string;
      templated: boolean;
    };
    effects: {
      href: string;
      templated: boolean;
    };
    offers: {
      href: string;
      templated: boolean;
    };
    trades: {
      href: string;
      templated: boolean;
    };
    data: {
      href: string;
      templated: boolean;
    };
  };
  id: string;
  account_id: string;
  sequence: string;
  sequence_ledger: number;
  sequence_time: string;
  subentry_count: number;
  inflation_destination: string;
  home_domain: string;
  last_modified_ledger: number;
  last_modified_time: string;
  thresholds: {
    low_threshold: number;
    med_threshold: number;
    high_threshold: number;
  };
  flags: {
    auth_required: boolean;
    auth_revocable: boolean;
    auth_immutable: boolean;
    auth_clawback_enabled: boolean;
  };
  balances: Array<{
    balance: string;
    limit?: string;
    buying_liabilities: string;
    selling_liabilities: string;
    last_modified_ledger?: number;
    is_authorized?: boolean;
    is_authorized_to_maintain_liabilities?: boolean;
    is_clawback_enabled?: boolean;
    asset_type: string;
    asset_code?: string;
    asset_issuer?: string;
  }>;
  signers: Array<{
    weight: number;
    key: string;
    type: string;
  }>;
  data: Record<string, unknown>;
  num_sponsoring: number;
  num_sponsored: number;
  paging_token: string;
}

export interface StellarPayment {
  _links: {
    self: {
      href: string;
      templated: boolean;
    };
    transaction: {
      href: string;
      templated: boolean;
    };
    effects: {
      href: string;
      templated: boolean;
    };
    next: {
      href: string;
    };
    prev: {
      href: string;
    };
  };
  _embedded: {
    records: Array<{
      id: string;
      paging_token: string;
      transaction_successful: boolean;
      source_account: string;
      type: string;
      type_i: string;
      created_at: string;
      transaction_hash: string;
      asset_type: string;
      asset_issuer: string;
      asset_code?: string;
      from: string;
      to: string;
      amount: string;
    }>;
  };
}

export interface Balance {
  asset_code?: string;
  balance: number;
  issuer?: string;
}

export interface AccountData {
  address: string;
  balances: Balance[];
  trustline_count: number;
  total_transaction_count: number;
  created: string;
}

export interface Payment {
  id: string; // the transaction_hash
  asset_code: string;
  asset_type: string;
  issuer: string;
  from: string;
  to: string;
  amount: number; // from transaction's effect
  type: string;
  created: string;
  successful: boolean;
  next_page?: string;
  prev_page?: string;
  cursor?: string;
}
