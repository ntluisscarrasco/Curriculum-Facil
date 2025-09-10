

import React, { forwardRef } from 'react';
import type { CVData, DrivingLicenseData, ExperienceEntry, SkillEntry } from '../../types.ts';
import { EnvelopeIcon } from '../icons/EnvelopeIcon.tsx';
import { PhoneIcon } from '../icons/PhoneIcon.tsx';
import { LinkedinIcon } from '../icons/LinkedinIcon.tsx';
import { GlobeIcon } from '../icons/GlobeIcon.tsx';
import { LocationPinIcon } from '../icons/LocationPinIcon.tsx';
import { LICENSE_CLASSES } from '../../constants.ts';

interface CVPreviewProps {
  data: CVData;
}

const formatUrl = (url: string) => url.replace(/^(https?:\/\/)?(www\.)?/, '').replace(/\/$/, '');

const sortByDate = <T extends { startDate: string; endDate: string }>(a: T, b: T): number => {
  const getYear = (dateStr: string): number => {
    const normalizedDateStr = dateStr?.trim().toLowerCase();
    if (!normalizedDateStr) return 0;
    if (['presente', 'actualmente'].includes(normalizedDateStr)) {
        return new Date().getFullYear() + 1;
    }
    const year = parseInt(dateStr.slice(-4));
    return isNaN(year) ? 0 : year;
  };

  const endDateA = getYear(a.endDate);
  const endDateB = getYear(b.endDate);

  if (endDateA !== endDateB) {
    return endDateB - endDateA;
  }

  const startDateA = getYear(a.startDate);
  const startDateB = getYear(b.startDate);
  return startDateB - startDateA;
};

const formatExpDate = (month?: string, year?: string): string => {
  if (!year) return '';
  if (['presente', 'actualmente'].includes(year.trim().toLowerCase())) return 'Presente';
  return [month, year].filter(Boolean).join(', ');
};

const ContactItem: React.FC<{icon: React.ReactNode; text?: string; href?: string; textClassName?: string;}> = ({ icon, text, href, textClassName = '' }) => {
    if (!text) return null;
    const content = <div className="flex items-center gap-3"><div className="w-4 h-4 pdf-icon-adjust">{icon}</div><span className={`break-all ${textClassName} pdf-text-adjust`}>{text}</span></div>;
    return href ? <a href={href} target="_blank" rel="noopener noreferrer" className="hover:text-[#F98C75] transition-colors">{content}</a> : content;
};

const SkillLevelBar: React.FC<{ level: SkillEntry['level'], accentColor: string }> = ({ level, accentColor }) => {
    const levelMap: Record<SkillEntry['level'], { width: string; }> = {
      'Básico': { width: '33%' },
      'Intermedio': { width: '66%' },
      'Avanzado': { width: '100%' },
    };
    const { width } = levelMap[level];

    return (
        <div className="w-full bg-slate-200 rounded-full h-2">
            <div className="h-2 rounded-full" style={{ width, backgroundColor: accentColor }}></div>
        </div>
    );
};


