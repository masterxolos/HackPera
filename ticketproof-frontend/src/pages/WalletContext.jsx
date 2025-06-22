// src/pages/WalletContext.jsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Account, TransactionBuilder, Networks, Operation, Asset, BASE_FEE } from '@stellar/stellar-sdk';
import { requestAccess, isConnected, signTransaction } from '@stellar/freighter-api';

const WalletContext = createContext();

export const WalletProvider = ({ children }) => {
  const [walletAddress, setWalletAddress] = useState(null);

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

  const buyTickets = async ({ eventId, quantity, totalPrice }) => {
    try {
      if (!walletAddress) throw new Error("Wallet not connected");

      const accountRes = await fetch(`https://horizon-testnet.stellar.org/accounts/${walletAddress}`);
      const accountData = await accountRes.json();

      const sourceAccount = new Account(walletAddress, accountData.sequence);

      const transaction = new TransactionBuilder(sourceAccount, {
        fee: BASE_FEE,
        networkPassphrase: Networks.TESTNET,
      })
        .addOperation(Operation.payment({
          destination: walletAddress, // TODO: Replace with event organizer wallet
          asset: Asset.native(),
          amount: String(Number(totalPrice).toFixed(7)),
        }))
        .setTimeout(30)
        .build();

      const xdr = transaction.toXDR();

      const signedResponse = await signTransaction(xdr, {
        network: 'TESTNET', // ✅ Correct way to tell Freighter which network
      });

      const signedTxXDR = typeof signedResponse === 'string'
        ? signedResponse
        : signedResponse.signedXDR || signedResponse.signedTxXDR || signedResponse.signedTx;

      if (typeof signedTxXDR !== 'string') {
        throw new Error('Failed to extract signed transaction XDR string.');
      }

      const res = await fetch("https://holy-billowing-wildflower.stellar-testnet.quiknode.pro/cfcb6f898214f6a8d2bb4b3de3c97b3ddb70f692/", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: 8675309,
          method: "sendTransaction",
          params: { transaction: signedTxXDR },
        }),
      });

      const result = await res.json();
      if (result.error) throw new Error(result.error.message || 'Transaction failed');

      return result.result;
    } catch (err) {
      console.error('Transaction failed:', err);
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
    <WalletContext.Provider value={{ walletAddress, connectWallet, disconnectWallet, buyTickets }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => useContext(WalletContext);
