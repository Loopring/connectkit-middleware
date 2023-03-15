import { WagmiConfig } from 'wagmi';
import { App } from './App';
import { ConnectKitProvider } from 'connectkit';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { connectProvides, ConnectProvides } from './core/make/providers';

// @ts-ignore
const root = createRoot(document.getElementById('root'));


connectProvides.getConnectClient().then(({wagmiClient})=>{
  root.render(<WagmiConfig client={wagmiClient} >
    <ConnectKitProvider theme="auto">
      <App/>
    </ConnectKitProvider>
  </WagmiConfig>);

})

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals

