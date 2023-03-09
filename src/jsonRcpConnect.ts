import { jsonRpcProvider } from "wagmi/providers/jsonRpc";
// import { infuraProvider } from "wagmi/providers/infura";
import { configureChains, mainnet, createClient, goerli } from "wagmi";
import Web3 from "web3";
// import UniversalProvider from "@walletconnect/universal-provider";
import { WalletConnectLegacyConnector } from "wagmi/connectors/walletConnectLegacy";
import { InjectedConnector } from "wagmi/connectors/injected";
import { ConnectProvides } from "./providers";
import { ChainId } from "loopring-sdk";

const POLLING_INTERVAL = 12000;
const DEFAULT_HTTPS_BRIDGE = "https://bridge.walletconnect.org";
const DEFAULT_WEBSOCKET_BRIDGE = "wss://bridge.walletconnect.org";

// import { infuraProvider } from 'wagmi/providers/infura'
const getEnvVariable = (name: string): string => {
  return process.env[`${ConnectProvides.APP_FRAMEWORK}${name}`] ?? "";
};


export const RPC_URLS = {
  [ChainId.MAINNET]: getEnvVariable("RPC_URL_1"),
  [ChainId.GOERLI]: getEnvVariable("RPC_URL_5")
};
const withLoopringBridge = async ({
  isBridge = false,
  isLegacyBridge = false
}: {
  isBridge?: boolean;
  isLegacyBridge?: boolean;
}) => {
  if (isBridge) {
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
    return new WalletConnectLegacyConnector({
      chains: [mainnet, goerli],
      client: undefined,
      qrcode: true,
      options: {
        rpc: RPC_URLS,
        bridge: BRIDGE_URL,
        chainId: 1,

      }
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
      rpc: RPC_URLS,
      bridge: BRIDGE_URL,
      chainId: 1,
      clientMeta: {
        description: "Loopring Layer 2",
        url: "https://loopring.org",
        icons: ["https://static.loopring.io/assets/svg/loopring.svg"],
        name: "LRC"
      }
    });
  }
};

const withLoopringProvide = async (isInfra = false) => {
  if (isInfra) {
    //TODO infra
    // return infuraProvider({
    //   apiKey: "yourInfuraApiKey",
    //   priority: 1
    // });
  } else {
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
    return jsonRpcProvider({
      priority: 0,
      rpc: (chain: ChainId) => ({
        http: RPC_URLS[chain],
        webSocket: BRIDGE_URL
      })
    });
  }
  // new WalletConnectConnector(
  //   {
  //     logger: "info",
  //     relayUrl: BRIDGE_URL,
  //     projectId: "e9f9b27388f7d9bdb5f9a9ee81a5ab8d",
  //     chainId: 1,
  //     metadata: {
  //       name:  'Loopring Layer 2',
  //       description: "Loopring Dapp",
  //       url: "https://loopring.org",
  //       icons: ["https://static.loopring.io/assets/svg/loopring.svg"],
  //     },
  //     client: undefined,
  //   }
  // )
};
const configProvider = async () => {
  const { provider, chains } = configureChains(
    [mainnet],
    [await withLoopringProvide(false)]
  );
  const wagmiClient = createClient({
    autoConnect: true,
    connectors: [
      new InjectedConnector({ chains }),
      withLoopringBridge({ isBridge: true }),
      withLoopringBridge({ isLegacyBridge: true })
    ],
    provider
  });
  const web3 = new Web3(provider as any);
  return { web3, provider, wagmiClient };
};
