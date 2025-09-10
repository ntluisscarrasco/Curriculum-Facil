

import React from 'react';
import { UploadIcon } from './icons/UploadIcon.tsx';
import { DownloadIcon } from './icons/DownloadIcon.tsx';
import { DocumentTextIcon } from './icons/DocumentTextIcon.tsx';
import { KeyIcon } from './icons/KeyIcon.tsx';

interface ActionBarProps {
  isLoading: boolean;
  handlers: {
    toggleImportModal: () => void;
    handleGenerateCoverLetter: () => void;
    handleDownloadPdf: () => void;
    handleChangeApiKey: () => void;
  };
}

export const ActionBar: React.FC<ActionBarProps> = ({ isLoading, handlers }) => {
  return (
    <div className="bg-[#e3e4e5] p-4 rounded-lg shadow-md mt-6">
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 flex-wrap">
        <button onClick={handlers.toggleImportModal} disabled={isLoading} className="flex items-center gap-2 bg-green-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-600 transition-colors shadow-sm w-full sm:w-auto justify-center disabled:bg-green-300 disabled:cursor-not-allowed">
          <UploadIcon />
          <span>Importar con IA</span>
        </button>
        <button onClick={handlers.handleGenerateCoverLetter} disabled={isLoading} className="flex items-center gap-2 bg-purple-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors shadow-sm w-full sm:w-auto justify-center disabled:bg-purple-300 disabled:cursor-not-allowed">
          <DocumentTextIcon />
          <span>Carta de Presentación</span>
        </button>
        <button onClick={handlers.handleDownloadPdf} disabled={isLoading} className="flex items-center gap-2 bg-[#F54927] text-white font-bold py-2 px-4 rounded-lg hover:bg-[#D43C1E] transition-colors shadow-md focus:outline-none focus:ring-2 focus:ring-[#F54927] focus:ring-opacity-75 w-full sm:w-auto justify-center disabled:bg-[#FAD9D1] disabled:cursor-not-allowed">
          <DownloadIcon />
          <span>Descargar PDF</span>
        </button>
      </div>
       <div className="mt-4 pt-4 border-t border-gray-300 flex justify-center">
          <button onClick={handlers.handleChangeApiKey} className="flex items-center gap-2 text-sm text-gray-600 font-semibold hover:text-gray-900 transition-colors">
            <KeyIcon />
            <span>Gestionar API Key</span>
          </button>
        </div>
    </div>
  );
};