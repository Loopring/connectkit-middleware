import { ChainId, useConnectHook } from "./useConnectHook";

export function useConnect({ setIsConnect }: any) {
  useConnectHook({
    handleAccountDisconnect: () => {
      console.log("handleAccountDisconnect:");

      // await sleep(REFRESH_RATE)
    },
    handleProcessing: ({ opts }: { type: any; opts: any }) => {
      console.log(opts);
    },
    handleError: (props: { type: any; opts?: any }) => {
      console.log("---> handleError:", props);
    },
    handleConnect: async ({
      accounts,
      chainId
    }: {
      accounts: string;
      provider: any;
      chainId: ChainId | "unknown";
    }) => {
      const accAddress = accounts[0];
      setIsConnect({ account: accAddress });
      // console.log(
      //   "After connect >>,network part start: step1 networkUpdate",
      //   accAddress
      // );
      // console.log("After connect >>,network part done: step2 check account");
    }
  });
}
