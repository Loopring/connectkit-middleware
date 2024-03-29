import Web3 from "web3";
import { Commands, ProcessingType } from "../contant/command";

const { Subject } = require('rxjs');

//TODO typeof account State
const subject = new Subject();

const AvaiableNetwork = [1, 5];
export const walletServices = {
  subject,
    sendProcess: async (type: keyof typeof ProcessingType, props?: any) => {
    subject.next({
      status: Commands.Processing,
      data: { type: type, opts: props },
    });
  },
  sendError: async (errorType: any, errorObj: any) => {
    subject.next({
      status: Commands.Error,
      data: { type: errorType, opts: errorObj },
    });
  },
  sendConnect: async (web3: Web3, provider: any) => {
    try {
      let accounts, chainId: number;
      //@ts-ignore
      accounts = provider.accounts ?? (await web3.eth.getAccounts());
      chainId =
        typeof provider.chainId === "function"
          ? await provider.chainId()
          : provider.chainId ?? (await web3.eth.getChainId());
      subject.next({
        status: "ConnectWallet",
        data: {
          provider,
          accounts,
          chainId:
            AvaiableNetwork.findIndex((i) => i == Number(chainId)) !== -1
              ? Number(chainId)
              : "unknown",
        },
      });
    } catch (error) {
      subject.next({ status: "Error", data: { error } });
    }
  },
  sendDisconnect: async (code: any, reason: any) => {
    subject.next({
      status: "DisConnect",
      data: { reason: reason, code: code },
    });
  },

  // clearMessages: () => subject.next(),
  onSocket: () => subject.asObservable(),
};
