import { useAccount } from 'wagmi';

import { AccountStatus } from '../contant';
import { LoopringAPI } from '../api_wrapper';
import * as sdk from '@loopring-web/loopring-sdk'
import { ConnectProvides, connectProvides } from './make/providers';
import React from 'react';
import { useSystem } from './useSystem';
import { l2Account } from './make/makeL2Account';
import { getProvider } from '@wagmi/core';
import Web3 from 'web3';


export const useLoopringAccount = () => {
  const account = useAccount();
  const {exchangeInfo} = useSystem();

  const [accountInfo, setAccountInfo] = React.useState<any>(l2Account);
  const subject = React.useMemo(() => ConnectProvides.subscribe(), []);
  React.useEffect(()=>{
    const subscription = subject.subscribe(({data:{l2Account}}) => {
      if(l2Account){
        console.log('subscribe l2Account',l2Account)
        setAccountInfo(l2Account)
      }
    });
    return () => {
      subscription.unsubscribe();
    };
  },[])
  const onUnlockAccount = async () => {
    // const accountInfo = l2Account.l2Account;
    console.log('onUnlockAccount');
    if (exchangeInfo?.exchangeAddress && accountInfo && accountInfo.nonce !== undefined && accountInfo.accountId) {
      const connectName = sdk.ConnectorNames[ (account.connector?.name ?? sdk.ConnectorNames.Unknown) as sdk.ConnectorNames ];
      console.log('onUnlockAccount',connectName);
      const walletTypePromise: Promise<{ walletType: any }> =
        window.ethereum &&
        connectName === sdk.ConnectorNames.MetaMask
          ? Promise.resolve({walletType: undefined})
          : LoopringAPI.walletAPI.getWalletType({
            wallet: account.address as string,
          });
      const [
        {walletType}] = await Promise.all([
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
      console.log('onUnlockAccount msg',msg,connectProvides.usedWeb3,connectProvides.usedProvide);
      try {
        const response = await LoopringAPI.userAPI.unLockAccount(
          {
            keyPair: {
              web3: connectProvides.usedWeb3 as unknown as Web3,
              address:  account.address as string,
              keySeed: msg,
              walletType: connectName,
              chainId:exchangeInfo.chainId,
              accountId: accountInfo.accountId,
              isMobile: false, //todo flag for is mobile
            },
            request: {
              accountId:  accountInfo.accountId,
            },
          },
          accountInfo?.publicKey as any
        );
        // const provider = getProvider();
        // const web3 = new Web3()
        // const response = await LoopringAPI.userAPI.unLockAccount(
        //   {
        //     keyPair: {
        //       web3: connectProvides.usedWeb3,
        //       address: account.address as string,
        //       keySeed: msg,
        //       walletType: connectName,
        //       chainId: exchangeInfo.chainId,
        //       accountId: accountInfo.accountId,
        //       isMobile: false, //todo flag for is mobile
        //     },
        //     request: {
        //       accountId: accountInfo.accountId,
        //     },
        //   },
        //   accountInfo?.publicKey as any
        // );
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
    })
  }
  // React.useEffect(() => {
  //   setAccountInfo(l2Account.l2Account);
  // }, [l2Account.l2Account, l2Account.l2Account?.readyState])
  return {
    // setAccountInfo,
    onUnlockAccount,
    onLockAccount,
    ...accountInfo,
  }
}