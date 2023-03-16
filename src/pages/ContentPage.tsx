import React from 'react';
import { useLoopringAccount } from '../core/useLoopringAccount';
import { AccountStatus } from '../contant';
import { useSystem } from '../core/useSystem';

export const ContentPage = ()=>{
  const {onUnlockAccount,
    onLockAccount,readyState,isConnected,...account}= useLoopringAccount();
  // const account =  l2Account.l2Account;
  const {chain} = useSystem();
  console.log(isConnected,chain,account,readyState)
  return <div>
    <div>
       Welcome to Loopring
    </div>
    {chain?.name}
    {isConnected  && <div>
      {readyState === AccountStatus.LOCKED && <button onClick={onUnlockAccount}>Unlock</button>}
      {readyState === AccountStatus.ACTIVATED && <>L2 successfully unlocked <button onClick={onLockAccount}>lock</button></> }
      {readyState === AccountStatus.NO_ACCOUNT && <p>Please activate account</p>}
      {readyState === AccountStatus.UN_CONNECT && <p>Please connect</p>}
      {readyState === AccountStatus.CHECKING && <p>CHECKING</p>}
    </div>}
  </div>
}
