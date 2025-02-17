
import { useWalletManagement } from '../App/wallet/hooks/useWalletManagement'
import WalletInfo from './components/WalletInfo'
import TransactionForm from './components/TransactionForm'
import WalletGenerator from './components/WalletGenerator'
import TransactionHistory from './components/TransactionHistory'

export function WalletDashboard() {
  const walletManager = useWalletManagement()
  const { 
    wallet, 
    isApiReady, 
    loading, 
    error 
  } = walletManager

  if (!isApiReady) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="p-4 text-center">
          <div className="animate-spin h-8 w-8 mb-4 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"/>
          <p className="text-gray-600">Conectando a la red Vara...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header con estado general */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Vara Wallet Dashboard</h1>
        {error && (
          <div className="p-4 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}
        {loading && (
          <div className="p-4 bg-blue-100 text-blue-700 rounded">
            Procesando operación...
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Sección de Wallet */}
        <div className="space-y-8">
          {wallet ? (
            <WalletInfo {...walletManager} />
          ) : (
            <WalletGenerator {...walletManager} />
          )}
        </div>

        {/* Sección de Transacciones */}
        {wallet && (
          <div className="space-y-8">
            <TransactionForm {...walletManager} />
            <TransactionHistory {...walletManager} />
          </div>
        )}
      </div>
    </div>
  )
}