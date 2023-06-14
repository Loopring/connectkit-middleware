import "./styles.css";
import { useConnect } from "./useConnect";
import { walletServices, connectProvides } from "@loopring-web/web3-provider";
import React from "react";
export default function App() {
  const [isConnect, setIsConnect] = React.useState<any>(undefined);
  useConnect({ setIsConnect });
  const metaMask = async () => {
    // walletServices.sendDisconnect("", "should new provider");
    await connectProvides.MetaMask({ darkMode: true, chainId: "5" });
  };
  const walletConnect = async () => {
    // walletServices.sendDisconnect("", "should new provider");
    await connectProvides.WalletConnect({ darkMode: true, chainId: "5" });
  };
  const coinbase = async () => {
    walletServices.sendDisconnect("", "should new provider");
    await connectProvides.Coinbase({ darkMode: true, chainId: "5" });
  };
  const disconnect = () => {
    setIsConnect(undefined);
    walletServices.sendDisconnect("", "disconnect");
  };
  const sendSignaure = () => {
    const web3 = connectProvides.usedWeb3;
    if (web3 && isConnect?.account) {
      web3.eth.personal.sign("message", isConnect.account, "", function (
        err: any,
        result: any
      ) {
        console.log("err", err, "result", result);
      });
    }
  };
  return (
    <div className="App">
      <h1>Hello React</h1>
      {isConnect ? (
        <>
          <button onClick={sendSignaure}> Signaure</button>
          <button onClick={disconnect}> disconnect</button>
        </>
      ) : (
        <div style={{ display: "flex", flexDirection: "column" }}>
          <button onClick={metaMask}>
            <img
              src="https://static.loopring.io/assets/svg/meta-mask.svg"
              alt="MetaMask"
              height="36"
            />
          </button>
          <button onClick={walletConnect}>
            <img
              src="https://static.loopring.io/assets/svg/wallet-connect.svg"
              alt="walletConnect"
              height="36"
            />
          </button>
          <button onClick={coinbase}>
            <img
              src="https://static.loopring.io/assets/svg/coinbase-wallet.svg"
              alt="MetaMask"
              height="36"
            />
          </button>
        </div>
      )}
    </div>
  );
}
