import React from 'react';
import { useLoopringAccount } from '../core/useLoopringAccount';
import { AccountStatus } from '../contant';
import { useSystem } from '../core/useSystem';

export const ContentPage = ()=>{
  const {onUnlockAccount,
    onLockAccount,...account}= useLoopringAccount();
  // const account =  l2Account.l2Account;
  const {isConnected,readyState} = account;
  const system = useSystem();
  const chainName = system.system?.chain?.name;
  console.log(chainName,account,account,readyState)
  return <div>
    <div>
       Welcome to Loopring
    </div>
    {chainName}
    {isConnected && system?.system?.exchangeInfo && <div>
      {readyState === AccountStatus.LOCKED && <button onClick={onUnlockAccount}>Unlock</button>}
      {readyState === AccountStatus.ACTIVATED && <button onClick={onLockAccount}>Unlock</button>}
      {readyState === AccountStatus.NO_ACCOUNT && <p>Please active account</p>}
      {readyState === AccountStatus.UN_CONNECT && <p>Please connect</p>}
      {readyState === AccountStatus.CHECKING && <p>CHECKING</p>}

    </div>}
  </div>
}