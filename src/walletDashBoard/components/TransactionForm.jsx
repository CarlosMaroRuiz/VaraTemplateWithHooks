import { useState } from 'react'
function TransactionForm({ sendTransaction, isValidAddress }) {
    const [destination, setDestination] = useState('')
    const [amount, setAmount] = useState('')
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
  
    const handleSend = async () => {
      setError('')
      setSuccess('')
  
      if (!isValidAddress(destination)) {
        setError('Dirección de destino inválida')
        return
      }
  
      if (!amount || isNaN(amount) || Number(amount) <= 0) {
        setError('Monto inválido')
        return
      }
  
      try {
        const hash = await sendTransaction(
          destination, 
          BigInt(Number(amount) * 1e12)
        )
        setSuccess(`Transacción enviada! Hash: ${hash}`)
        setDestination('')
        setAmount('')
      } catch (err) {
        setError(err.message)
      }
    }
  
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold mb-4">Enviar VARA</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Dirección de Destino
            </label>
            <input
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="mt-1 w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
              placeholder="Dirección del destinatario"
            />
          </div>
  
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Cantidad (VARA)
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="mt-1 w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
              placeholder="0.0"
              step="0.000000000001"
            />
          </div>
  
          {error && (
            <div className="p-3 bg-red-100 text-red-700 rounded">
              {error}
            </div>
          )}
  
          {success && (
            <div className="p-3 bg-green-100 text-green-700 rounded">
              {success}
            </div>
          )}
  
          <button
            onClick={handleSend}
            className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Enviar
          </button>
        </div>
      </div>
    )
  }

export default TransactionForm