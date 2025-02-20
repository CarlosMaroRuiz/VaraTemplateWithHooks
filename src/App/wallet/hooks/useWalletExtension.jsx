import { useState, useCallback } from 'react';
import { useApi, useBalance } from '@gear-js/react-hooks';
import { web3Accounts, web3Enable, web3FromAddress } from '@polkadot/extension-dapp';

export function useExtensionWallet() {
  const { api, isApiReady } = useApi();
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [transactions, setTransactions] = useState([]);

  const { balance, isBalanceReady } = useBalance(wallet?.address);

  const connectWallet = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      await web3Enable('My Vara App');
      const accounts = await web3Accounts();

      if (accounts.length === 0) {
        throw new Error('No se encontraron cuentas en la extensión');
      }

      const newWallet = {
        address: accounts[0].address,
        isConnected: true,
        type: 'extension',
      };

      setWallet(newWallet);
      return newWallet;
    } catch (error) {
      console.error('Error connecting wallet:', error);
      setError('Error al conectar wallet: ' + error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const sendTransaction = async (destinationAddress, amount) => {
    if (!wallet || !isApiReady) {
      throw new Error('Wallet no conectada o API no lista');
    }

    try {
      setLoading(true);

      const injector = await web3FromAddress(wallet.address);

      const transfer = api.balance.transfer(destinationAddress, amount);
      const hash = await transfer.signAndSend(wallet.address, { signer: injector.signer });

      const newTransaction = {
        hash,
        type: 'send',
        amount,
        to: destinationAddress,
        timestamp: Date.now(),
      };

      setTransactions((prev) => [newTransaction, ...prev]);
      return hash;
    } catch (error) {
      setError('Error enviando transacción: ' + error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const formatBalance = (rawBalance) => {
    if (!rawBalance) return '0';
    try {
      return (BigInt(rawBalance) / BigInt(1e12)).toString();
    } catch (error) {
      console.error('Error formatting balance:', error);
      return '0';
    }
  };

  const disconnect = () => {
    setWallet(null);
    setError(null);
  };

  const isValidAddress = useCallback((address) => {
    try {
      return api.createType('AccountId', address).toString() === address;
    } catch {
      return false;
    }
  }, [api]);

  const getTransactionHistory = useCallback(() => {
    return transactions;
  }, [transactions]);

  return {
    wallet,
    loading,
    error,
    balance: isBalanceReady ? balance : null,
    transactions,
    isApiReady,
    connectWallet,
    sendTransaction,
    disconnect,
    formatBalance,
    isValidAddress,
    getTransactionHistory,
    hasWallet: !!wallet,
  };
}