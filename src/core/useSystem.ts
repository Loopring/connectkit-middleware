import React from 'react';
import {  watchNetwork } from '@wagmi/core';
import { system } from './make/makeSystem';
import { ConnectProvides } from './make/providers';
  

export const useSystem = ()=>{
  const [_system,setSystem] = React.useState(system)
  const subject = React.useMemo(() => ConnectProvides.subscribe(), []);
  React.useEffect(()=>{
    const subscription = subject.subscribe((props) => {
      console.log('useSystem',props)
      setSystem(system)
    });
    return () => {
      subscription.unsubscribe();
    };
  },[])
  return _system;
}

