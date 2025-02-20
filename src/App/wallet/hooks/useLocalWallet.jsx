import { useState, useCallback } from 'react';
import { Keyring } from '@polkadot/keyring';
import { useApi, useBalance } from '@gear-js/react-hooks';
import { mnemonicGenerate, mnemonicValidate } from '@polkadot/util-crypto';

export function useLocalWallet() {
  const { api, isApiReady } = useApi();
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [transactions, setTransactions] = useState([]);

  const { balance, isBalanceReady } = useBalance(wallet?.address);


  const loadStoredWallet = useCallback(() => {
    try {
      const savedWallet = localStorage.getItem('vara_wallet');
      if (savedWallet) {
        setWallet({ 
          ...JSON.parse(savedWallet), 
          isConnected: true,
          type: 'local' 
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error loading stored wallet:', error);
      setError('Error al cargar la wallet guardada');
      return false;
    }
  }, []);


  useState(() => {
    loadStoredWallet();
  }, [loadStoredWallet]);


  const generateNewSeed = () => {
    try {
      return mnemonicGenerate();
    } catch (error) {
      console.error('Error generating seed:', error);
      setError('Error generando nueva semilla');
      return null;
    }
  };


  const validateSeed = (seed) => {
    try {
      return mnemonicValidate(seed);
    } catch (error) {
      return false;
    }
  };


  const generateWalletFromSeed = async (seedPhrase) => {
    setLoading(true);
    setError(null);

    try {
      if (!validateSeed(seedPhrase)) {
        throw new Error('Semilla inválida');
      }

      const keyring = new Keyring({ type: 'sr25519', ss58Format: 42 });
      const newAccount = keyring.addFromUri(seedPhrase);
      
      const newWallet = {
        mnemonic: seedPhrase,
        address: newAccount.address,
        publicKey: newAccount.publicKey.toString('hex'),
        isConnected: true,
        type: 'local'
      };
      
      setWallet(newWallet);
      localStorage.setItem('vara_wallet', JSON.stringify(newWallet));

      return newWallet;
    } catch (error) {
      console.error('Error generating wallet:', error);
      setError('Error al generar wallet: ' + error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };


  const sendTransaction = async (destinationAddress, amount) => {
    if (!wallet || !isApiReady) {
      throw new Error('Wallet no inicializada o API no lista');
    }

    try {
      setLoading(true);
      

      const keyring = new Keyring({ type: 'sr25519', ss58Format: 42 });
      const account = keyring.addFromUri(wallet.mnemonic);
      
      const transfer = api.balance.transfer(destinationAddress, amount);
      const hash = await transfer.signAndSend(account);
      
      const newTransaction = {
        hash,
        type: 'send',
        amount,
        to: destinationAddress,
        timestamp: Date.now()
      };
      
      setTransactions(prev => [newTransaction, ...prev]);
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
    localStorage.removeItem('vara_wallet');
    setWallet(null);
    setError(null);
  };


  const isValidAddress = useCallback((address) => {
    try {
      const keyring = new Keyring({ type: 'sr25519', ss58Format: 42 });
      return !!keyring.encodeAddress(address);
    } catch {
      return false;
    }
  }, []);

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
    generateWalletFromSeed,
    generateNewSeed,
    sendTransaction,
    disconnect,
    validateSeed,
    formatBalance,
    isValidAddress,
    getTransactionHistory,
    hasWallet: !!wallet
  };
}


