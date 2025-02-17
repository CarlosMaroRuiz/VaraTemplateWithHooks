import React from 'react';
import { useContractQuery } from '../../App/shared/hooks/useContractQuery';
import { decodeAddress, encodeAddress } from '@gear-js/api';

function ListaAutores() {
  const { data: autores, loading, error } = useContractQuery('Service', 'GetAllAutors');


  const formatAddress = (address) => {
    try {
      const decoded = decodeAddress(address);
      const formatted = encodeAddress(decoded);
      return `${formatted.slice(0, 6)}...${formatted.slice(-4)}`;
    } catch (error) {
      console.log('Error formateando dirección:', error);
      return address.toString();
    }
  };

  if (loading) {
    return (
      <div className="p-4 flex justify-center items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"/>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-100 text-red-700 rounded">
        <p>Error al cargar los autores: {error}</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Lista de Autores</h2>
      {loading ? (
        <div className="p-4 flex justify-center items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"/>
        </div>
      ) : error ? (
        <div className="p-4 bg-red-100 text-red-700 rounded">
          <p>Error al cargar los autores: {error}</p>
        </div>
      ) : autores && autores.length === 0 ? (
        <p className="text-gray-500">No se encontraron autores registrados.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {autores && autores.map(([actor_id, autor]) => (
            <div
              key={actor_id}
              className="p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
            >
              <h3 className="font-bold text-lg mb-2">
                {autor.nombre}
              </h3>
              <p className="text-gray-600 mb-1">
                {autor.email}
              </p>
              <div className="mt-2 pt-2 border-t border-gray-200">
                <p className="text-sm text-gray-500 break-all">
                  ID: {formatAddress(actor_id)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ListaAutores;