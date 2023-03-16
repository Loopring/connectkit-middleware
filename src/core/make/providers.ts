import { jsonRpcProvider } from "wagmi/providers/jsonRpc";
import { configureChains, mainnet, createClient, goerli } from "wagmi";
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'
import Web3 from "web3";
import { WalletConnectLegacyConnector } from "wagmi/connectors/walletConnectLegacy";
import { ChainId } from "loopring-sdk";
import { provider as TypeProviders } from 'web3-core';
import { watchAccount, watchNetwork, getProvider, getNetwork, getAccount } from '@wagmi/core'
import { LoopringAPI } from '../../api_wrapper';
import { getDefaultClient } from 'connectkit';
import { system } from './makeSystem';
import { l2Account } from './makeL2Account';
import { Subject } from "rxjs";



// import { infuraProvider } from "wagmi/providers/infura";
// import UniversalProvider from "@walletconnect/universal-provider";


const POLLING_INTERVAL = 12000;
const DEFAULT_HTTPS_BRIDGE = "https://bridge.walletconnect.org";
const DEFAULT_WEBSOCKET_BRIDGE = "wss://bridge.walletconnect.org";
 const subject = new Subject<{
  status: any;
  data?:any;
}>();

// import { infuraProvider } from 'wagmi/providers/infura'

/**
 * this will follow the UI framework & .env file, eg react used REACT_APP_RPC
 * @type {ConnectProvides}
 */

export class ConnectProvides {
  private static _APP_FRAMEWORK:string = "REACT_APP_";
  private unwatchs:any[] = [];
  private _usedWeb3: undefined | Web3;
  private _usedProvide:
    | undefined
    | TypeProviders;

  public static get APP_FRAMEWORK() {
    return ConnectProvides._APP_FRAMEWORK;
  }
  public get usedWeb3() {
    return this._usedWeb3
  }
  public get usedProvide() {
    return this._usedProvide
  }
  public static  subscribe(){
    return subject.asObservable()
  }


   constructor({ APP_FRAMeWOR = "UI_APP_RPC" }) {
    ConnectProvides._APP_FRAMEWORK = APP_FRAMeWOR;
    LoopringAPI.InitApi(1);
    system.makeSystem({network:{chain:{id:1}}});
  }
  async getConnectClient (){
    const { wagmiClient }= await configProvider();
    // wagmiClient.subscribe('con')
    return {wagmiClient};
  }
  async afterConnectedDo(){
    // const network = fetch
    this.unwatchs = [
      watchNetwork(async (network) =>{
        const chainId = [1,5].includes(network?.chain?.id??-1)?network.chain?.id:"unknown";
        if(chainId!=="unknown" && system.system?.chain?.id !== chainId){
          console.log('watchNetwork network',network)
          LoopringAPI.InitApi(chainId as any);
          await system .makeSystem({network});
          console.log('watchNetwork network after',LoopringAPI.__chainId__,system.system)
          const baseURL =
            ChainId.MAINNET === chainId
              ? `https://${process.env.REACT_APP_API_URL}`
              : `https://${process.env.REACT_APP_API_URL_UAT}`;
          // const socketURL =
          //   ChainId.MAINNET === chainId
          //     ? `wss://ws.${process.env.REACT_APP_API_URL}/v3/ws`
          //     : `wss://ws.${process.env.REACT_APP_API_URL_UAT}/v3/ws`;
          // const etherscanBaseUrl =
          //   ChainId.MAINNET === chainId
          //     ? `https://etherscan.io/`
          //     : `https://goerli.etherscan.io/`;
          LoopringAPI.userAPI?.setBaseUrl(baseURL);
          LoopringAPI.exchangeAPI?.setBaseUrl(baseURL);
          LoopringAPI.globalAPI?.setBaseUrl(baseURL);
          LoopringAPI.ammpoolAPI?.setBaseUrl(baseURL);
          LoopringAPI.walletAPI?.setBaseUrl(baseURL);
          LoopringAPI.wsAPI?.setBaseUrl(baseURL);
          LoopringAPI.nftAPI?.setBaseUrl(baseURL);
          LoopringAPI.delegate?.setBaseUrl(baseURL);
        }
        const account = getAccount();
        await l2Account.makeL2Account(account,network?.chain?.id??1)
        subject.next({
          status:'update',
          data: {
            system:system.system,
            l2Account:l2Account.l2Account
          },
        });
      }),
      watchAccount(async (account) => {
        console.log('watchAccount account',account)
        const network = getNetwork();
        await l2Account.makeL2Account(account,network?.chain?.id??1)
        console.log('watchAccount account after',l2Account.l2Account);
        subject.next({
          status:'update',
          data: {
            l2Account:l2Account.l2Account
          },
        });

      })];
    // const network =  getNetwork();
    const provider = getProvider();
    console.log('connect provider',provider)
    if(provider){
      this._usedProvide = provider as any;
      this._usedWeb3 = new Web3(provider as any);
    }
  }
  async afterDisConnectDo(){
    this.unwatchs?.forEach((unwatch)=>{
      unwatch && unwatch()
    })
    // await disconnect()
    this._usedProvide = undefined;
    this._usedWeb3 = undefined;
  }
}


