// src/pages/WalletContext.jsx 
import React, { createContext, useContext, useEffect, useState } from 'react';

import { 
  Networks, 
  TransactionBuilder, 
  nativeToScVal, 
  Address, 
  Contract,
  BASE_FEE,
  Account
} from '@stellar/stellar-sdk';

import { Server } from '@stellar/stellar-sdk/rpc';

import {
  requestAccess,
  isConnected,
  signTransaction,
  getNetworkDetails
} from '@stellar/freighter-api';

const WalletContext = createContext();

export const WalletProvider = ({ children }) => {
  const [walletAddress, setWalletAddress] = useState(null);

  const contractId = 'CCNYUUB7MHXYFWCYRUA6IGE2IVUBQUT4JNBPCILH5XDW2CVMWD5CRF6E';

  const connectWallet = async () => {
    try {
      const { address, error } = await requestAccess();
      if (error) throw new Error(error.message || 'Unknown Freighter error');
      setWalletAddress(address);
    } catch (e) {
      console.error('Wallet connection failed:', e);
    }
  };

  const disconnectWallet = () => {
    setWalletAddress(null);
  };

const buyTickets = async ({ eventId, totalPrice }) => {
  if (!walletAddress) {
    console.error('Wallet not connected');
    return;
  }

  try {
    console.log('=== BUY TICKETS DEBUG ===');
    console.log('Event ID:', eventId);
    console.log('Total Price (stroops):', totalPrice);
    console.log('Wallet Address:', walletAddress);

    const rpcUrl = 'https://holy-billowing-wildflower.stellar-testnet.quiknode.pro/cfcb6f898214f6a8d2bb4b3de3c97b3ddb70f692/';

    // Get account from Horizon
    const accountRes = await fetch(`https://horizon-testnet.stellar.org/accounts/${walletAddress}`);
    const accountData = await accountRes.json();
    const sourceAccount = new Account(walletAddress, accountData.sequence);

    const contract = new Contract(contractId);

    const operation = contract.call(
      'buy_ticket',
      nativeToScVal(eventId, { type: 'u32' }),
      new Address(walletAddress).toScVal(),
      nativeToScVal(totalPrice, { type: 'i128' })
    );

    // ❌ DO NOT manually set operation.auth

    const tx = new TransactionBuilder(sourceAccount, {
      fee: BASE_FEE,
      networkPassphrase: Networks.TESTNET,
    })
      .addOperation(operation)
      .setTimeout(30)
      .build();

    console.log('Transaction XDR built successfully');

    const signedResponse = await signTransaction(tx.toXDR(), {
      networkPassphrase: Networks.TESTNET,
      accountToSign: walletAddress,
    });

    const signedTxXDR = signedResponse?.signedTxXdr || signedResponse?.xdr;
    if (!signedTxXDR) throw new Error('Signed XDR missing from Freighter response');

    const rpcRes = await fetch(rpcUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'sendTransaction',
        params: { transaction: signedTxXDR },
      }),
    });

    const result = await rpcRes.json();
    console.log('Soroban RPC Response:', result);

    if (result.error) throw new Error(result.error.message);
    if (!result.result?.hash) throw new Error('Transaction submitted but no hash returned');

    console.log('✅ Transaction hash:', result.result.hash);
    return result.result.hash;

  } catch (err) {
    console.error('Buy ticket failed:', err);
    throw err;
  }
};


  useEffect(() => {
    const checkConnection = async () => {
      try {
        const { isConnected: connected } = await isConnected();
        if (connected) {
          const { address } = await requestAccess();
          setWalletAddress(address);
        }
      } catch (e) {
        console.warn('Freighter not connected or not available');
      }
    };
    checkConnection();
  }, []);

  return (
    <WalletContext.Provider
      value={{ walletAddress, connectWallet, disconnectWallet, buyTickets }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => useContext(WalletContext);