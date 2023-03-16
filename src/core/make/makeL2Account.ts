import * as _wagmi_core from '@wagmi/core';
import { GetAccountResult } from '@wagmi/core';
import { LoopringAPI } from '../../api_wrapper';
import { Account, AccountStatus } from '../../contant';
import { connectSubject } from './providers';


class L2Account {
  private _l2Account: (Account & GetAccountResult<_wagmi_core.Provider>) = {} as any;
  public get l2Account() {
    return this._l2Account;
  }

  constructor() {
    // this.makeSystem({})


  }

  public updateL2Account(account: Partial<Account & GetAccountResult<_wagmi_core.Provider>>) {
    this._l2Account = {
      ...this._l2Account,
      ...account,
    } as any;

    connectSubject.next({
      status:'update',
      data: {
        l2Account:this._l2Account
      },
    });
    console.log(this._l2Account);
  }

  // @ts-ignore
  public async makeL2Account(account: GetAccountResult<_wagmi_core.Provider>, chainId) {
    let _accountInfo: any = {
      ...account,
      _chainId: [1, 5].includes(chainId) ? chainId : "unknown",
    }
    if (account.isConnected) {

      if (account.address !== this._l2Account?._address
        // ||
        //  (account.address == accountInfo._address &&
        //    accountInfo.accountId === -1)
      ) {
        this._l2Account = {
          _accountInfo,
          readyState: AccountStatus.CHECKING
        } as any
        const {accInfo} = await LoopringAPI.exchangeAPI.getAccount({
          owner: account.address as any,
        });
        if (accInfo === undefined) {
          _accountInfo = {
            ..._accountInfo,
            readyState: AccountStatus.NO_ACCOUNT
          }
        } else if (accInfo.accountId && accInfo.publicKey.x) {

          _accountInfo = {
            ..._accountInfo,
            ...accInfo,
            readyState: AccountStatus.LOCKED
          }
        } else if (accInfo.accountId) {
          _accountInfo = {
            ..._accountInfo,
            ...accInfo,
            readyState: AccountStatus.NOT_ACTIVE
          }
        }


      }
    } else if (!account.isConnected) {
       _accountInfo = {
        readyState: AccountStatus.UN_CONNECT
      } as any

    }
    this._l2Account = {
      ...this._l2Account,
      ..._accountInfo,
    } as any
    connectSubject.next({
      status:'update',
      data: {
        l2Account:this._l2Account
      },
    });
    console.log("_l2Account",this.l2Account)
  }


}
const l2Account =new L2Account()
export { l2Account };
