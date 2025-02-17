import {
    ApiProvider as GearApiProvider,
    AccountProvider as GearAccountProvider,useApi
  } from '@gear-js/react-hooks'
  import { BrowserRouter } from 'react-router-dom'
import { NODE_ADDRESS } from '../shared/constants';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '../shared/constants/queryClient';
  function ApiProvider({ children }) {
   
   
    return (
      <QueryClientProvider client={queryClient}>
 <GearApiProvider initialArgs={{ endpoint: NODE_ADDRESS }}>
        {children}
      </GearApiProvider>
      </QueryClientProvider>
     
    )
  }
  
  const providers = [
    BrowserRouter,
    ApiProvider,
    GearAccountProvider,
    
  ]
  
  export function withProviders(Component) {
    return () => {
      

      return providers.reduceRight(
        (children, Provider) => {
         
          return <Provider>{children}</Provider>;
        },
        <Component />
      );
    };
  }