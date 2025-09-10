

import React, { forwardRef } from 'react';
import type { CVData, ExperienceEntry, EducationEntry, SkillEntry, ComplementaryTrainingEntry, DrivingLicenseData } from '../../types';
import { EnvelopeIcon } from '../icons/EnvelopeIcon';
import { PhoneIcon } from '../icons/PhoneIcon';
import { LocationPinIcon } from '../icons/LocationPinIcon';
import { LinkedinIcon } from '../icons/LinkedinIcon';
import { GlobeIcon } from '../icons/GlobeIcon';
import { LICENSE_CLASSES } from '../../constants';

// --- Template Configuration ---
const ACCENT_COLOR_LIGHT = '#FCE8EC';
const ACCENT_COLOR_DARK = '#E9B3BF';
const TEXT_COLOR_DARK = '#334155';
const TEXT_COLOR_LIGHT = '#64748B';

// --- Helper functions ---
const sortByDate = <T extends { startDate: string; endDate: string }>(a: T, b: T): number => {
  const getYear = (dateStr: string): number => {
    const normalizedDateStr = dateStr?.trim().toLowerCase();
    if (!normalizedDateStr) return 0;
    if (['presente', 'actualmente', 'present'].includes(normalizedDateStr)) {
        return new Date().getFullYear() + 1;
    }
    const yearMatch = dateStr.match(/\d{4}/g);
    const year = yearMatch ? parseInt(yearMatch[yearMatch.length - 1], 10) : 0;
    return isNaN(year) ? 0 : year;
  };

  const endDateA = getYear(a.endDate);
  const endDateB = getYear(b.endDate);
  if (endDateA !== endDateB) return endDateB - endDateA;

  const startDateA = getYear(a.startDate);
  const startDateB = getYear(b.startDate);
  return startDateB - startDateA;
};

const formatUrl = (url: string) => url ? url.replace(/^(https?:\/\/)?(www\.)?/, '').replace(/\/$/, '') : '';

const toTitleCase = (str: string): string => {
    if (!str) return '';
    return str
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
};

// --- Reusable Components for this Template ---

const Section: React.FC<{ title: string; children: React.ReactNode; className?: string; accentColor: string; }> = ({ title, children, className = '', accentColor }) => (
  <div className={className}>
    <h2 className="text-base font-bold inline-block px-4 py-2 rounded-lg mb-4" style={{ backgroundColor: ACCENT_COLOR_LIGHT, color: accentColor }}>
      <span className="pdf-text-adjust">{title}</span>
    </h2>
    <div className="text-sm text-slate-700 leading-relaxed space-y-4">
      {children}
    </div>
  </div>
);

const EducationEntryComponent: React.FC<{ entry: EducationEntry }> = ({ entry }) => (
  <div>
    <div className="flex justify-between items-baseline">
      <h3 className="font-bold text-base capitalize pdf-text-adjust" style={{ color: TEXT_COLOR_DARK }}>{entry.degree || 'Título'}</h3>
      <p className="font-semibold text-sm whitespace-nowrap pl-2 pdf-text-adjust" style={{ color: TEXT_COLOR_LIGHT }}>
        {entry.startDate}{entry.endDate && ` - ${entry.endDate}`}
      </p>
    </div>
    <p className="font-semibold text-sm uppercase pdf-text-adjust" style={{ color: TEXT_COLOR_LIGHT }}>{entry.institution || 'Institución'}</p>
  </div>
);

const ExperienceEntryComponent: React.FC<{ entry: ExperienceEntry }> = ({ entry }) => {
  const formatExpDate = (month?: string, year?: string): string => {
    if (!year) return '';
    if (['presente', 'actualmente'].includes(year.trim().toLowerCase())) return 'Presente';
    return [month, year].filter(Boolean).join(' ');
  };

  return (
    <div>
      <div className="flex justify-between items-baseline">
        <h3 className="font-bold text-base capitalize pdf-text-adjust" style={{ color: TEXT_COLOR_DARK }}>{entry.position || 'Cargo'}</h3>
        <p className="font-semibold text-sm whitespace-nowrap pl-2 pdf-text-adjust" style={{ color: TEXT_COLOR_LIGHT }}>
          {formatExpDate(entry.startMonth, entry.startDate)} - {formatExpDate(entry.endMonth, entry.endDate)}
        </p>
      </div>
      <p className="font-semibold text-sm uppercase pdf-text-adjust" style={{ color: TEXT_COLOR_LIGHT }}>{entry.company || 'Empresa'}</p>
      {entry.description && (
        <ul className="list-disc list-outside pl-3 mt-1 text-slate-600 leading-snug space-y-1 text-sm">
          {entry.description.split('\n').map((line, i) => line.trim().replace(/^•\s*/, '') && <li key={i} className="pdf-text-adjust">{line.replace(/^•\s*/, '')}</li>)}
        </ul>
      )}
    </div>
  );
};

