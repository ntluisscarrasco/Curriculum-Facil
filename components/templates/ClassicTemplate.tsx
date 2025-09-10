import React, { forwardRef } from 'react';
import type { CVData, DrivingLicenseData, ExperienceEntry } from '../../types';
import { LICENSE_CLASSES } from '../../constants';

interface CVPreviewProps {
  data: CVData;
}

const CVSection: React.FC<{ title: string; children: React.ReactNode; className?: string; accentColor: string; }> = ({ title, children, className = '', accentColor }) => (
  <section className={`mt-3 ${className}`}>
    <h2
      className="text-center font-bold uppercase border-b-2 border-solid border-gray-800 pb-1 mb-3"
      style={{ fontSize: '12pt', color: accentColor, textTransform: 'uppercase', fontWeight: 'bold' }}
    >
      {title}
    </h2>
    <div>{children}</div>
  </section>
);

export const ClassicTemplate = forwardRef<HTMLDivElement, CVPreviewProps>(({ data }, ref) => {
  const { personal, summary, experience, education, skills, complementaryTraining, drivingLicense, accentColor, fontSizes } = data;
  const effectiveColor = accentColor || '#003366';

  const formatUrl = (url: string) => url.replace(/^(https?:\/\/)?(www\.)?/, '').replace(/\/$/, '');

  const sortByDate = <T extends { startDate: string; endDate: string }>(a: T, b: T): number => {
    const getYear = (dateStr: string): number => {
      const normalizedDateStr = dateStr?.trim().toLowerCase();
      if (!normalizedDateStr) return 0;
      if (['presente', 'actualmente'].includes(normalizedDateStr)) {
          return new Date().getFullYear() + 1;
      }
      const year = parseInt(dateStr, 10);
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

  const formatLocation = (item: { city?: string; country?: string; }): string => {
    const location = [item.city, item.country].filter(Boolean).join(', ');
    return location ? `, ${location}` : '';
  };

  const allSelectedLicenses = Object.keys(LICENSE_CLASSES)
    .flatMap(category => LICENSE_CLASSES[category as keyof typeof LICENSE_CLASSES])
    .filter(lic => drivingLicense[lic as keyof DrivingLicenseData]);

  const hasLicenses = data.hasDrivingLicense && allSelectedLicenses.length > 0;
  const hasAdditionalInfo = complementaryTraining.length > 0 || hasLicenses;
  
  const sortedEducation = [...education].sort(sortByDate);
  const sortedExperience = [...experience].sort(sortByDate);
  const fullPhoneNumber = [personal.phoneCountryCode, personal.phoneNumber].filter(Boolean).join(' ');
  
  const contactDetails = [
    personal.cityAndCountry && <span key="loc" style={{textTransform: 'capitalize'}}>{personal.cityAndCountry}</span>,
    personal.email && <span key="email">{personal.email}</span>,
    fullPhoneNumber && <span key="phone">{fullPhoneNumber}</span>,
    personal.linkedin && <a key="linkedin" href={`https://${formatUrl(personal.linkedin)}`} target="_blank" rel="noopener noreferrer" style={{color: '#1D4ED8'}}>{formatUrl(personal.linkedin)}</a>,
    personal.website && <a key="website" href={`https://${formatUrl(personal.website)}`} target="_blank" rel="noopener noreferrer" style={{color: '#1D4ED8'}}>{formatUrl(personal.website)}</a>
  ].filter(Boolean);

  return (
    <div ref={ref} className="bg-white shadow-lg" style={{ 
        width: '215.9mm', 
        minHeight: '279.4mm',
        padding: '1.5cm 1.75cm 2cm 2.0cm',
        boxSizing: 'border-box',
        fontFamily: 'Arial, sans-serif',
        fontSize: '10pt',
        color: 'black',
        display: 'flex',
        flexDirection: 'column'
    }}>
        <header className="text-center border-b-2 border-gray-800 pb-3">
          <h1
            className="tracking-tight"
            style={{ fontSize: `${fontSizes.name}pt`, color: effectiveColor, fontWeight: 'bold', textTransform: 'uppercase' }}
          >
            {personal.name || 'TU NOMBRE COMPLEto'}
          </h1>
          <div className="mt-2" style={{textAlign: 'center', color: 'black', marginTop: '0.5rem', fontSize: `${fontSizes.personal}pt`}}>
            {contactDetails.map((detail, index) => (
              <React.Fragment key={index}>
                {detail}
                {index < contactDetails.length - 1 && ' \u2022 '}
              </React.Fragment>
            ))}
          </div>
        </header>

        <main className="mt-2 flex-grow">
          {summary && (
              <p className="leading-relaxed text-justify" style={{textAlign: 'justify'}}>{summary}</p>
          )}

          {sortedExperience.length > 0 && (
            <CVSection title="Experiencia Profesional" accentColor={effectiveColor}>
              {sortedExperience.map((exp: ExperienceEntry) => (
                <div key={exp.id} className="mb-3 last:mb-0">
                  <table style={{ width: '100%', borderSpacing: 0 }}><tbody><tr>
                    <td style={{ padding: 0, textAlign: 'left' }}>
                      <h3 style={{ fontWeight: 'bold', textTransform: 'capitalize', color: 'black', margin: 0 }}>{exp.position || 'Cargo'}</h3>
                    </td>
                    <td style={{ padding: 0, textAlign: 'right', verticalAlign: 'bottom' }}>
                      <p style={{ fontWeight: 500, color: 'black', margin: 0, fontSize: '11pt' }}>{formatExpDate(exp.startMonth, exp.startDate)} - {formatExpDate(exp.endMonth, exp.endDate)}</p>
                    </td>
                  </tr></tbody></table>
                  <p style={{fontStyle: 'italic', margin: '0'}}><span style={{textTransform: 'uppercase'}}>{exp.company || 'Empresa'}</span><span style={{textTransform: 'capitalize'}}>{formatLocation(exp)}</span></p>
                  <ul className="list-disc list-outside pl-4 mt-1 leading-snug space-y-1" style={{paddingLeft: '1rem', marginTop: '0.25rem'}}>
                    {exp.description.split('\n').map((line, i) => line.trim().replace(/^•\s*/, '') && <li key={i}>{line.replace(/^•\s*/, '')}</li>)}
                  </ul>
                </div>
              ))}
            </CVSection>
          )}

          {sortedEducation.length > 0 && (
            <CVSection title="Educación" accentColor={effectiveColor}>
              {sortedEducation.map(edu => (
                <div key={edu.id} className="mb-2 last:mb-0">
                   <table style={{ width: '100%', borderSpacing: 0 }}><tbody><tr>
                    <td style={{ padding: 0, textAlign: 'left' }}>
                      <h3 style={{ fontWeight: 'bold', textTransform: 'capitalize', color: 'black', margin: 0 }}>{edu.degree || 'Título'}</h3>
                    </td>
                    <td style={{ padding: 0, textAlign: 'right', verticalAlign: 'bottom' }}>
                      <p style={{ fontWeight: 500, color: 'black', margin: 0, fontSize: '11pt' }}>{edu.startDate} - {edu.endDate}</p>
                    </td>
                  </tr></tbody></table>
                  <p style={{fontStyle: 'italic', margin: '0'}}><span style={{textTransform: 'uppercase'}}>{edu.institution || 'Institución'}</span><span style={{textTransform: 'capitalize'}}>{formatLocation(edu)}</span></p>
                </div>
              ))}
            </CVSection>
          )}

          {skills.length > 0 && (
            <CVSection title="Habilidades Técnicas" accentColor={effectiveColor}>
              <ul style={{ margin: 0, paddingLeft: '1rem', listStyle: 'disc', columns: 2, columnGap: '40px' }}>
                {skills.map((skill) => (
                  <li key={skill.id} style={{ textTransform: 'capitalize', marginBottom: '4px' }}>
                    {skill.skill}: {skill.level}
                  </li>
                ))}
              </ul>
            </CVSection>
          )}
          
          {hasAdditionalInfo && (
            <CVSection title="Formación Complementaria" accentColor={effectiveColor}>
              <div className="space-y-3">
                {complementaryTraining.map(course => (
                  <div key={course.id}>
                    <table style={{ width: '100%', borderSpacing: 0 }}><tbody><tr>
                      <td style={{ padding: 0, textAlign: 'left' }}>
                        <h3 style={{ fontWeight: 'bold', textTransform: 'capitalize', margin: 0 }}>
                          {course.course ? (course.course.endsWith('.') ? course.course : `${course.course}.`) : 'Curso.'}
                        </h3>
                      </td>
                      <td style={{ padding: 0, textAlign: 'right', verticalAlign: 'bottom' }}>
                        <p style={{ fontWeight: 500, color: 'black', margin: 0, fontSize: '11pt' }}>{course.year || 'Año'}</p>
                      </td>
                    </tr></tbody></table>
                    
                    <p style={{fontStyle: 'italic', margin: '0'}}>
                      <span style={{textTransform: 'uppercase'}}>{course.institution || 'Institución'}</span>
                      <span style={{textTransform: 'capitalize'}}>{formatLocation(course)}</span>
                    </p>

                    {course.description && (
                      <ul className="list-disc list-outside pl-4 mt-1 leading-snug space-y-1" style={{paddingLeft: '1rem', marginTop: '0.25rem'}}>
                        {course.description.split('\n').map((line, i) =>
                          line.trim().replace(/^•\s*/, '') && <li key={i}>{line.replace(/^•\s*/, '')}</li>
                        )}
                      </ul>
                    )}
                  </div>
                ))}

                {hasLicenses && (
                  <div className="pt-2" style={{paddingTop: '0.5rem'}}>
                    <h3 style={{fontWeight: 'bold', textTransform: 'capitalize', fontSize: '12pt'}}>Licencia de Conducir</h3>
                    <p style={{ marginTop: '0.25rem' }}>
                      Clase {allSelectedLicenses.join(', ')}, Chile
                    </p>
                  </div>
                )}
              </div>
            </CVSection>
          )}
        </main>
    </div>
  );
});