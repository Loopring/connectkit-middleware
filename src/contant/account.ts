import * as sdk from '@loopring-web/loopring-sdk'

export enum AccountStatus {
  UN_CONNECT = "UN_CONNECT",
  // CONNECT = 'CONNECT',
  NO_ACCOUNT = "NO_ACCOUNT",
  DEPOSITING = "DEPOSITING",
  NOT_ACTIVE = "NOT_ACTIVE",
  LOCKED = "LOCKED",
  ACTIVATED = "ACTIVATED",
  ERROR_NETWORK = "ERROR_NETWORK",
  CHECKING="CHECKING"
}

export type Account = {
  accAddress: string;
  qrCodeUrl: string;
  readyState: keyof typeof AccountStatus | "unknown";
  accountId: number;
  level: string;
  apiKey: string;
  frozen: boolean | undefined;
  eddsaKey: any;
  publicKey: any;
  keySeed: string;
  nonce: number | undefined;
  keyNonce: number | undefined;
  connectName: sdk.ConnectorNames;
  wrongChain?: boolean | undefined;
  isInCounterFactualStatus?: boolean;
  isContract1XAddress?: boolean;
  isContractAddress?: boolean;
  isCFAddress?: boolean;
  isContract?: boolean;
  _address:string;
  counterFactualInfo:undefined;
  _chainId?: 1 | 5 | "unknown";
  // _accountIdNotActive?: number;
  // _userOnModel?: boolean | undefined;
  // __timer__: NodeJS.Timer | -1;
};
export type AccountFull = {
  account: Account;
  resetAccount: () => void;
  updateAccount: (account: Partial<Account>) => void;
};
//
// export type AssetsRawDataItem = {
//   token: {
//     type: TokenType;
//     value: string;
//   };
//   amount: string;
//   available: string;
//   locked: string;
//   smallBalance: boolean;
//   tokenValueDollar: number;
//   name: string;
// };
