import { useAccount } from 'wagmi';

import { AccountStatus } from '../contant';
import { LoopringAPI } from '../api_wrapper';
import * as sdk from '@loopring-web/loopring-sdk'
import { ConnectProvides, connectProvides } from './make/providers';
import React from 'react';
import { useSystem } from './useSystem';
import { l2Account } from './make/makeL2Account';


export const useLoopringAccount = () => {
  const account = useAccount();
  const [accountInfo, setAccountInfo] = React.useState<any>(l2Account);
  const subject = React.useMemo(() => ConnectProvides.subscribe(), []);
  React.useEffect(()=>{
    const subscription = subject.subscribe((props) => {
      console.log('useL2Account',props)
      setAccountInfo(l2Account)
    });
    return () => {
      subscription.unsubscribe();
    };
  },[])
  const system =useSystem();
  const onUnlockAccount = async () => {
    const accountInfo = l2Account.l2Account;
    const exchangeInfo = system.system?.exchangeInfo;
    if (exchangeInfo?.exchangeAddress && accountInfo && accountInfo.nonce !== undefined && accountInfo.accountId) {
      const connectName = sdk.ConnectorNames[ (account.connector?.name ?? sdk.ConnectorNames.Unknown) as sdk.ConnectorNames ];
      const walletTypePromise: Promise<{ walletType: any }> =
        window.ethereum &&
        connectName === sdk.ConnectorNames.MetaMask
          // &&isMobile
          ? Promise.resolve({walletType: undefined})
          : LoopringAPI.walletAPI.getWalletType({
            wallet: account.address as string,
          });
      const [
        // { accInfo }
        {walletType}] = await Promise.all([
        // LoopringAPI.exchangeAPI.getAccount({
        //   owner: account.address,
        // }),
        walletTypePromise,
      ])
        .then((response) => {
          if ((response[ 0 ] as sdk.RESULT_INFO)?.code) {
            throw response[ 0 ];
          }
          return response as any;
        })
        .catch((error) => {
          throw error;
        });
      const nonce = accountInfo.nonce;

      const msg =
        accountInfo.keySeed && accountInfo.keySeed !== ""
          ? accountInfo.keySeed
          : sdk.GlobalAPI.KEY_MESSAGE.replace(
            "${exchangeAddress}",
            exchangeInfo.exchangeAddress
          ).replace("${nonce}", (nonce - 1).toString());

      try {
        const response = await LoopringAPI.userAPI.unLockAccount(
          {
            keyPair: {
              web3: connectProvides.usedWeb3,
              address: account.address as string,
              keySeed: msg,
              walletType: connectName,
              chainId: exchangeInfo.chainId,
              accountId: accountInfo.accountId,
              isMobile: false, //todo flag for is mobile
            },
            request: {
              accountId: accountInfo.accountId,
            },
          },
          accountInfo?.publicKey as any
        );
        const {apiKey, eddsaKey, counterFactualInfo} = response as any;
        if (apiKey && eddsaKey) {
          l2Account.updateL2Account({
            apiKey,
            eddsaKey,
            publicKey: {
              x: sdk.toHex(sdk.toBig(eddsaKey.keyPair.publicKeyX)),
              y: sdk.toHex(sdk.toBig(eddsaKey.keyPair.publicKeyY)),
            } as any,
            isInCounterFactualStatus: walletType?.isInCounterFactualStatus,
            isContract: walletType?.isContract,
            readyState: AccountStatus.ACTIVATED,
            counterFactualInfo
          })

        }
      } catch (error) {
        console.log('error', error)
      }


    }
  }
  const onLockAccount = async () => {
    l2Account.updateL2Account({
      apiKey: undefined as any,
      eddsaKey: undefined as any,
      readyState: AccountStatus.LOCKED,
      // isInCounterFactualStatus: walletType?.isInCounterFactualStatus,
      // isContract: walletType?.isContract,
      // readyState: AccountStatus.ACTIVATED,
      // counterFactualInfo
    })
    // setAccountInfo((state) => {
    //   return {
    //     ...state,
    //     apiKey: undefined as any,
    //     eddsaKey: undefined as any,
    //     readyState: AccountStatus.LOCKED
    //   }
    // })
  }
  // console.log('use',l2Account.l2Account)
  React.useEffect(() => {
    setAccountInfo(l2Account.l2Account);
  }, [l2Account.l2Account, l2Account.l2Account?.readyState])
  return {
    // setAccountInfo,
    onUnlockAccount,
    onLockAccount,
    ...accountInfo,
  }
}