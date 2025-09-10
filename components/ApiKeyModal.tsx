
import React, { useState, useEffect } from 'react';
import { CloseIcon } from './icons/CloseIcon.tsx';
import { KeyIcon } from './icons/KeyIcon.tsx';

interface ApiKeyModalProps {
  isOpen: boolean;
  onSave: (apiKey: string) => void;
  onClose: () => void;
  currentApiKey: string | null;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ isOpen, onSave, onClose, currentApiKey }) => {
  const [apiKey, setApiKey] = useState('');
  const isKeySet = !!currentApiKey;

  useEffect(() => {
    if (currentApiKey) {
      setApiKey(currentApiKey);
    }
  }, [currentApiKey, isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (apiKey.trim()) {
      onSave(apiKey.trim());
    }
  };
  
  const handleModalClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isKeySet) {
        onClose();
    }
    // If no key is set, prevent closing by clicking the backdrop
  };
  
  const handleDialogClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };

  return (
    <div 
        className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4 backdrop-blur-sm"
        onClick={handleModalClick}
    >
      <div className="bg-[#e3e4e5] rounded-lg shadow-xl w-full max-w-lg" onClick={handleDialogClick}>
        <header className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <KeyIcon />
            Configurar API Key de Google Gemini
          </h2>
          {isKeySet && (
            <button onClick={onClose} className="p-2 rounded-full text-gray-500 hover:bg-gray-200">
              <CloseIcon />
            </button>
          )}
        </header>

        <main className="p-6 space-y-4">
          <div>
            <p className="text-sm text-gray-600 mb-2">
              Para usar las funciones de IA, necesitas una API Key de Google Gemini.
              Puedes obtener una gratis en <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-blue-600 font-semibold hover:underline">Google AI Studio</a>.
            </p>
            <label htmlFor="api-key-input" className="block text-sm font-medium text-gray-700">
              Tu API Key
            </label>
            <input
              id="api-key-input"
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Pega tu clave aquí"
              className="mt-1 w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring-1 focus:ring-[#F54927] focus:border-[#F54927]"
            />
          </div>
          {!isKeySet && (
            <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-3 rounded-r-lg">
                <p className="text-sm font-bold">¡Importante!</p>
                <p className="text-xs">
                Tu clave se guardará únicamente en tu navegador. Nunca se comparte con nadie más.
                </p>
            </div>
          )}
        </main>

        <footer className="p-4 border-t bg-gray-50 flex justify-end items-center gap-4">
          {isKeySet && (
             <button onClick={onClose} className="text-sm font-semibold text-gray-600 hover:text-gray-900 px-4 py-2 rounded-md">
                Cancelar
            </button>
          )}
          <button 
            onClick={handleSave}
            disabled={!apiKey.trim()}
            className="bg-[#F54927] text-white font-bold py-2 px-4 rounded-lg hover:bg-[#D43C1E] transition-colors shadow-sm disabled:bg-orange-300 disabled:cursor-not-allowed"
          >
            Guardar Clave
          </button>
        </footer>
      </div>
    </div>
  );
};
