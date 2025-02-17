import React, { useState } from 'react';
import { useContractMutation } from '../../App/shared/hooks/useContractMutation';

function CreateAuthor() {
  const { loading, error, success, transactionResult, gasUsed, sendTransaction,response } = useContractMutation('Service', 'CreateAuthor');
  
  const [formData, setFormData] = useState({
    nombre: '',
    email: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await sendTransaction(formData.nombre, formData.email);
    setFormData({ nombre: '', email: '' });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6">Crear Nuevo Autor</h2>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          <p className="font-medium">Error:</p>
          <p>{error}</p>
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
          <p className="font-medium">Transaccion Realizada con exito</p>
          {transactionResult && (
            <div className="mt-2 text-sm">
              <p>Message ID: {transactionResult.messageId}</p>
              <p>Block Hash: {transactionResult.blockHash}</p>
              <p>Transaction Hash: {transactionResult.txHash}</p>
              {gasUsed && <p>Gas Utilizado: {gasUsed.toString()}</p>}
            </div>
          )}
        
        </div>
      )}
{response && response.error && (
  <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
    <p className="font-medium">Error:</p>
    <p>{response.error}</p>
  </div>
)}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">Nombre</label>
          <input
            id="nombre"
            name="nombre"
            type="text"
            value={formData.nombre}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
          />
        </div>

        <button
          type="submit"
          disabled={loading || !formData.nombre || !formData.email}
          className={`
            w-full py-2 px-4 rounded transition-colors
            ${loading 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700 text-white'
            }
          `}
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2" />
              Creando...
            </div>
          ) : (
            'Crear Autor'
          )}
        </button>
      </form>

      {loading && (
        <div className="mt-4 text-sm text-gray-600">
          <p>Estado de la transacción:</p>
          <ul className="list-disc pl-5 mt-2">
            <li>Calculando gas...</li>
            {transactionResult?.messageId && <li>Transacción enviada</li>}
            {transactionResult?.response && <li>Respuesta recibida</li>}
          </ul>
        </div>
      )}
    </div>
  );
}

export default CreateAuthor;