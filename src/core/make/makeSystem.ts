import * as sdk from '@loopring-web/loopring-sdk'
import * as _wagmi_core from '@wagmi/core';
import { LoopringAPI } from '../../api_wrapper';


class System {
  private _system: ({ exchangeInfo?: sdk.ExchangeInfo } & _wagmi_core.GetNetworkResult) | undefined;
  public get system() {
    return this._system;
  }

  constructor() {
    // this.makeSystem({})
  }

  // @ts-ignore
  public async makeSystem({network}: _wagmi_core.GetNetworkResult | {}) {
    if ((!this._system?.exchangeInfo || network?.chain?.id != this._system?.exchangeInfo?.chainId) && LoopringAPI) {
      const {exchangeInfo} = await LoopringAPI.exchangeAPI.getExchangeInfo();
      this._system = {
        ...network,
        exchangeInfo,
        chainId: network.chain?.id as sdk.ChainId
      }
    }

  }
}
// let system:System;
// if(!window.system){
//   system = new System()
//   window.system =system;
// }else{
//   system = window.system
// }
const system = new System()
export { system };


// export const useSystem = ()=>{
//   // const network = useNetwork();
//   // const [system,setSystem] = React.useState<_wagmi_core.GetNetworkResult & {
//   //   chainId: sdk.ChainId,
//   // } & { exchangeInfo?: sdk.ExchangeInfo } >({
//   //   ...network,
//   //   chainId:sdk.ChainId.MAINNET
//   // });
//   // React.useEffect(()=>{
//   //   if((!system.exchangeInfo || network.chain?.id != system.chainId) && LoopringAPI){
//   //     LoopringAPI.exchangeAPI
//   //       .getExchangeInfo()
//   //       .then(({ exchangeInfo }) => {
//   //         setSystem({
//   //           ...network,
//   //           exchangeInfo,
//   //           chainId:network.chain?.id as sdk.ChainId,
//   //         })
//   //       });
//   //   }
//   //
//   // },[network.chain?.id])
//
//   return {  system, setSystem};
// }
