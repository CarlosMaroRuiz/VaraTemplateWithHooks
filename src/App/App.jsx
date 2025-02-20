import Routes from './router/routes'
import { withProviders } from './providers/AppProviders'
import { SailsProvider } from './providers/SailsProvider'
import { useApi } from '@gear-js/react-hooks'


function Component() {
  
  const { api, isApiReady } = useApi()
  if (!isApiReady) {
    return <div>Loading...</div>
  }
  return (
    <main className="w-full">
      <SailsProvider api={api}>
     
       <Routes/> 
      </SailsProvider>
      
    </main>
  )
}

export const App = withProviders(Component)