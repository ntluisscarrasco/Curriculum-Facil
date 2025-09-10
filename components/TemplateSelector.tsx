import React from 'react';

type Template = 'classic' | 'modern' | 'creative';

interface TemplateSelectorProps {
  selected: Template;
  onSelect: (template: Template) => void;
}

const TemplateThumbnail: React.FC<{ name: string; isSelected: boolean; onClick: () => void; children: React.ReactNode }> = ({ name, isSelected, onClick, children }) => (
  <div className="text-center">
    <button
      onClick={onClick}
      className={`w-40 h-44 border-4 rounded-lg transition-all duration-200 overflow-hidden ${isSelected ? 'border-[#F54927] shadow-lg' : 'border-gray-300 hover:border-[#F76F51]'}`}
      aria-label={`Seleccionar plantilla ${name}`}
    >
      {children}
    </button>
    <p className={`mt-2 font-semibold text-sm ${isSelected ? 'text-[#D43C1E]' : 'text-gray-600'}`}>{name}</p>
  </div>
);

export const TemplateSelector: React.FC<TemplateSelectorProps> = ({ selected, onSelect }) => {
  return (
    <div className="bg-[#e3e4e5] p-5 rounded-lg shadow-md mb-8">
      <h3 className="text-lg font-bold text-gray-800 mb-4 text-center">Elige una Plantilla</h3>
      <div className="flex justify-center items-center gap-x-4 gap-y-6 flex-wrap">
        <TemplateThumbnail name="Modelo Harvard (ATS)" isSelected={selected === 'classic'} onClick={() => onSelect('classic')}>
           <div className="w-full h-full bg-white p-3 pt-4 flex flex-col items-center shadow-inner">
            {/* Name */}
            <div className="w-3/4 h-3 bg-slate-600 rounded-sm"></div>
            {/* Contact */}
            <div className="w-full h-1.5 bg-slate-400 rounded-sm mt-2"></div>
            <div className="w-11/12 h-1.5 bg-slate-400 rounded-sm mt-1"></div>
            {/* Divider */}
            <div className="w-full h-0.5 bg-slate-600 my-3"></div>
            {/* Section 1 */}
            <div className="w-1/3 h-2 bg-slate-500 self-center mb-2"></div>
            <div className="w-full h-1 bg-slate-400 rounded-sm"></div>
            <div className="w-full h-1 bg-slate-400 rounded-sm mt-1"></div>
            {/* Section 2 */}
            <div className="w-1/3 h-2 bg-slate-500 self-center mt-3 mb-2"></div>
            <div className="w-full h-1 bg-slate-400 rounded-sm"></div>
            <div className="w-full h-1 bg-slate-400 rounded-sm mt-1"></div>
            <div className="w-5/6 h-1 bg-slate-400 rounded-sm mt-1"></div>
          </div>
        </TemplateThumbnail>
        
        <TemplateThumbnail name="Moderna (imprimir)" isSelected={selected === 'modern'} onClick={() => onSelect('modern')}>
          <div className="w-full h-full bg-white flex shadow-inner">
            {/* Sidebar */}
            <div className="w-1/3 h-full bg-slate-800 p-2 space-y-4">
                <div className="w-full h-2 bg-orange-400 rounded-sm"></div>
                <div className="w-full h-1.5 bg-slate-500 rounded-sm"></div>
                <div className="w-full h-1.5 bg-slate-500 rounded-sm"></div>
                <div className="w-full h-2 bg-orange-400 rounded-sm mt-4"></div>
                <div className="w-full h-1.5 bg-slate-500 rounded-sm"></div>
            </div>
            {/* Main Content */}
            <div className="w-2/3 h-full p-3 space-y-3">
                <div className="w-full h-5 bg-slate-700 rounded-sm"></div>
                <div className="w-full h-1.5 bg-slate-400 rounded-sm"></div>
                <div className="w-full h-1.5 bg-slate-400 rounded-sm"></div>
                <div className="w-full h-2 bg-slate-600 rounded-sm mt-4"></div>
                <div className="w-full h-1.5 bg-slate-400 rounded-sm"></div>
                <div className="w-5/6 h-1.5 bg-slate-400 rounded-sm"></div>
            </div>
          </div>
        </TemplateThumbnail>
        
        <TemplateThumbnail name="Creativa (Imprimir)" isSelected={selected === 'creative'} onClick={() => onSelect('creative')}>
          <div className="w-full h-full bg-white p-3 flex flex-col justify-between shadow-inner">
            {/* Header */}
            <div>
                <div className="w-4/5 h-6 bg-slate-700 rounded-sm ml-auto"></div>
                <div className="w-full h-0.5 bg-pink-300 mt-2"></div>
                <div className="w-1/2 h-0.5 bg-pink-300 ml-auto mt-1"></div>
            </div>
            {/* Content */}
            <div className="flex-grow mt-3">
                <div className="w-full h-6 bg-pink-100 rounded-sm mb-3"></div>
                <div className="flex gap-2">
                    {/* Left Col */}
                    <div className="w-7/12 space-y-2">
                        <div className="w-1/2 h-2 bg-pink-200 rounded-sm"></div>
                        <div className="w-full h-1.5 bg-slate-400 rounded-sm"></div>
                         <div className="w-1/2 h-2 bg-pink-200 rounded-sm mt-2"></div>
                         <div className="w-full h-1.5 bg-slate-400 rounded-sm"></div>
                    </div>
                    {/* Right Col */}
                    <div className="w-5/12 space-y-2">
                         <div className="w-3/4 h-2 bg-pink-200 rounded-sm"></div>
                         <div className="w-full h-1.5 bg-slate-400 rounded-sm"></div>
                         <div className="w-3/4 h-2 bg-pink-200 rounded-sm mt-2"></div>
                    </div>
                </div>
            </div>
            {/* Footer */}
            <div>
                <div className="w-1/2 h-0.5 bg-pink-300 mt-2"></div>
                <div className="w-full h-0.5 bg-pink-300 mt-1"></div>
            </div>
          </div>
        </TemplateThumbnail>
      </div>
    </div>
  );
};