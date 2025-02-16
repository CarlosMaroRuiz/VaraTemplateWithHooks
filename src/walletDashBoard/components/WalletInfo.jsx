function WalletInfo({ wallet, balance, formatBalance, disconnect }) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold mb-4">Información de la Wallet</h2>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-600">Tipo de Wallet:</p>
            <p className="font-medium">
              {wallet.type === 'extension' ? 'Extensión Polkadot' : 'Local'}
            </p>
          </div>
          
          <div>
            <p className="text-sm text-gray-600">Dirección:</p>
            <p className="font-mono text-sm break-all bg-gray-50 p-2 rounded">
              {wallet.address}
            </p>
          </div>
  
          <div>
            <p className="text-sm text-gray-600">Balance:</p>
            <p className="text-2xl font-bold text-blue-600">
              {formatBalance(balance)} VARA
            </p>
          </div>
  
          {wallet.type === 'local' && (
            <button
              onClick={disconnect}
              className="w-full py-2 px-4 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Desconectar Wallet
            </button>
          )}
        </div>
      </div>
    )
  }

export default WalletInfo;  