export const connectProvides = new ConnectProvides({
  APP_FRAMeWOR: "REACT_APP_"
});
//@ts-ignore
window.connectProvides = connectProvides;

const getEnvVariable = (name: string): string => {
  return process.env[`${ConnectProvides.APP_FRAMEWORK}${name}`] ?? "";
};


const withLoopringBridge = async ({
                                    isBridge = false,
                                    isLegacyBridge = false
                                  }: {
  isBridge?: boolean;
  isLegacyBridge?: boolean;
}) => {
  if (isBridge) {
    return new WalletConnectConnector({
      chains: [mainnet, goerli],
      options: {
        // relayUrl: BRIDGE_URL,
        projectId: "e9f9b27388f7d9bdb5f9a9ee81a5ab8d",
        metadata: {
          name: 'ConnectKit Loopring',
          description: "Loopring Dapp",
          url: "https://loopring.org",
          icons: ["https://static.loopring.io/assets/svg/loopring.svg"]
        },
      },
    });
  } else if (isLegacyBridge) {
    /**
     * This part is base on those who self set up a bridge demo is used loopring bridge
     * @type {string|string}
     */
    const BRIDGE_URL =
      (await fetch(getEnvVariable("HTTP") + getEnvVariable("CONNECT_PING"))
        .then(({ status }) => {
          return status === 200
            ? getEnvVariable("HTTP") + getEnvVariable("CONNECT_PING")
            : DEFAULT_HTTPS_BRIDGE;
        })
        .catch(() => {
          return DEFAULT_HTTPS_BRIDGE;
        })) ?? DEFAULT_HTTPS_BRIDGE;
    return new WalletConnectLegacyConnector({
      options: {
        rpc: RPC_URLS,
        bridge: BRIDGE_URL,
        chainId: 1,
        clientMeta: {
          description: 'ConnectKit Loopring',
          url: "https://loopring.org",
          icons: ["https://static.loopring.io/assets/svg/loopring.svg"],
          name: "LRC"

        }
      }
    })
  };
}

const GET_GBRIDGE_URL = async (isInfra = false) => {

    const BRIDGE_URL =
      (await fetch(getEnvVariable("HTTP") + getEnvVariable("CONNECT_PING"))
        .then(({ status }) => {
          return status === 200
            ? getEnvVariable("WEBSOCKET") + getEnvVariable("CONNECT_PING")
            : DEFAULT_WEBSOCKET_BRIDGE;
        })
        .catch(() => {
          return DEFAULT_WEBSOCKET_BRIDGE;
        })) ?? DEFAULT_WEBSOCKET_BRIDGE;
    return BRIDGE_URL;
};

export const RPC_URLS: { [ chainId: number ]: string } = {
  1: process.env[ `${ConnectProvides.APP_FRAMEWORK}RPC_URL_1` ] as string,
  5: process.env[`${ConnectProvides.APP_FRAMEWORK}RPC_URL_5`] as string,
};

export const configProvider = async () => {
  // const providers: any[]= [await withLoopringProvide(false)]
  const BRIDGE_URL = await GET_GBRIDGE_URL();
  const providers:any[] = [];
  providers.push(jsonRpcProvider({
    rpc: (chain) => ({
      http: RPC_URLS[chain.id as ChainId],
      webSocket: BRIDGE_URL
    })
  }));
  // providers.push(publicProvider());
  const { provider, chains,webSocketProvider } = configureChains(
    [mainnet,goerli],
    providers,
    { pollingInterval: 3000},
  );

  const bridge = await withLoopringBridge({ isBridge: true });
  // const legacyBridge = await withLoopringBridge({ isLegacyBridge: true })

  const  connectors:any[] = [
    new MetaMaskConnector({ chains }),
    new CoinbaseWalletConnector({
      chains,
      options: {
        appName: 'loopring',
      },
    }),
    new InjectedConnector({ chains }),
    bridge,
  ];
  // console.log(provider,connectors,provider)


  // const wagmiClientConfig = {
  //   autoConnect: true,
  //   connectors: connectors,
  //   provider: provider,
  //   webSocketProvider,
  // };
  const wagmiClientConfig  = getDefaultClient({
    appName: 'ConnectKit Loopring',
    chains,
    connectors,
    provider,
    webSocketProvider,
  })
  // console.log(wagmiClientConfig)
  // wagmiClientConfig.provider.on('')


  const wagmiClient = createClient(wagmiClientConfig);
  // wagmiClient.provider.on("connect", (code: number, reason: string) => {
  //   connectProvides.afterConnectedDo()
  // });
  // wagmiClient.provider.on("disconnect", (code: number, reason: string) => {
  //   connectProvides.afterDisConnectDo()
  // });
  console.log(wagmiClient)

  return { wagmiClient };
};





