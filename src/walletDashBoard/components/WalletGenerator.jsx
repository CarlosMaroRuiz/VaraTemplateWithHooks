import { useState } from 'react'
function WalletGenerator({ generateWalletFromSeed, generateNewSeed, validateSeed }) {
    const [seedPhrase, setSeedPhrase] = useState('')
    const [validationError, setValidationError] = useState('')
  
    const handleGenerateNew = () => {
      const newSeed = generateNewSeed()
      if (newSeed) setSeedPhrase(newSeed)
    }
  
    const handleGenerate = async () => {
        console.log(seedPhrase)
      if (!validateSeed(seedPhrase)) {
        setValidationError('Semilla inválida')
        return
      }
      try {
        await generateWalletFromSeed(seedPhrase)
      } catch (error) {
        setValidationError(error.message)
      }
    }
  
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold mb-4">Generar Nueva Wallet</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Frase Semilla
            </label>
            <textarea
              value={seedPhrase}
              onChange={(e) => setSeedPhrase(e.target.value)}
              className="mt-1 w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="Ingresa tu frase semilla o genera una nueva"
            />
            {validationError && (
              <p className="mt-1 text-sm text-red-600">{validationError}</p>
            )}
          </div>
  
          <div className="flex gap-4">
            <button
              onClick={handleGenerateNew}
              className="flex-1 py-2 px-4 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
            >
              Generar Nueva Semilla
            </button>
            <button
              onClick={handleGenerate}
              className="flex-1 py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Crear Wallet
            </button>
          </div>
        </div>
      </div>
    )
  }
export default WalletGenerator