import {
    ApiProvider as GearApiProvider,
    AccountProvider as GearAccountProvider,
  } from '@gear-js/react-hooks'
  import { BrowserRouter } from 'react-router-dom'
import { NODE_ADDRESS } from '../shared/constants'
  function ApiProvider({ children }) {
    return (
      <GearApiProvider initialArgs={{ endpoint: NODE_ADDRESS }}>
        {children}
      </GearApiProvider>
    )
  }
  
  const providers = [
    BrowserRouter,
    ApiProvider,
    GearAccountProvider
  ]
  
  export function withProviders(Component) {
    return () => providers.reduceRight(
      (children, Provider) => <Provider>{children}</Provider>,
      <Component />
    )
  }