const ComplementaryTrainingComponent: React.FC<{ entry: ComplementaryTrainingEntry }> = ({ entry }) => (
    <div>
      <div className="flex justify-between items-baseline">
        <h3 className="font-bold text-base capitalize pdf-text-adjust" style={{ color: TEXT_COLOR_DARK }}>{entry.course || 'Curso'}</h3>
        {entry.year && <p className="font-semibold text-sm whitespace-nowrap pl-2 pdf-text-adjust" style={{ color: TEXT_COLOR_LIGHT }}>{entry.year}</p>}
      </div>
      <p className="font-semibold text-sm uppercase pdf-text-adjust" style={{ color: TEXT_COLOR_LIGHT }}>{entry.institution || 'Institución'}</p>
      {entry.description && (
        <ul className="list-disc list-outside pl-3 mt-1 text-slate-600 leading-snug space-y-1 text-sm">
          {entry.description.split('\n').map((line, i) => line.trim().replace(/^•\s*/, '') && <li key={i} className="pdf-text-adjust">{line.replace(/^•\s*/, '')}</li>)}
        </ul>
      )}
    </div>
);

const ContactEntry: React.FC<{ icon: React.ReactNode; text?: string; href?: string; }> = ({ icon, text, href }) => {
  if (!text) return null;
  const content = (
    <div className="relative pl-8 min-h-[24px]">
      <div className="absolute left-0 top-[2px] w-5 h-5" style={{ color: ACCENT_COLOR_DARK }}>
        {icon}
      </div>
      <p className="text-sm break-all pdf-text-adjust">{text}</p>
    </div>
  );

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className="hover:opacity-75 transition-opacity">
        {content}
      </a>
    );
  }
  return content;
};


// --- The Main Template Component ---

