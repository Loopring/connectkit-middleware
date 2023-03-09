// import {WalletConnectProvide} from "./walletConnect";
// import { MetaMaskProvide } from "./metamask";
// import { CoinbaseProvide } from "./coinbase";
import { ChainId } from "loopring-sdk";
import Web3 from "web3";
import { IpcProvider } from "web3-core";
// import WalletConnectProvider from "@walletconnect/web3-provider";
// import { CoinbaseWalletProvider } from "@coinbase/wallet-sdk";
// import {
//   ConnectProviders,
//   ExtensionSubscribe,
//   ExtensionUnsubscribe,
//   WalletConnectSubscribe,
//   WalletConnectUnsubscribe
// } from "./command";
// import { Web3Provider } from "@ethersproject/providers";
// import { WalletConnectV2Provide } from './walletconnect2.0';
// import WalletConnectProviderV2 from '@walletconnect/ethereum-provider';

export class ConnectProvides {
  private static _APP_FRAMEWORK:string;
  // private static set APP_FRAMEWORK(value) {
  //   ConnectProvides._APP_FRAMEWORK = value;
  // }
  public static get APP_FRAMEWORK() {
    return ConnectProvides._APP_FRAMEWORK;
  }

  // public static set APP_FRAMeWORK(vaule: string) {
  //   ConnectProvides._APP_FRAMeWORK = vaule;
  // }
  constructor({ APP_FRAMeWOR = "UI_APP_RPC" }) {
    ConnectProvides._APP_FRAMEWORK = APP_FRAMeWOR;
  }
}

/**
 * this will follow the UI framework & .env file, eg react used REACT_APP_RPC
 * @type {ConnectProvides}
 */
export const connectProvides = new ConnectProvides({
  APP_FRAMeWOR: "REACT_APP_RPC"
});

