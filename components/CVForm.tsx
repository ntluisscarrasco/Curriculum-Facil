
import React from 'react';
import type { CVData, EducationEntry, ExperienceEntry, ComplementaryTrainingEntry, SkillEntry } from '../types.ts';
import { PlusIcon } from './icons/PlusIcon.tsx';
import { TrashIcon } from './icons/TrashIcon.tsx';
import { PencilIcon } from './icons/PencilIcon.tsx';
import { CountryCodePicker } from './CountryCodePicker.tsx';
import { LICENSE_CLASSES } from '../constants.ts';

interface CVFormProps {
  data: CVData;
  handlers: {
    handlePersonalChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    handleCountryCodeChange: (code: string) => void;
    handleSummaryChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    handleHasDrivingLicenseChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleDrivingLicenseChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    updateListItem: <K extends "experience" | "education" | "complementaryTraining" | "skills">(listName: K, index: number, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
    addListItem: <K extends "experience" | "education" | "complementaryTraining" | "skills">(listName: K, newItem: EducationEntry | ExperienceEntry | ComplementaryTrainingEntry | SkillEntry) => void;
    removeListItem: <K extends "experience" | "education" | "complementaryTraining" | "skills">(listName: K, index: number) => void;
    handleGenerateSummary: () => Promise<void>;
    handleImproveDescription: (listName: 'experience' | 'complementaryTraining', index: number) => Promise<void>;
  };
  isLoading: boolean;
  summaryError: string | null;
}

const InputField: React.FC<{ label?: string; name: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; placeholder?: string; type?: string; disabled?: boolean; }> = ({ label, name, value, onChange, placeholder, type = 'text', disabled = false }) => (
  <div className="flex flex-col">
    {label && <label htmlFor={name} className="mb-1 text-sm font-medium text-gray-600">{label}</label>}
    <input type={type} id={name} name={name} value={value} onChange={onChange} placeholder={placeholder} disabled={disabled} className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring-1 focus:ring-[#F54927] focus:border-[#F54927] disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed" />
  </div>
);

const months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

const MonthSelect: React.FC<{ name: string; value: string; onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void; disabled?: boolean; }> = ({ name, value, onChange, disabled = false }) => (
  <select id={name} name={name} value={value} onChange={onChange} disabled={disabled} className="w-full h-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring-1 focus:ring-[#F54927] focus:border-[#F54927] disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed">
    <option value="">Mes</option>
    {months.map(month => <option key={month} value={month}>{month}</option>)}
  </select>
);

const SKILL_LEVELS: Array<'Básico' | 'Intermedio' | 'Avanzado'> = ['Básico', 'Intermedio', 'Avanzado'];

const SkillLevelSelect: React.FC<{ name: string; value: SkillEntry['level']; onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void; disabled?: boolean; }> = ({ name, value, onChange, disabled = false }) => (
    <select id={name} name={name} value={value} onChange={onChange} disabled={disabled} className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring-1 focus:ring-[#F54927] focus:border-[#F54927] disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed">
      {SKILL_LEVELS.map(level => <option key={level} value={level}>{level}</option>)}
    </select>
);

const CheckboxField: React.FC<{ label: string; name: string; checked: boolean; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; }> = ({ label, name, checked, onChange }) => (
    <label htmlFor={`lic_${name}`} className="flex items-center space-x-2 cursor-pointer select-none">
        <input type="checkbox" id={`lic_${name}`} name={name} checked={checked} onChange={onChange} className="h-4 w-4 text-[#D43C1E] border-gray-300 rounded focus:ring-[#F54927]" />
        <span className="text-sm font-medium text-gray-700">{label}</span>
    </label>
);

const Section: React.FC<{ title: string; children: React.ReactNode; }> = ({ title, children }) => (
  <div className="bg-[#e3e4e5] p-5 rounded-lg shadow-md">
    <h3 className="text-lg font-bold text-gray-800 mb-4">{title}</h3>
    <div className="space-y-4">{children}</div>
  </div>
);

const AddButton: React.FC<{ onClick: () => void; children: React.ReactNode }> = ({ onClick, children }) => (
  <div className="flex justify-end">
    <button onClick={onClick} className="mt-2 flex items-center justify-center gap-1 bg-[#F54927] text-white font-semibold py-1 px-3 rounded-md hover:bg-[#D43C1E] transition-colors text-xs shadow-sm">
      <PlusIcon />
      {children}
    </button>
  </div>
);

export const CVForm: React.FC<CVFormProps> = ({ data, handlers, isLoading, summaryError }) => {
  return (
    <div className="space-y-6">
      <Section title="Datos Personales">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField label="Nombre Completo" name="name" value={data.personal.name} onChange={handlers.handlePersonalChange} />
          <InputField label="Email" name="email" value={data.personal.email} onChange={handlers.handlePersonalChange} type="email" />
          
           <div>
            <label htmlFor="phoneNumber" className="block mb-1 text-sm font-medium text-gray-600">Teléfono</label>
            <div className="flex items-stretch h-[42px]">
              <CountryCodePicker
                  value={data.personal.phoneCountryCode}
                  onChange={handlers.handleCountryCodeChange}
              />
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={data.personal.phoneNumber}
                onChange={handlers.handlePersonalChange}
                placeholder="9 8765 4321"
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-r-md shadow-sm text-sm focus:outline-none focus:ring-1 focus:ring-[#F54927] focus:border-[#F54927] z-0"
              />
            </div>
          </div>
          
          <InputField label="Ciudad y País" name="cityAndCountry" value={data.personal.cityAndCountry} onChange={handlers.handlePersonalChange} />
          <InputField label="LinkedIn" name="linkedin" value={data.personal.linkedin} onChange={handlers.handlePersonalChange} />
          <InputField label="Página Web" name="website" value={data.personal.website} onChange={handlers.handlePersonalChange} />
        </div>
      </Section>

      <Section title="Perfil Profesional">
        <div>
          <label htmlFor="summary" className="block mb-1 text-sm font-medium text-gray-600">Describe tu perfil profesional</label>
          <textarea id="summary" name="summary" value={data.summary} onChange={handlers.handleSummaryChange} rows={5} placeholder="Profesional con X años de experiencia en..." className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring-1 focus:ring-[#F54927] focus:border-[#F54927]" />
        </div>
         <div className="flex justify-end">
          <button onClick={handlers.handleGenerateSummary} disabled={isLoading} className="flex items-center justify-center gap-2 bg-[#F54927] text-white font-semibold py-2 px-4 rounded-md hover:bg-[#D43C1E] transition-colors text-sm shadow-sm disabled:opacity-50 disabled:cursor-not-allowed">
            <PencilIcon />
            <span>{data.summary.trim() ? 'Mejorar con IA' : 'Generar con IA'}</span>
          </button>
        </div>
        {summaryError && <p className="text-red-500 text-xs mt-1">{summaryError}</p>}
      </Section>

      <Section title="Educación">
        {data.education.map((edu, index) => (
          <div key={edu.id} className="p-4 border bg-slate-50/80 border-slate-200 rounded-lg space-y-3">
             <div className="flex justify-between items-center border-b border-slate-200 pb-2 mb-3">
              <h4 className="font-semibold text-gray-700">Educación {index + 1}</h4>
              <button onClick={() => handlers.removeListItem('education', index)} title="Eliminar" className="text-gray-500 hover:text-red-600 transition-colors p-1 rounded-full hover:bg-red-50">
                <TrashIcon className="h-5 w-5" />
              </button>
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <InputField label="Institución" name="institution" value={edu.institution} onChange={(e) => handlers.updateListItem('education', index, e)} />
                <InputField label="Título" name="degree" value={edu.degree} onChange={(e) => handlers.updateListItem('education', index, e)} />
                <InputField label="Ciudad" name="city" value={edu.city} onChange={(e) => handlers.updateListItem('education', index, e)} placeholder="Ej: Los Ángeles" />
                <InputField label="País" name="country" value={edu.country} onChange={(e) => handlers.updateListItem('education', index, e)} placeholder="Ej: Chile"/>
                <InputField label="Año Inicio" name="startDate" value={edu.startDate} onChange={(e) => handlers.updateListItem('education', index, e)} placeholder="Año" />
                <InputField label="Año Fin" name="endDate" value={edu.endDate} onChange={(e) => handlers.updateListItem('education', index, e)} placeholder="Año" disabled={edu.isCurrent} />
             </div>
             <div className="flex items-center gap-x-6 pt-1">
                <label className="flex items-center">
                    <input type="checkbox" id={`edu_current_${edu.id}`} name="isCurrent" checked={edu.isCurrent} onChange={(e) => handlers.updateListItem('education', index, e)} className="h-4 w-4 text-[#D43C1E] border-gray-300 rounded focus:ring-[#F54927]" />
                    <span className="ml-2 block text-sm text-gray-700 select-none">Actualmente estudiando aquí</span>
                </label>
            </div>
          </div>
        ))}
        <AddButton onClick={() => handlers.addListItem('education', { id: `edu_${Date.now()}`, institution: '', degree: '', city: '', country: 'Chile', startDate: '', endDate: '', isCurrent: false })}>Agregar Educación</AddButton>
      </Section>
      
      <Section title="Experiencia Profesional">
        {data.experience.map((exp, index) => (
            <div key={exp.id} className="p-4 border bg-slate-50/80 border-slate-200 rounded-lg space-y-3">
               <div className="flex justify-between items-center border-b border-slate-200 pb-2 mb-3">
                <h4 className="font-semibold text-gray-700">Experiencia {index + 1}</h4>
                <button onClick={() => handlers.removeListItem('experience', index)} title="Eliminar" className="text-gray-500 hover:text-red-600 transition-colors p-1 rounded-full hover:bg-red-50">
                  <TrashIcon className="h-5 w-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="md:col-span-2">
                    <InputField label="Cargo" name="position" value={exp.position} onChange={(e) => handlers.updateListItem('experience', index, e)} />
                </div>
                <div className="md:col-span-2">
                    <InputField label="Empresa" name="company" value={exp.company} onChange={(e) => handlers.updateListItem('experience', index, e)} />
                </div>
                <InputField label="Ciudad" name="city" value={exp.city} onChange={(e) => handlers.updateListItem('experience', index, e)} placeholder="Ej: Los Ángeles" />
                <InputField label="País" name="country" value={exp.country} onChange={(e) => handlers.updateListItem('experience', index, e)} placeholder="Ej: Chile"/>
                
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-600">Fecha Inicio</label>
                  <div className="grid grid-cols-2 gap-2">
                    <MonthSelect name="startMonth" value={exp.startMonth} onChange={(e) => handlers.updateListItem('experience', index, e)} />
                    <InputField name="startDate" value={exp.startDate} onChange={(e) => handlers.updateListItem('experience', index, e)} placeholder="Año" />
                  </div>
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-600">Fecha Fin</label>
                  <div className="grid grid-cols-2 gap-2">
                    <MonthSelect name="endMonth" value={exp.endMonth} onChange={(e) => handlers.updateListItem('experience', index, e)} disabled={exp.isCurrent} />
                    <InputField name="endDate" value={exp.endDate} onChange={(e) => handlers.updateListItem('experience', index, e)} placeholder="Año" disabled={exp.isCurrent} />
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-x-6 pt-1">
                <label className="flex items-center">
                    <input type="checkbox" id={`exp_current_${exp.id}`} name="isCurrent" checked={exp.isCurrent} onChange={(e) => handlers.updateListItem('experience', index, e)} className="h-4 w-4 text-[#D43C1E] border-gray-300 rounded focus:ring-[#F54927]" />
                    <span className="ml-2 block text-sm text-gray-700 select-none">Actualmente trabajando aquí</span>
                </label>
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-600">Descripción</label>
                <div className="relative">
                    <textarea name="description" value={exp.description} onChange={(e) => handlers.updateListItem('experience', index, e)} rows={4} className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring-1 focus:ring-[#F54927] focus:border-[#F54927] pr-10" />
                    <button onClick={() => handlers.handleImproveDescription('experience', index)} disabled={isLoading} title={exp.description ? "Mejorar con IA" : "Generar con IA"} className="absolute bottom-2 right-2 p-2 text-gray-500 hover:text-[#F54927] rounded-full hover:bg-[#FEECE8] transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                        <PencilIcon />
                    </button>
                </div>
              </div>
            </div>
          ))}
        <AddButton onClick={() => handlers.addListItem('experience', { id: `exp_${Date.now()}`, company: '', city: '', country: 'Chile', position: '', startMonth: '', startDate: '', endMonth: '', endDate: '', description: '', isCurrent: false })}>Agregar Experiencia</AddButton>
      </Section>

      <Section title="Habilidades Técnicas">
        {data.skills.map((skill, index) => (
          <div key={skill.id} className="p-4 border bg-slate-50/80 border-slate-200 rounded-lg space-y-3">
             <div className="flex justify-between items-center border-b border-slate-200 pb-2 mb-3">
              <h4 className="font-semibold text-gray-700">Habilidad {index + 1}</h4>
              <button onClick={() => handlers.removeListItem('skills', index)} title="Eliminar" className="text-gray-500 hover:text-red-600 transition-colors p-1 rounded-full hover:bg-red-50">
                <TrashIcon className="h-5 w-5" />
              </button>
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <InputField label="Habilidad / Software" name="skill" value={skill.skill} onChange={(e) => handlers.updateListItem('skills', index, e)} placeholder="Ej: Microsoft Excel" />
                 <div>
                    <label className="block mb-1 text-sm font-medium text-gray-600">Nivel</label>
                    <SkillLevelSelect name="level" value={skill.level} onChange={(e) => handlers.updateListItem('skills', index, e)} />
                </div>
             </div>
          </div>
        ))}
        <AddButton onClick={() => handlers.addListItem('skills', { id: `skill_${Date.now()}`, skill: '', level: 'Básico' })}>Agregar Habilidad</AddButton>
      </Section>

      <Section title="Formación Complementaria">
        {data.complementaryTraining.map((course, index) => (
           <div key={course.id} className="p-4 border bg-slate-50/80 border-slate-200 rounded-lg space-y-3">
             <div className="flex justify-between items-center border-b border-slate-200 pb-2 mb-3">
                <h4 className="font-semibold text-gray-700">Formación {index + 1}</h4>
                <button onClick={() => handlers.removeListItem('complementaryTraining', index)} title="Eliminar" className="text-gray-500 hover:text-red-600 transition-colors p-1 rounded-full hover:bg-red-50">
                  <TrashIcon className="h-5 w-5" />
                </button>
              </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="md:col-span-2">
                  <InputField label="Curso / Certificación" name="course" value={course.course} onChange={(e) => handlers.updateListItem('complementaryTraining', index, e)} />
                </div>
                <InputField label="Institución" name="institution" value={course.institution} onChange={(e) => handlers.updateListItem('complementaryTraining', index, e)} />
                <InputField label="Año" name="year" value={course.year} onChange={(e) => handlers.updateListItem('complementaryTraining', index, e)} />
                <InputField label="Ciudad" name="city" value={course.city} onChange={(e) => handlers.updateListItem('complementaryTraining', index, e)} placeholder="Ej: Los Ángeles" />
                <InputField label="País" name="country" value={course.country} onChange={(e) => handlers.updateListItem('complementaryTraining', index, e)} placeholder="Ej: Chile"/>
             </div>
             
             <div>
                <label htmlFor={`comp_desc_${course.id}`} className="block mb-1 text-sm font-medium text-gray-600">Descripción</label>
                <div className="relative">
                    <textarea id={`comp_desc_${course.id}`} name="description" value={course.description} onChange={(e) => handlers.updateListItem('complementaryTraining', index, e)} rows={3} placeholder="Breve descripción del curso, tecnologías aprendidas, etc." className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring-1 focus:ring-[#F54927] focus:border-[#F54927] pr-10" />
                    <button onClick={() => handlers.handleImproveDescription('complementaryTraining', index)} disabled={isLoading} title={course.description ? "Mejorar con IA" : "Generar con IA"} className="absolute bottom-2 right-2 p-2 text-gray-500 hover:text-[#F54927] rounded-full hover:bg-[#FEECE8] transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                        <PencilIcon />
                    </button>
                </div>
              </div>
          </div>
        ))}
        <AddButton onClick={() => handlers.addListItem('complementaryTraining', { id: `comp_${Date.now()}`, course: '', institution: '', year: '', description: '', city: '', country: 'Chile' })}>Agregar Curso</AddButton>
      </Section>
      
      <Section title="Licencia de Conducir">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="hasDrivingLicense"
            name="hasDrivingLicense"
            checked={data.hasDrivingLicense}
            onChange={handlers.handleHasDrivingLicenseChange}
            className="h-4 w-4 text-[#D43C1E] border-gray-300 rounded focus:ring-[#F54927]"
          />
          <label htmlFor="hasDrivingLicense" className="ml-2 font-medium text-gray-700 select-none">
            Tengo licencia de conducir
          </label>
        </div>
        
        {data.hasDrivingLicense && (
          <div className="space-y-3 pt-4 mt-4 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-2">
              <h4 className="font-semibold text-gray-700 md:col-span-1">Profesionales</h4>
              <div className="md:col-span-3 grid grid-cols-3 gap-4">
                {LICENSE_CLASSES.profesionales.map(lic => (
                  <CheckboxField key={lic} label={`Clase ${lic}`} name={lic} checked={data.drivingLicense[lic as keyof typeof data.drivingLicense]} onChange={handlers.handleDrivingLicenseChange} />
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-2">
              <h4 className="font-semibold text-gray-700 md:col-span-1">No Profesionales</h4>
              <div className="md:col-span-3 grid grid-cols-3 gap-4">
                {LICENSE_CLASSES.noProfesionales.map(lic => (
                  <CheckboxField key={lic} label={`Clase ${lic}`} name={lic} checked={data.drivingLicense[lic as keyof typeof data.drivingLicense]} onChange={handlers.handleDrivingLicenseChange} />
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-2">
              <h4 className="font-semibold text-gray-700 md:col-span-1">Especiales</h4>
              <div className="md:col-span-3 grid grid-cols-3 gap-4">
                {LICENSE_CLASSES.especiales.map(lic => (
                  <CheckboxField key={lic} label={`Clase ${lic}`} name={lic} checked={data.drivingLicense[lic as keyof typeof data.drivingLicense]} onChange={handlers.handleDrivingLicenseChange} />
                ))}
              </div>
            </div>
          </div>
        )}
      </Section>
    </div>
  );
};