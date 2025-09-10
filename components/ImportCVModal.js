

import React, { useState } from 'react';
import { CloseIcon } from './icons/CloseIcon.js';
import { SparklesIcon } from './icons/SparklesIcon.js';

interface ImportCVModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExtract: (cvText: string) => Promise<void>;
  isLoading: boolean;
}

export const ImportCVModal: React.FC<ImportCVModalProps> = ({ isOpen, onClose, onExtract, isLoading }) => {
  const [cvText, setCvText] = useState('');

  if (!isOpen) return null;

  const handleExtractClick = () => {
    if (cvText.trim()) {
      onExtract(cvText);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="import-modal-title">
      <div className="bg-[#e3e4e5] rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        <header className="flex justify-between items-center p-4 border-b">
          <h2 id="import-modal-title" className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <SparklesIcon />
            Importar desde CV con IA
          </h2>
          <button onClick={onClose} className="p-2 rounded-full text-gray-500 hover:bg-gray-100" aria-label="Cerrar modal">
            <CloseIcon />
          </button>
        </header>

        <main className="p-4 overflow-y-auto flex-grow flex flex-col">
          <label htmlFor="cv-text-input" className="mb-2 text-sm font-medium text-gray-600">
            Pega aquí el contenido de tu CV anterior. La IA analizará el texto y rellenará el formulario por ti.
          </label>
          <textarea
            id="cv-text-input"
            value={cvText}
            onChange={(e) => setCvText(e.target.value)}
            placeholder="Ej: Luis Carrasco, Ingeniero de Software..."
            className="w-full flex-grow p-3 bg-white border border-gray-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring-1 focus:ring-[#F54927] focus:border-[#F54927]"
            rows={15}
            disabled={isLoading}
            aria-label="Área de texto para pegar el currículum"
          />
        </main>

        <footer className="p-4 border-t bg-gray-50 flex justify-end items-center gap-4">
          <button onClick={onClose} className="text-sm font-semibold text-gray-600 hover:text-gray-900 px-4 py-2 rounded-md">
            Cancelar
          </button>
          <button 
            onClick={handleExtractClick} 
            disabled={isLoading || !cvText.trim()}
            className="flex items-center gap-2 bg-green-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-600 transition-colors shadow-sm disabled:bg-green-300 disabled:cursor-not-allowed"
          >
            <SparklesIcon />
            {isLoading ? 'Analizando...' : 'Analizar y Rellenar'}
          </button>
        </footer>
      </div>
    </div>
  );
};