export const CreativeTemplate = forwardRef<HTMLDivElement, { data: CVData }>(({ data }, ref) => {
  const { personal, summary, experience, education, skills, complementaryTraining, hasDrivingLicense, drivingLicense, accentColor } = data;

  const sortedExperience = [...experience].sort(sortByDate);
  const sortedEducation = [...education].sort(sortByDate);

  const allSelectedLicenses = Object.keys(LICENSE_CLASSES)
    .flatMap(category => LICENSE_CLASSES[category as keyof typeof LICENSE_CLASSES])
    .filter(lic => drivingLicense[lic as keyof DrivingLicenseData]);

  const hasLicenses = hasDrivingLicense && allSelectedLicenses.length > 0;
  const hasAdditionalInfo = complementaryTraining.length > 0 || hasLicenses;

  const fullPhoneNumber = [personal.phoneCountryCode, personal.phoneNumber].filter(Boolean).join(' ');
  const telLink = fullPhoneNumber.replace(/\s/g, '');

  const contactItems = [
    { type: 'email', icon: <EnvelopeIcon />, text: personal.email, href: `mailto:${personal.email}` },
    { type: 'phone', icon: <PhoneIcon />, text: fullPhoneNumber, href: `tel:${telLink}` },
    { type: 'location', icon: <LocationPinIcon />, text: personal.cityAndCountry },
    { type: 'linkedin', icon: <LinkedinIcon />, text: formatUrl(personal.linkedin), href: personal.linkedin ? `https://${formatUrl(personal.linkedin)}` : undefined },
    { type: 'website', icon: <GlobeIcon />, text: formatUrl(personal.website), href: personal.website ? `https://${formatUrl(personal.website)}` : undefined },
  ].filter(item => item.text);

  const getContactGridClass = () => {
    const count = contactItems.length;
    if (count <= 3) {
      return 'grid-cols-3';
    }
    if (count === 4) {
      return 'grid-cols-2';
    }
    return 'grid-cols-3';
  };
  const contactGridClass = getContactGridClass();

  return (
    <div 
      ref={ref} 
      className="bg-white font-sans text-slate-800"
      style={{ width: '215.9mm', minHeight: '279.4mm' }}
    >
      <div className="flex flex-col justify-between" style={{minHeight: '279.4mm', padding: '0.5cm 1.75cm 3rem 1.75cm'}}>
        <div>
          {/* --- HEADER --- */}
          <header className="mb-8">
              <div className="mb-6 pt-4">
                <h1 className="text-6xl font-bold text-right" style={{ fontFamily: "'Playfair Display', serif", color: accentColor }}>
                    {toTitleCase(personal.name) || 'Tu Nombre'}
                </h1>
              </div>
              <div className="space-y-3">
                  <div style={{ borderTop: `3px solid ${ACCENT_COLOR_DARK}` }}></div>
                  <div className="flex justify-end">
                      <div className="w-1/2" style={{ borderTop: `3px solid ${ACCENT_COLOR_DARK}` }}></div>
                  </div>
              </div>
          </header>

          {/* --- CONTACT INFO --- */}
          <div className="rounded-lg p-4 mb-8" style={{ backgroundColor: ACCENT_COLOR_LIGHT }}>
            <h2 className="text-base font-bold text-center mb-3" style={{ color: TEXT_COLOR_DARK }}>
              <span className="pdf-text-adjust">Información de contacto</span>
            </h2>
            <div className={`grid ${contactGridClass} gap-x-8 gap-y-4 text-slate-700`}>
              {contactItems.map(item => (
                  <ContactEntry key={item.type} icon={item.icon} text={item.text} href={item.href} />
              ))}
            </div>
          </div>

          {/* --- MAIN CONTENT (2 columns) --- */}
          <main className="grid grid-cols-12">
            
            {/* Left Column */}
            <div className="col-span-7 flex flex-col gap-6 pr-4 border-r border-slate-300">
              {summary && (
                <Section title="Perfil profesional" accentColor={accentColor}>
                  <p className="text-justify pdf-text-adjust">{summary}</p>
                </Section>
              )}
              
              {sortedExperience.length > 0 && (
                <Section title="Experiencia" accentColor={accentColor}>
                  {sortedExperience.map((exp: ExperienceEntry) => (
                    <ExperienceEntryComponent key={exp.id} entry={exp} />
                  ))}
                </Section>
              )}
            </div>

            {/* Right Column */}
            <div className="col-span-5 flex flex-col gap-6 pl-4">
              {sortedEducation.length > 0 && (
                <Section title="Estudios" accentColor={accentColor}>
                  {sortedEducation.map((edu: EducationEntry) => (
                    <EducationEntryComponent key={edu.id} entry={edu} />
                  ))}
                </Section>
              )}
              
              {skills.length > 0 && (
                <Section title="Habilidades Técnicas" accentColor={accentColor}>
                  <ul className="list-disc list-outside pl-4 space-y-1 text-sm">
                    {skills.map((skill: SkillEntry) => (
                      <li key={skill.id} className="capitalize pdf-text-adjust">
                        {skill.skill}: <span className="font-semibold">{skill.level}</span>
                      </li>
                    ))}
                  </ul>
                </Section>
              )}

              {hasAdditionalInfo && (
                <Section title="Información Adicional" accentColor={accentColor}>
                  <div className="space-y-4">
                    {complementaryTraining.map(course => (
                      <ComplementaryTrainingComponent key={course.id} entry={course} />
                    ))}
                    {hasLicenses && (
                      <div className={complementaryTraining.length > 0 ? 'pt-4 mt-4 border-t border-slate-200' : ''}>
                        <h3 className="font-bold text-base pdf-text-adjust" style={{ color: TEXT_COLOR_DARK }}>Licencia de Conducir</h3>
                        <p className="mt-1 text-slate-600 text-sm capitalize pdf-text-adjust">
                          Clase {allSelectedLicenses.join(', ')}, Chile
                        </p>
                      </div>
                    )}
                  </div>
                </Section>
              )}
            </div>
          </main>
        </div>

        {/* --- FOOTER DECORATION --- */}
        <footer className="mt-auto pt-4 space-y-3">
            <div className="flex justify-start">
                <div className="w-1/2" style={{ borderTop: `3px solid ${ACCENT_COLOR_DARK}` }}></div>
            </div>
            <div style={{ borderTop: `3px solid ${ACCENT_COLOR_DARK}` }}></div>
        </footer>
      </div>
    </div>
  );
});