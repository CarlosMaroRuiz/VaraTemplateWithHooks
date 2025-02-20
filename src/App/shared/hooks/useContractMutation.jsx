import { useState } from 'react';
import { useSails } from '../../providers/SailsProvider';
import { useLocalWallet } from '../../wallet/hooks/useLocalWallet';
import { useExtensionWallet } from '../../wallet/hooks/useWalletExtension';
import { GearKeyring } from '@gear-js/api';
import { useApi } from '@gear-js/react-hooks';
import { web3FromAddress } from '@polkadot/extension-dapp';

export const useContractMutation = (serviceName, methodName) => {
  const sails = useSails();
  const localWallet = useLocalWallet();
  const extensionWallet = useExtensionWallet();
  const { api } = useApi();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [transactionResult, setTransactionResult] = useState(null);
  const [gasUsed, setGasUsed] = useState(null);
  const [response, setResponse] = useState(null);

  const getActiveWallet = () => {
    if (extensionWallet.hasWallet) {
      return {
        wallet: extensionWallet.wallet,
        type: 'extension'
      };
    } else if (localWallet.hasWallet) {
      return {
        wallet: localWallet.wallet,
        type: 'local'
      };
    }
    return { wallet: null, type: null };
  };

  const sendTransaction = async (...args) => {
    const { wallet, type } = getActiveWallet();
    
    if (!sails || !wallet || !api) {
      setError('Wallet o API no inicializadas');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);
    setTransactionResult(null);
    setGasUsed(null);
    setResponse(null);

    try {
      const transaction = sails.services[serviceName].functions[methodName](...args);


      if (type === 'local') {
       
        if (!wallet.mnemonic) {
          throw new Error('La wallet local no tiene mnemónica configurada');
        }
        const keyring = await GearKeyring.fromMnemonic(wallet.mnemonic);
        transaction.withAccount(keyring);
      } else if (type === 'extension') {
        
        const injector = await web3FromAddress(wallet.address);
        transaction.withAccount(wallet.address, { signer: injector.signer });
      }


      const gasResult = await transaction.calculateGas();
      
      // Enviar transacción
      const { msgId, blockHash, txHash, response: txResponse } = await transaction.signAndSend();

      // Esperar respuesta
      const result = await txResponse();
      setResponse(result);

    
      setTransactionResult({
        messageId: msgId,
        blockHash,
        txHash,
        response: result
      });
      
      setGasUsed(gasResult?.min_limit?.toString() || null);
      setSuccess(true);
      
      return result;
    } catch (err) {
      console.error('Error en la transacción:', err);
      setError(err.message || 'Error en la transacción');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    success,
    transactionResult,
    gasUsed,
    sendTransaction,
    response,
    activeWalletType: getActiveWallet().type
  };
};