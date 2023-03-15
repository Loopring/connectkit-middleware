import "./styles.css";
import { connectProvides } from './core/make/providers';

import React from 'react';
import { ContentPage } from './pages/ContentPage';
import { ConnectKitButton } from 'connectkit';


// export const ConnectKitLoopringButton = () => {
//   return (
//     <ConnectKitButton.Custom>
//       {(props) => {
//         const { isConnected, isConnecting, show, hide, address, ensName, chain } = props;
//          if(isConnecting){
//
//          }else if(isConnected){
//
//         }else{
//            return <button onClick={show} {...props}/>
//          }
//
//         // return (
//         //   // <button onClick={show} style={yourButtonStyle}>
//         //   //   {isConnected ? address : "Custom Connect"}
//         //   // </button>
//         // );
//       }}
//     </ConnectKitButton.Custom>
//   );
// };


export  function App(){
  React.useEffect(()=>{
    connectProvides.afterConnectedDo()
    return ()=>{
      connectProvides.afterDisConnectDo()
    }
  },[])
  return (
    <>
      <ConnectKitButton/>
      <ContentPage/>
    </>
  )
  //
  // )
}

