import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-[#e3e4e5] border-t border-gray-200 mt-8 py-6">
      <div className="container mx-auto text-center text-sm text-gray-700 space-y-2">
        <p>
          Creado por <span className="font-bold text-[#F54927]">Luis Carrasco Álvarez</span> en Los Ángeles, Chile
        </p>
        <p>
          Contacto: <a href="mailto:luis.seb.carrasco@gmail.com" className="font-semibold text-[#171D8C] hover:underline">luis.seb.carrasco@gmail.com</a>
        </p>
        <p>© 2025 - Generador de CV Profesional</p>
      </div>
    </footer>
  );
};
