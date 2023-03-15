import * as sdk from "@loopring-web/loopring-sdk";
import Web3 from "web3";
import { LoopringAPI } from './index';
import { getAccount,getNetwork } from '@wagmi/core'
import { getTimestampDaysLater } from './dt_tools';
import { connectProvides } from '../core/make/providers';
export enum ConnectProvidersSignMap {
  Unknown = "Unknown",
  MetaMask = "MetaMask",
  WalletConnect = "WalletConnect",
  Coinbase = "OtherExtension",
  GameStop = "GameStop"
}

export async function activateAccount({
  isHWAddr,
  feeInfo,
}: {
  isHWAddr: boolean;
  feeInfo?: any;
  isReset?: boolean;
}): Promise<any> {
  // let result: ActionResult =;
  let eddsaKey = undefined; //isReset ?  //: account.eddsaKey;
  const { tokensMap:tokenMap } =  await LoopringAPI.exchangeAPI?.getTokens();
  const { exchangeInfo } = await LoopringAPI.exchangeAPI.getExchangeInfo()

  const {
    address,
    connector,
    isConnecting,
    isReconnecting,
    isConnected,
    isDisconnected,
    status,
  } = getAccount();
  const { chain, chains } = getNetwork()
  
     console.log('connector',connector)
  if (
    !exchangeInfo?.exchangeAddress ||
    !chain ||
    !connectProvides.usedWeb3 ||
    // chain.id === NETWORKEXTEND.NONETWORK ||
    !connector ||
    !LoopringAPI?.exchangeAPI ||
    !address
  ) {
    throw { code: "UIERROR_CODE.DATA_NOT_READY" };
  }
  const chainId = chain.id;
  const  connectName  = connector.name;
  let accInfo;
  try {
    const accountResponse = await LoopringAPI.exchangeAPI.getAccount({
      owner: address.toString(),
    });
    if (
      (accountResponse as sdk.RESULT_INFO).code ||
      (accountResponse as sdk.RESULT_INFO).message
    ) {
      throw accountResponse;
    } else {
      accInfo = accountResponse.accInfo;
    }
  } catch (error: any) {
    throw error;
  }

  let keySeed = sdk.GlobalAPI.KEY_MESSAGE.replace(
    "${exchangeAddress}",
    exchangeInfo.exchangeAddress
  ).replace("${nonce}", accInfo.nonce.toString());

  if (feeInfo?.belong && feeInfo.feeRaw) {
    const feeToken = tokenMap[feeInfo.belong];
    const tokenId = feeToken.tokenId;
    const fee = feeInfo.feeRaw;
    try {
      eddsaKey = await sdk.generateKeyPair({
        web3: connectProvides.usedWeb3 as unknown as Web3,
        address: accInfo.owner,
        keySeed,
        // @ts-ignore
        walletType: (ConnectProvidersSignMap[connectName] ??
          connectName) as unknown as sdk.ConnectorNames,
        chainId: chainId as any,
        counterFactualInfo: undefined,
      });
    } catch (error: any) {
      throw error;
    }
     console.log("generateKeyPair done");

    const request: sdk.UpdateAccountRequestV3 = {
      exchange: exchangeInfo.exchangeAddress,
      owner: accInfo.owner,
      accountId: accInfo.accountId,
      publicKey: { x: eddsaKey.formatedPx, y: eddsaKey.formatedPy },
      maxFee: {
        tokenId,
        volume: fee.toString(),
      },
      validUntil: getTimestampDaysLater(30),
      keySeed,
      nonce: accInfo.nonce as number,
    };
     console.log("updateAccountFromServer req:", request);
    try {
      const response = await LoopringAPI?.userAPI?.updateAccount(
        {
          request,
          // @ts-ignore
          web3: connectProvides.usedWeb3 as unknown as Web3,
          chainId: chainId,
          // @ts-ignore
          walletType: (ConnectProvidersSignMap[connectName] ??
            connectName) as unknown as sdk.ConnectorNames,
          isHWAddr,
        },
        {
          accountId: accInfo.accountId,
          counterFactualInfo: eddsaKey.counterFactualInfo,
        }
      );
      if (
        (response as sdk.RESULT_INFO).code ||
        (response as sdk.RESULT_INFO).message
      ) {
        throw response;
      } else {
        console.log("updateAccountResponse:", response);
        return {
          eddsaKey,
          accInfo,
          // code: ActionResultCode.NoError,
          // data: { eddsaKey, accInfo },
        };
      }                                                 ``
    } catch (error) {
      throw error;
    }
  } else {
    throw { code: "UIERROR_CODE.ERROR_ON_FEE_UI" };
  }
}
