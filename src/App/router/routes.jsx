import { Route, Routes as RouterRoutes } from 'react-router-dom'
import { WalletDashboard } from '../../walletDashBoard'

export default function Routes() {
  return (
    <RouterRoutes>
      <Route path="/" element={<WalletDashboard/>} />
    </RouterRoutes>
  )
}