export const ModernTemplate = forwardRef<HTMLDivElement, CVPreviewProps>(({ data }, ref) => {
  const { personal, summary, experience, education, skills, complementaryTraining, hasDrivingLicense, drivingLicense, accentColor } = data;

  const sortedExperience = [...experience].sort(sortByDate);
  const sortedEducation = [...education].sort(sortByDate);
  
  const allSelectedLicenses = Object.keys(LICENSE_CLASSES)
    .flatMap(category => LICENSE_CLASSES[category as keyof typeof LICENSE_CLASSES])
    .filter(lic => drivingLicense[lic as keyof DrivingLicenseData]);

  const hasLicenses = hasDrivingLicense && allSelectedLicenses.length > 0;
  const fullPhoneNumber = [personal.phoneCountryCode, personal.phoneNumber].filter(Boolean).join(' ');
  const telLink = fullPhoneNumber.replace(/\s/g, '');
  
  const formatLocation = (item: { city?: string; country?: string; }): string => {
    const location = [item.city, item.country].filter(Boolean).join(', ');
    return location ? `, ${location}` : '';
  };

  return (
    <div ref={ref} className="bg-white flex shadow-lg" style={{ width: '215.9mm', minHeight: '279.4mm' }}>
      {/* Sidebar */}
      <div className="w-1/3 text-white flex flex-col font-light" style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif", backgroundColor: '#171D8C', padding: '1.5cm 2rem 2rem 1.75cm' }}>
        
        <div className="space-y-4" style={{ fontSize: '9pt' }}>
            <h2 className="uppercase font-bold mb-3 border-b border-solid border-slate-600 pb-1" style={{ fontSize: '12pt', color: accentColor }}><span className="pdf-text-adjust">Contacto</span></h2>
            <ContactItem icon={<LocationPinIcon />} text={personal.cityAndCountry} textClassName="capitalize" />
            <ContactItem icon={<PhoneIcon />} text={fullPhoneNumber} href={`tel:${telLink}`} />
            <ContactItem icon={<EnvelopeIcon />} text={personal.email} href={`mailto:${personal.email}`} />
            <ContactItem icon={<LinkedinIcon />} text={formatUrl(personal.linkedin)} href={`https://${formatUrl(personal.linkedin)}`} />
            <ContactItem icon={<GlobeIcon />} text={formatUrl(personal.website)} href={`https://${formatUrl(personal.website)}`} />
        </div>

        {sortedEducation.length > 0 && (
            <div className="mt-8">
                <h2 className="uppercase font-bold mb-3 border-b border-solid border-slate-600 pb-1" style={{ fontSize: '12pt', color: accentColor }}><span className="pdf-text-adjust">Educación</span></h2>
                <div className="space-y-4" style={{ fontSize: '9pt' }}>
                {sortedEducation.map(edu => (
                    <div key={edu.id}>
                        <p className="font-semibold text-white capitalize pdf-text-adjust">{edu.degree || 'Título'}</p>
                        <p className="text-slate-300 pdf-text-adjust"><span className="uppercase">{edu.institution || 'Institución'}</span><span className="capitalize">{formatLocation(edu)}</span></p>
                        <p className="text-slate-400 pdf-text-adjust">{edu.startDate} - {edu.endDate}</p>
                    </div>
                ))}
                </div>
            </div>
        )}

        {(complementaryTraining.length > 0 || hasLicenses) && (
            <div className="mt-8">
                <h2 className="uppercase font-bold mb-3 border-b border-solid border-slate-600 pb-1" style={{ fontSize: '12pt', color: accentColor }}><span className="pdf-text-adjust">Formación Complementaria</span></h2>
                <div className="space-y-4" style={{ fontSize: '9pt' }}>
                    {complementaryTraining.map(course => (
                        <div key={course.id}>
                            <p className="font-semibold text-white capitalize pdf-text-adjust">{course.course || 'Curso'}</p>
                            <p className="text-slate-300 pdf-text-adjust"><span className="uppercase">{course.institution}</span><span className="capitalize">{formatLocation(course)}</span></p>
                             {course.year && <p className="text-slate-400 pdf-text-adjust">{course.year}</p>}
                        </div>
                    ))}
                    {hasLicenses && (
                         <div>
                            <p className="font-semibold text-white pdf-text-adjust">Licencia de Conducir</p>
                            <div className="text-slate-300 capitalize">
                                <p className="pdf-text-adjust">Clase {allSelectedLicenses.join(', ')}, Chile</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        )}
      </div>

      {/* Main Content */}
      <div className="w-2/3 bg-white" style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif", backgroundColor: '#ffffff', fontSize: '10pt', padding: '1.5cm 1.75cm 2rem 2rem' }}>
        <div className="mb-8">
            <h1 className="font-bold tracking-tight leading-tight text-slate-800 capitalize" style={{ fontSize: '28pt' }}>{personal.name || 'Tu Nombre'}</h1>
        </div>
        
        {summary && (
            <section>
                <p className="text-slate-700 leading-relaxed text-justify pdf-text-adjust">{summary}</p>
            </section>
        )}

        {sortedExperience.length > 0 && (
            <section className="mt-6">
                 <h2 className="font-bold text-slate-800 border-b-2 border-solid border-slate-200 pb-1 mb-5 uppercase" style={{ fontSize: '14pt' }}><span className="pdf-text-adjust">Experiencia Profesional</span></h2>
                 <div className="space-y-5">
                    {sortedExperience.map((exp: ExperienceEntry) => (
                        <div key={exp.id}>
                            <div className="flex justify-between items-baseline">
                                <h3 className="font-bold text-slate-700 capitalize pdf-text-adjust" style={{ fontSize: '11pt' }}>{exp.position || 'Cargo'}</h3>
                                <p className="font-medium text-slate-500 pdf-text-adjust" style={{ fontSize: '10pt' }}>
                                {formatExpDate(exp.startMonth, exp.startDate)} - {formatExpDate(exp.endMonth, exp.endDate)}
                                </p>
                            </div>
                            <h4 className="font-semibold pdf-text-adjust" style={{ fontSize: '10.5pt', color: accentColor }}><span className="uppercase">{exp.company || 'Empresa'}</span><span className="capitalize">{formatLocation(exp)}</span></h4>
                            <ul className="list-disc list-outside pl-4 mt-1 text-slate-600 leading-snug space-y-1">
                                {exp.description.split('\n').map((line, i) => line.trim().replace(/^•\s*/, '') && <li key={i} className="pdf-text-adjust">{line.replace(/^•\s*/, '')}</li>)}
                            </ul>
                        </div>
                    ))}
                 </div>
            </section>
        )}

        {skills.length > 0 && (
          <section className="mt-6">
            <h2 className="font-bold text-slate-800 border-b-2 border-solid border-slate-200 pb-1 mb-5 uppercase" style={{ fontSize: '14pt' }}><span className="pdf-text-adjust">Habilidades Técnicas</span></h2>
            <div className="grid grid-cols-2 gap-x-8 gap-y-4">
              {skills.map((skill) => (
                <div key={skill.id}>
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="font-semibold text-slate-700 capitalize pdf-text-adjust" style={{ fontSize: '10pt' }}>{skill.skill}</h3>
                    <p className="text-slate-500 pdf-text-adjust" style={{ fontSize: '9pt' }}>{skill.level}</p>
                  </div>
                  <SkillLevelBar level={skill.level} accentColor={accentColor} />
                </div>
              ))}
            </div>
          </section>
        )}

      </div>
    </div>
  );
});