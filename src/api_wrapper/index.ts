import {
  AmmpoolAPI,
  ChainId,
  DelegateAPI,
  ExchangeAPI,
  GlobalAPI,
  NFTAPI,
  UserAPI,
  WalletAPI,
  WsAPI,
  ContactAPI,
} from "@loopring-web/loopring-sdk";

export class LoopringAPI {
  public static userAPI: UserAPI ;
  public static exchangeAPI: ExchangeAPI;
  public static ammpoolAPI: AmmpoolAPI ;
  public static walletAPI: WalletAPI ;
  public static wsAPI: WsAPI ;
  public static nftAPI: NFTAPI ;
  public static delegate: DelegateAPI ;
  public static globalAPI: GlobalAPI ;
  public static contactAPI: ContactAPI ;
  public static __chainId__: ChainId ;
  public static InitApi = (chainId: ChainId) => {
    LoopringAPI.userAPI = new UserAPI({ chainId }, 6000);
    LoopringAPI.exchangeAPI = new ExchangeAPI({ chainId }, 6000);
    LoopringAPI.globalAPI = new GlobalAPI({ chainId }, 25000);
    LoopringAPI.walletAPI = new WalletAPI({ chainId }, 6000);
    LoopringAPI.wsAPI = new WsAPI({ chainId }, 6000);
    //follow is options added or not
    LoopringAPI.ammpoolAPI = new AmmpoolAPI({ chainId }, 6000);
    LoopringAPI.nftAPI = new NFTAPI({ chainId }, 6000);
    LoopringAPI.delegate = new DelegateAPI({ chainId }, 6000);
    LoopringAPI.contactAPI = new ContactAPI({ chainId }, 6000);
    LoopringAPI.__chainId__ = chainId;
  };
}
