import { useState, useEffect } from 'react';
import { useSails } from '../../providers/SailsProvider';
import { useLocalWallet } from '../../wallet/hooks/useLocalWallet';
import {useExtensionWallet} from '../../wallet/hooks/useWalletExtension';

export const useContractQuery = (serviceName, methodName, ...args) => {
  const sails = useSails();
  const localWallet = useLocalWallet();
  const extensionWallet = useExtensionWallet();
  
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchData = async () => {
      // Determine which wallet to use (extension has priority if connected)
      const activeWallet = extensionWallet.hasWallet 
        ? extensionWallet.wallet 
        : localWallet.hasWallet 
          ? localWallet.wallet 
          : null;
      
      if (!sails || !activeWallet?.address) {
        setLoading(false);
        return;
      }
      
      setLoading(true);
      setError(null);
      
      try {
        const result = await sails.services[serviceName].queries[methodName](
          activeWallet.address,
          0,
          null,
          ...args
        );
        
        setData(result);
      } catch (err) {
        console.error(`Error en la consulta ${serviceName}/${methodName}:`, err);
        setError(err.message || 'Error al realizar la consulta');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [
    sails, 
    localWallet.wallet, 
    extensionWallet.wallet,
    serviceName, 
    methodName,
    ...args
  ]);
  
  return { 
    data, 
    loading, 
    error,
    // Include information about which wallet is being used
    activeWalletType: extensionWallet.hasWallet 
      ? 'extension' 
      : localWallet.hasWallet 
        ? 'local' 
        : null
  };
};