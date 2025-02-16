import Routes from './router/routes'
import { withProviders } from './providers/AppProviders'
import { useApi } from '@gear-js/react-hooks/dist'
function Component() {
  const {isApiReady} = useApi()

  if (!isApiReady) return <div>Loading...</div>
  return (
    <main className="w-full">
      <Routes/>
    </main>
  )
}

export const App = withProviders(Component)