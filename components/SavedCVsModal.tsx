

import React from 'react';
import type { CVData } from '../types.ts';
import { CloseIcon } from './icons/CloseIcon.tsx';
import { TrashIcon } from './icons/TrashIcon.tsx';
import { PencilIcon } from './icons/PencilIcon.tsx';
import { PlusIcon } from './icons/PlusIcon.tsx';

interface SavedCVsModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedCVs: CVData[];
  onLoad: (id: string) => void;
  onDelete: (id: string) => void;
  onNew: () => void;
}

export const SavedCVsModal: React.FC<SavedCVsModalProps> = ({ isOpen, onClose, savedCVs, onLoad, onDelete, onNew }) => {
  if (!isOpen) return null;

  const sortedCVs = [...savedCVs].sort((a, b) => (b.lastModified || 0) - (a.lastModified || 0));

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4" onClick={onClose}>
      <div className="bg-[#e3e4e5] rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        <header className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold text-gray-800">CVs Guardados</h2>
          <button onClick={onClose} className="p-2 rounded-full text-gray-500 hover:bg-gray-100">
            <CloseIcon />
          </button>
        </header>

        <main className="p-4 overflow-y-auto flex-grow">
          {sortedCVs.length > 0 ? (
            <ul className="space-y-3">
              {sortedCVs.map((cv) => (
                <li key={cv.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border">
                  <div>
                    <p className="font-semibold text-gray-800">{cv.personal.name || 'CV Sin Nombre'}</p>
                    <p className="text-xs text-gray-500">
                      Última modificación: {cv.lastModified ? new Date(cv.lastModified).toLocaleString() : 'Desconocida'}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => onLoad(cv.id!)} className="flex items-center gap-1.5 text-sm bg-blue-500 text-white font-semibold py-1.5 px-3 rounded-md hover:bg-blue-600 transition-colors">
                      <PencilIcon />
                      Editar
                    </button>
                    <button onClick={() => onDelete(cv.id!)} className="flex items-center gap-1.5 text-sm bg-red-500 text-white font-semibold py-1.5 px-3 rounded-md hover:bg-red-600 transition-colors">
                      <TrashIcon />
                      Eliminar
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-10">
              <p className="text-gray-500">No tienes ningún CV guardado todavía.</p>
              <p className="text-sm text-gray-400 mt-1">¡Presiona "Guardar" en el formulario para empezar!</p>
            </div>
          )}
        </main>

        <footer className="p-4 border-t bg-gray-50 flex justify-end">
          <button onClick={onNew} className="flex items-center gap-2 bg-green-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-600 transition-colors">
            <PlusIcon />
            Crear Nuevo CV
          </button>
        </footer>
      </div>
    </div>
  );
};