function TransactionHistory({ getTransactionHistory, formatBalance }) {
    const transactions = getTransactionHistory()
  
    if (transactions.length === 0) {
      return null
    }
  
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold mb-4">Historial de Transacciones</h2>
        <div className="space-y-4">
          {transactions.map((tx, index) => (
            <div 
              key={tx.hash + index} 
              className="p-4 bg-gray-50 rounded border border-gray-200"
            >
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">
                  {new Date(tx.timestamp).toLocaleString()}
                </span>
                <span className="text-sm font-medium text-blue-600">
                  {formatBalance(tx.amount)} VARA
                </span>
              </div>
              <p className="text-sm break-all text-gray-500">
                Hash: {tx.hash}
              </p>
              <p className="text-sm break-all text-gray-500">
                Destino: {tx.to}
              </p>
            </div>
          ))}
        </div>
      </div>
    )
  }

  export default TransactionHistory