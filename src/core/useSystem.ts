import React from 'react';
import { system } from './make/makeSystem';
import { ConnectProvides } from './make/providers';
  

export const useSystem = ()=>{
  const [_system,setSystem] = React.useState<any>(system?.system??{})
  const subject = React.useMemo(() => ConnectProvides.subscribe(), []);
  React.useEffect(()=>{
    const subscription = subject.subscribe(({data:{system:system}}) => {
      console.log('useSystem',system)
      if(system!==undefined){
        setSystem(system)
      }
    });
    return () => {
      subscription.unsubscribe();
    };
  },[])
  return _system;
}

