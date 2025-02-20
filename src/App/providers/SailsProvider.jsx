import React, { createContext, useContext, useEffect, useState } from 'react';
import { Sails } from 'sails-js';
import { SailsIdlParser } from 'sails-js-parser';
import { PROGRAM_ID } from '../shared/constants/idl';

const SailsContext = createContext();

export function useSails() {
  return useContext(SailsContext);
}

export function SailsProvider({ children, api }) {
  const [sails, setSails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initSails = async () => {
      try {
        setLoading(true);
    
        const parser = await SailsIdlParser.new();
        

        const sailsInstance = new Sails(parser);

        if (!api) {
          throw new Error('API no inicializada');
        }
        

        sailsInstance.setApi(api);

        const response = await fetch('/src/App/app.idl');
        if (!response.ok) {
          throw new Error('No se pudo cargar el archivo IDL');
        }
        const idlContent = await response.text();
       

  
        sailsInstance.parseIdl(idlContent);
        sailsInstance.setProgramId(PROGRAM_ID);


        setSails(sailsInstance);
      } catch (error) {
    
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    initSails();
  }, [api]);

  if (loading) {//Se puede personalizar
    return (
      <div className="flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent mb-2"/>
          <p className="text-gray-600">Inicializando Sails...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (//Se puede persoanlizar
      <div className="p-4 bg-red-100 text-red-700 rounded">
        <p className="font-bold">Error al inicializar Sails:</p>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <SailsContext.Provider value={sails}>
      {children}
    </SailsContext.Provider>
  );
}