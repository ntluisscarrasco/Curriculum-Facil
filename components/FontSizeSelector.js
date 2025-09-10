import React from 'react';

interface FontSizeSelectorProps {
  fontSizes: {
    name: number;
    personal: number;
  };
  onChange: (field: 'name' | 'personal', size: number) => void;
}

const FONT_SIZES_NAME = Array.from({ length: 11 }, (_, i) => 22 + i); // 22 a 32
const FONT_SIZES_PERSONAL = Array.from({ length: 7 }, (_, i) => 9 + i); // 9 a 15

export const FontSizeSelector: React.FC<FontSizeSelectorProps> = ({ fontSizes, onChange }) => {
  return (
    <div className="bg-[#e3e4e5] p-5 rounded-lg shadow-md mb-8">
      <h3 className="text-lg font-bold text-gray-800 mb-4 text-center">Tamaño de Fuente</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col">
          <label htmlFor="nameFontSize" className="mb-1 text-sm font-medium text-gray-600">Nombre</label>
          <select
            id="nameFontSize"
            value={fontSizes.name}
            onChange={(e) => onChange('name', parseInt(e.target.value, 10))}
            className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring-1 focus:ring-[#F54927] focus:border-[#F54927]"
            aria-label="Seleccionar tamaño de fuente para el nombre"
          >
            {FONT_SIZES_NAME.map(size => (
              <option key={size} value={size}>{size}pt</option>
            ))}
          </select>
        </div>
        <div className="flex flex-col">
          <label htmlFor="personalFontSize" className="mb-1 text-sm font-medium text-gray-600">Datos Personales</label>
          <select
            id="personalFontSize"
            value={fontSizes.personal}
            onChange={(e) => onChange('personal', parseInt(e.target.value, 10))}
            className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring-1 focus:ring-[#F54927] focus:border-[#F54927]"
            aria-label="Seleccionar tamaño de fuente para los datos personales"
          >
            {FONT_SIZES_PERSONAL.map(size => (
              <option key={size} value={size}>{size}pt</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};
