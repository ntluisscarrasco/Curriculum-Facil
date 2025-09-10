

import React, { useState } from 'react';
import { CloseIcon } from './icons/CloseIcon.js';
import { SparklesIcon } from './icons/SparklesIcon.js';

export interface CoverLetterPromptData {
  jobTitle: string;
  isGeneralApplication: boolean;
  companyName: string;
  isCompanyUnknown: boolean;
  recipientName: string;
  isRecipientUnknown: boolean;
}

interface CoverLetterPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CoverLetterPromptData) => void;
  isLoading: boolean;
}

export const CoverLetterPromptModal: React.FC<CoverLetterPromptModalProps> = ({ isOpen, onClose, onSubmit, isLoading }) => {
  const [formData, setFormData] = useState<CoverLetterPromptData>({
    jobTitle: '',
    isGeneralApplication: false,
    companyName: '',
    isCompanyUnknown: false,
    recipientName: '',
    isRecipientUnknown: true,
  });

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      jobTitle: formData.jobTitle.toUpperCase(),
      companyName: formData.companyName.toUpperCase(),
      recipientName: formData.recipientName.toUpperCase(),
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="cover-letter-prompt-title">
      <div className="bg-[#e3e4e5] rounded-lg shadow-xl w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
        <form onSubmit={handleSubmit}>
          <header className="flex justify-between items-center p-4 border-b">
            <h2 id="cover-letter-prompt-title" className="text-xl font-bold text-gray-800">Personalizar Carta de Presentación</h2>
            <button type="button" onClick={onClose} className="p-2 rounded-full text-gray-500 hover:bg-gray-100" aria-label="Cerrar modal">
              <CloseIcon />
            </button>
          </header>

          <main className="p-6 space-y-4">
            <div>
              <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-700">Cargo al que postula</label>
              <input
                type="text"
                id="jobTitle"
                name="jobTitle"
                value={formData.jobTitle}
                onChange={handleChange}
                disabled={formData.isGeneralApplication}
                className="mt-1 w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring-1 focus:ring-[#F54927] focus:border-[#F54927] disabled:bg-gray-100"
              />
              <div className="mt-2">
                <label className="flex items-center">
                  <input type="checkbox" name="isGeneralApplication" checked={formData.isGeneralApplication} onChange={handleChange} className="h-4 w-4 text-[#D43C1E] border-gray-300 rounded focus:ring-[#F54927]" />
                  <span className="ml-2 text-sm text-gray-600">Es una postulación general (sin cargo específico)</span>
                </label>
              </div>
            </div>

            <div>
              <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">Nombre de la empresa</label>
              <input
                type="text"
                id="companyName"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                disabled={formData.isCompanyUnknown}
                className="mt-1 w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring-1 focus:ring-[#F54927] focus:border-[#F54927] disabled:bg-gray-100"
              />
              <div className="mt-2">
                <label className="flex items-center">
                  <input type="checkbox" name="isCompanyUnknown" checked={formData.isCompanyUnknown} onChange={handleChange} className="h-4 w-4 text-[#D43C1E] border-gray-300 rounded focus:ring-[#F54927]" />
                  <span className="ml-2 text-sm text-gray-600">No conozco el nombre de la empresa</span>
                </label>
              </div>
            </div>
            
            <div>
              <label htmlFor="recipientName" className="block text-sm font-medium text-gray-700">Nombre del reclutador (o a quién va dirigida)</label>
              <input
                type="text"
                id="recipientName"
                name="recipientName"
                value={formData.recipientName}
                onChange={handleChange}
                disabled={formData.isRecipientUnknown}
                className="mt-1 w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring-1 focus:ring-[#F54927] focus:border-[#F54927] disabled:bg-gray-100"
              />
              <div className="mt-2">
                <label className="flex items-center">
                  <input type="checkbox" name="isRecipientUnknown" checked={formData.isRecipientUnknown} onChange={handleChange} className="h-4 w-4 text-[#D43C1E] border-gray-300 rounded focus:ring-[#F54927]" />
                  <span className="ml-2 text-sm text-gray-600">No conozco el nombre (usar saludo general)</span>
                </label>
              </div>
            </div>
          </main>

          <footer className="p-4 border-t bg-gray-50 flex justify-end items-center gap-4">
            <button type="button" onClick={onClose} className="text-sm font-semibold text-gray-600 hover:text-gray-900 px-4 py-2 rounded-md">
              Cancelar
            </button>
            <button 
              type="submit"
              disabled={isLoading}
              className="flex items-center gap-2 bg-purple-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors shadow-sm disabled:bg-purple-300 disabled:cursor-not-allowed"
            >
              <SparklesIcon />
              {isLoading ? 'Generando...' : 'Generar Carta con IA'}
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
};