

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { countries, Country } from '../data/countries.ts';
import { ChevronDownIcon } from './icons/ChevronDownIcon.tsx';

interface CountryCodePickerProps {
  value: string;
  onChange: (value: string) => void;
}

export const CountryCodePicker: React.FC<CountryCodePickerProps> = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const wrapperRef = useRef<HTMLDivElement>(null);

  const selectedCountry = useMemo(() =>
    countries.find(c => c.code === value) || countries.find(c => c.iso === 'CL'),
    [value]
  );

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef]);

  const filteredCountries = useMemo(() =>
    countries
      .filter(country =>
        country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        country.code.includes(searchTerm) ||
        country.iso.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => a.name.localeCompare(b.name)),
    [searchTerm]
  );

  const handleSelect = (country: Country) => {
    onChange(country.code);
    setIsOpen(false);
    setSearchTerm('');
  };

  if (!selectedCountry) {
    return null;
  }

  return (
    <div className="relative" ref={wrapperRef}>
      <button
        type="button"
        className="h-full flex items-center justify-center gap-2 px-3 bg-white border border-r-0 border-gray-300 rounded-l-md shadow-sm text-sm focus:outline-none focus:ring-1 focus:ring-[#F54927] focus:border-[#F54927] whitespace-nowrap"
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={`Selected country code: ${selectedCountry.name} ${selectedCountry.code}`}
      >
        <span className="font-semibold text-gray-700" aria-hidden="true">{selectedCountry.iso}</span>
        <span className="text-gray-500" aria-hidden="true">{selectedCountry.code}</span>
        <ChevronDownIcon />
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-2 w-80 bg-white shadow-lg rounded-md border border-gray-200 max-h-60 flex flex-col top-full">
          <div className="p-2 border-b border-gray-200">
            <input
              type="text"
              placeholder="Buscar país por nombre o código..."
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring-1 focus:ring-[#F54927] focus:border-[#F54927]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoFocus
            />
          </div>
          <ul role="listbox" className="overflow-y-auto">
            {filteredCountries.map(country => (
              <li
                key={country.iso}
                className="flex items-center gap-4 px-4 py-2 text-sm text-gray-800 hover:bg-[#FEECE8] cursor-pointer"
                onClick={() => handleSelect(country)}
                role="option"
                aria-selected={country.code === value}
              >
                <span className="font-mono text-gray-600 w-8 text-left">{country.iso}</span>
                <span className="flex-1 font-medium">{country.name}</span>
                <span className="text-gray-500">{country.code}</span>
              </li>
            ))}
            {filteredCountries.length === 0 && (
              <li className="px-4 py-2 text-sm text-gray-500 text-center">No se encontraron países.</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};