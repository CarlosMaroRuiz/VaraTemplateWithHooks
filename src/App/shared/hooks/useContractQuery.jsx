import { useState, useEffect } from 'react';
import { useSails } from '../../providers/SailsProvider';
import { useWalletManagement } from '../../wallet/hooks/useWalletManagement';

export const useContractQuery = (serviceName, methodName, ...args) => {
  const sails = useSails();
  const { wallet } = useWalletManagement();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!sails || !wallet?.address) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const result = await sails.services[serviceName].queries[methodName](
          wallet.address,
          0,
          null,
          ...args
        );

        setData(result);
      } catch (error) {
        console.error(`Error en la consulta ${serviceName}/${methodName}:`, error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [sails, wallet, serviceName, methodName, ...args]);

  return { data, loading, error };
};