import { useState } from 'react';
import { useSails } from '../../providers/SailsProvider';
import { useWalletManagement } from '../../wallet/hooks/useWalletManagement';
import { GearKeyring } from '@gear-js/api';
import { useApi } from '@gear-js/react-hooks';

export const useContractMutation = (serviceName, methodName) => {
  const sails = useSails();
  const { wallet } = useWalletManagement();
  const { api } = useApi();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [transactionResult, setTransactionResult] = useState(null);
  const [gasUsed, setGasUsed] = useState(null);
  const [response,setResponse] = useState(null)

  const sendTransaction = async (...args) => {
    if (!sails || !wallet?.mnemonic || !api) {
      setError('Wallet o API no inicializadas');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);
    setTransactionResult(null);
    setGasUsed(null);

    try {
      const keyring = await GearKeyring.fromMnemonic(wallet.mnemonic);

   
      const transaction = sails.services[serviceName].functions[methodName](...args);


      transaction.withAccount(keyring);

   
      const gasResult = await transaction.calculateGas();
;
      const { msgId, blockHash, txHash, response } = await transaction.signAndSend();



      const result = await response();
      setResponse(result)
  
    

      setTransactionResult({
        messageId: msgId,
        blockHash,
        txHash,
        response: result
      });
      setGasUsed(gasUsed);
      setSuccess(true);
    } catch (error) {
      console.error('Error detallado:', error);
      setError(error.message || 'Error en la transacción');
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
    response
  };
};