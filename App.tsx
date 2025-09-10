
import React, { useState, useCallback, useRef, useEffect } from 'react';
import type { CVData, EducationEntry, ExperienceEntry, DrivingLicenseData, ComplementaryTrainingEntry, SkillEntry } from './types.js';
import { INITIAL_CV_DATA } from './constants.js';
import { CVForm } from './components/CVForm.js';
import { Footer } from './components/Footer.js';
import { TemplateSelector } from './components/TemplateSelector.js';
import { ClassicTemplate } from './components/templates/ClassicTemplate.js';
import { ModernTemplate } from './components/templates/ModernTemplate.js';
import { LoadingOverlay } from './components/LoadingOverlay.js';
import { generateSummary, extractDataFromCV, improveDescription, generateDescription, generateCoverLetter } from './services/geminiService.js';
import { ImportCVModal } from './components/ImportCVModal.js';
import { CreativeTemplate } from './components/templates/CreativeTemplate.js';
import { ActionBar } from './components/ActionBar.js';
import { RecommendationBox } from './components/RecommendationBox.js';
import { UploadIcon } from './components/icons/UploadIcon.js';
import { PencilIcon } from './components/icons/PencilIcon.js';
import { SparklesIcon } from './components/icons/SparklesIcon.js';
import { TemplateIcon } from './components/icons/TemplateIcon.js';
import { DownloadIcon } from './components/icons/DownloadIcon.js';
import { CoverLetterModal } from './components/CoverLetterModal.js';
import { CoverLetterPromptModal, type CoverLetterPromptData } from './components/CoverLetterPromptModal.js';
import { FontSizeSelector } from './components/FontSizeSelector.js';

declare const jspdf: any;
declare const html2canvas: any;

const COLORS = [
  { name: 'Negro', hex: '#000000' },
  { name: 'Morado Intenso', hex: '#4B0082' },
  { name: 'Borgoña', hex: '#800000' },
  { name: 'Azul Harvard', hex: '#003366' },
  { name: 'Rojo Intenso', hex: '#FF0000' },
  { name: 'Verde Bosque', hex: '#006400' },
  { name: 'Gris Pizarra', hex: '#4A4A4A' },
  { name: 'Verde Azulado', hex: '#008080' },
  { name: 'Rosado Profesional', hex: '#D14A82' },
  { name: 'Naranja Corporativo', hex: '#F54927' },
  { name: 'Amarillo Dorado', hex: '#FFC107' },
];

interface ColorSelectorProps {
  selectedColor: string;
  onColorChange: (color: string) => void;
}

const ColorSelector: React.FC<ColorSelectorProps> = ({ selectedColor, onColorChange }) => {
  return (
    <div className="bg-[#e3e4e5] p-5 rounded-lg shadow-md mb-8">
      <h3 className="text-lg font-bold text-gray-800 mb-4 text-center">Color de Acento</h3>
      <div className="flex justify-center items-center gap-3 flex-wrap">
        {COLORS.map(color => (
          <button
            key={color.hex}
            type="button"
            title={color.name}
            onClick={() => onColorChange(color.hex)}
            className={`w-8 h-8 rounded-full border-2 transition-transform transform hover:scale-110 ${selectedColor === color.hex ? 'border-gray-800 ring-2 ring-offset-2 ring-gray-700' : 'border-white/50'}`}
            style={{ backgroundColor: color.hex }}
            aria-label={`Seleccionar color ${color.name}`}
          />
        ))}
      </div>
    </div>
  );
};

type Template = 'classic' | 'modern' | 'creative';

function App(): React.ReactNode {
  const [cvData, setCvData] = useState<CVData>(INITIAL_CV_DATA);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isCoverLetterModalOpen, setIsCoverLetterModalOpen] = useState(false);
  const [isCoverLetterPromptModalOpen, setIsCoverLetterPromptModalOpen] = useState(false);
  const [coverLetterContent, setCoverLetterContent] = useState('');
  const [summaryError, setSummaryError] = useState<string | null>(null);
  const [template, setTemplate] = useState<Template>('classic');
  const [loadingMessage, setLoadingMessage] = useState<string | null>(null);
  const [formVisible, setFormVisible] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);
  const previewContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!formVisible) return;

    const scalePreview = () => {
      const previewElement = previewRef.current;
      const containerElement = previewContainerRef.current;

      if (previewElement && containerElement) {
        previewElement.style.transform = 'scale(1)';

        const containerStyle = window.getComputedStyle(containerElement);
        const paddingX = parseFloat(containerStyle.paddingLeft) + parseFloat(containerStyle.paddingRight);
        
        const availableWidth = containerElement.clientWidth - paddingX;
        const naturalWidth = previewElement.offsetWidth;
        const naturalHeight = previewElement.offsetHeight;

        if (naturalWidth === 0 || availableWidth <= 0) return;

        const scale = Math.min(1, availableWidth / naturalWidth);
        const scaledWidth = naturalWidth * scale;
        const offsetX = (availableWidth - scaledWidth) / 2;

        previewElement.style.transform = `translateX(${offsetX}px) scale(${scale})`;
        previewElement.style.transformOrigin = 'top left';
        
        if (previewElement.parentElement) {
          previewElement.parentElement.style.height = `${naturalHeight * scale}px`;
        }
      }
    };

    const timerId = setTimeout(scalePreview, 50);
    window.addEventListener('resize', scalePreview);

    return () => {
      clearTimeout(timerId);
      window.removeEventListener('resize', scalePreview);
    };
  }, [cvData, template, formVisible]);

  const handleDataChange = useCallback(<T extends keyof CVData>(field: T, value: CVData[T]) => {
    setCvData(prev => ({ ...prev, [field]: value }));
  }, []);

  const handlePersonalChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCvData(prev => ({
      ...prev,
      personal: { ...prev.personal, [name]: value },
    }));
  }, []);

  const handleCountryCodeChange = useCallback((code: string) => {
    setCvData(prev => ({
        ...prev,
        personal: { ...prev.personal, phoneCountryCode: code },
    }));
  }, []);

  const handleSummaryChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    handleDataChange('summary', e.target.value);
  }, [handleDataChange]);
  
  const handleDrivingLicenseChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setCvData(prev => ({
        ...prev,
        drivingLicense: {
            ...prev.drivingLicense,
            [name]: checked,
        },
    }));
  }, []);
  
  const handleHasDrivingLicenseChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { checked } = e.target;
    setCvData(prev => {
      const newCvData = { ...prev, hasDrivingLicense: checked };
      if (!checked) {
        newCvData.drivingLicense = Object.keys(prev.drivingLicense).reduce((acc, key) => {
          acc[key as keyof DrivingLicenseData] = false;
          return acc;
        }, {} as DrivingLicenseData);
      }
      return newCvData;
    });
  }, []);

  const handleFontSizeChange = useCallback((field: 'name' | 'personal', size: number) => {
    setCvData(prev => ({
        ...prev,
        fontSizes: {
            ...prev.fontSizes,
            [field]: size,
        },
    }));
  }, []);

  const updateListItem = useCallback(<K extends 'experience' | 'education' | 'complementaryTraining' | 'skills'>(
    listName: K, 
    index: number, 
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    
    setCvData(prev => {
        const newList = [...prev[listName]];
        const item = { ...newList[index] };

        if (type === 'checkbox') {
            const checked = (e.target as HTMLInputElement).checked;
            // @ts-ignore
            item[name] = checked;
        
            if (name === 'isCurrent' && (listName === 'experience' || listName === 'education')) {
                if (listName === 'experience') {
                    (item as ExperienceEntry).endDate = checked ? 'Presente' : '';
                    (item as ExperienceEntry).endMonth = checked ? '' : '';
                } else if (listName === 'education') {
                    (item as EducationEntry).endDate = checked ? 'Presente' : '';
                }
            }
        } else {
            // @ts-ignore
            item[name] = value;
        }
        
        // @ts-ignore
        newList[index] = item;
        return { ...prev, [listName]: newList };
    });
  }, []);
  
  const addListItem = useCallback(<K extends 'experience' | 'education' | 'complementaryTraining' | 'skills'>(listName: K, newItem: EducationEntry | ExperienceEntry | ComplementaryTrainingEntry | SkillEntry) => {
    const itemWithDefaults = { ...newItem };
    if (listName === 'experience' || listName === 'education') {
        (itemWithDefaults as EducationEntry | ExperienceEntry).isCurrent = false;
    }
    // @ts-ignore
    handleDataChange(listName, [...cvData[listName], itemWithDefaults]);
  }, [cvData, handleDataChange]);

  const removeListItem = useCallback(<K extends 'experience' | 'education' | 'complementaryTraining' | 'skills'>(listName: K, index: number) => {
    const newList = [...cvData[listName]];
    newList.splice(index, 1);
    // @ts-ignore
    handleDataChange(listName, newList);
  }, [cvData, handleDataChange]);

  const handleGenerateSummary = useCallback(async () => {
    const hasSummary = cvData.summary.trim().length > 0;
    setLoadingMessage(hasSummary ? "Mejorando perfil..." : "Generando perfil...");
    setSummaryError(null);
    try {
      const summaryText = await generateSummary(cvData.experience, cvData.education, cvData.skills, cvData.summary);
      handleDataChange('summary', summaryText);
    } catch (e) {
      console.error("Error generating summary:", e);
      const errorMessage = e instanceof Error ? e.message : "No se pudo procesar el resumen. Inténtalo de nuevo.";
      setLoadingMessage(null);
      alert(`Error: ${errorMessage}`);
    } finally {
      setLoadingMessage(null);
    }
  }, [cvData.experience, cvData.education, cvData.skills, cvData.summary, handleDataChange]);
  
  const handleImproveDescription = useCallback(async (
    listName: 'experience' | 'complementaryTraining', 
    index: number
  ) => {
    const item = cvData[listName][index];
    if (!item) return;

    const hasDescription = item.description?.trim();
    let promise;

    if (hasDescription) {
        setLoadingMessage("Mejorando texto con IA...");
        promise = improveDescription(item.description, listName);
    } else {
        if (listName === 'experience') {
            const expItem = item as ExperienceEntry;
            if (!expItem.position || !expItem.company) {
                alert("Por favor, introduce el cargo y la empresa para poder generar una descripción.");
                return;
            }
        }
        if (listName === 'complementaryTraining') {
            const trainItem = item as ComplementaryTrainingEntry;
            if (!trainItem.course || !trainItem.institution) {
                alert("Por favor, introduce el curso y la institución para poder generar una descripción.");
                return;
            }
        }
        setLoadingMessage("Generando descripción con IA...");
        promise = generateDescription(listName, item);
    }

    try {
        const newText = await promise;
        
        setCvData(prev => {
            const newList = [...prev[listName]];
            // @ts-ignore
            const updatedItem = { ...newList[index], description: newText };
            // @ts-ignore
            newList[index] = updatedItem;
            return { ...prev, [listName]: newList };
        });

    } catch (e) {
        console.error("Error with AI description:", e);
        const errorMessage = e instanceof Error ? e.message : "No se pudo procesar la descripción.";
        alert(`Error: ${errorMessage}`);
    } finally {
        setLoadingMessage(null);
    }
  }, [cvData]);

  const handleDownloadPdf = useCallback(async () => {
    const input = previewRef.current;
    if (!input) {
      console.error("Preview element not found");
      return;
    }
  
    setLoadingMessage("Generando PDF...");
    
    const fileName = `CV_${cvData.personal.name.replace(/ /g, '_') || 'CV'}.pdf`;
    const { jsPDF } = jspdf;
  
    const parentElement = input.parentElement as HTMLDivElement | null;
    const originalTransform = input.style.transform;
    const originalParentHeight = parentElement ? parentElement.style.height : '';
    const originalPosition = input.style.position;
    const originalLeft = input.style.left;

    input.style.transform = 'scale(1)';
    if (parentElement) {
      parentElement.style.height = 'auto'; 
    }
    
    input.style.position = 'relative';
    input.style.left = '0.2cm';

    const styleTagId = 'pdf-adjust-style';
    const tempPdfClass = 'classic-template-for-pdf';

    try {
      if (template === 'modern' || template === 'creative') {
        const style = document.createElement('style');
        style.id = styleTagId;
        
        let cssRules = '';
        if (template === 'modern') {
          cssRules = `
            .pdf-text-adjust {
              position: relative;
              top: -6px;
            }
            .pdf-icon-adjust {
              position: relative;
              top: 2px;
            }
          `;
        } else if (template === 'creative') {
          cssRules = `
            .pdf-text-adjust {
              position: relative;
              top: -7px;
            }
          `;
        }
        
        style.innerHTML = cssRules;
        document.head.appendChild(style);
        
        await new Promise(resolve => setTimeout(resolve, 100));
        
        const canvas = await html2canvas(input, {
          scale: 4,
          useCORS: true,
          logging: false,
        });
        
        const imgData = canvas.toDataURL('image/png');
        
        const doc = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: 'letter'
        });
    
        const pdfWidth = doc.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
        
        doc.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        doc.save(fileName);

      } else {
        const style = document.createElement('style');
        style.id = styleTagId;
        style.innerHTML = `
          .${tempPdfClass} h1, .${tempPdfClass} h2 {
            line-height: calc(1.2em + 10px) !important;
          }
        `;
        document.head.appendChild(style);
        input.classList.add(tempPdfClass);

        await new Promise(resolve => setTimeout(resolve, 50));
        
        const doc = new jsPDF({
          orientation: 'p',
          unit: 'pt',
          format: 'letter',
        });
  
        await doc.html(input, {
          callback: function (doc: any) {
            doc.save(fileName);
          },
          x: 0,
          y: 0,
          html2canvas: {
            scale: 0.72,
            useCORS: true,
            logging: false,
          },
          autoPaging: 'text',
        });
      }
  
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Ocurrió un error al generar el PDF.");
    } finally {
      input.style.transform = originalTransform;
      input.style.position = originalPosition;
      input.style.left = originalLeft;
      if (parentElement) {
        parentElement.style.height = originalParentHeight;
      }
      const styleTag = document.getElementById(styleTagId);
      if (styleTag) {
        styleTag.remove();
      }
      if (input.classList.contains(tempPdfClass)) {
        input.classList.remove(tempPdfClass);
      }
      setLoadingMessage(null);
    }
  }, [template, cvData.personal.name]);
  
  const toggleImportModal = () => setIsImportModalOpen(prev => !prev);
  
  const handleExtractData = async (cvText: string) => {
    setLoadingMessage("Analizando tu CV con IA...");
    try {
        const extractedData = await extractDataFromCV(cvText);

        setCvData(prev => {
            const newCvData = JSON.parse(JSON.stringify(INITIAL_CV_DATA));
            
            if (extractedData.personal) {
                newCvData.personal = { ...newCvData.personal, ...extractedData.personal };
            }
            if (extractedData.summary) {
                newCvData.summary = extractedData.summary;
            }
            
            const addId = (item: any, prefix: string) => ({ ...item, id: `${prefix}_${Date.now()}_${Math.random()}` });

            if (extractedData.experience?.length) {
                newCvData.experience = extractedData.experience.map(exp => addId(exp, 'exp'));
            }
            if (extractedData.education?.length) {
                newCvData.education = extractedData.education.map(edu => addId(edu, 'edu'));
            }
            if (extractedData.skills?.length) {
                newCvData.skills = extractedData.skills.map(skill => addId(skill, 'skill'));
            }
            if (extractedData.complementaryTraining?.length) {
                newCvData.complementaryTraining = extractedData.complementaryTraining.map(ct => addId(ct, 'comp'));
            }
            
            return newCvData;
        });

        alert("¡Tu CV ha sido analizado y los datos han sido rellenados!");
        toggleImportModal();
        setFormVisible(true);

    } catch (e) {
        console.error("Error extracting CV data:", e);
        const errorMessage = e instanceof Error ? e.message : "No se pudo procesar el CV. Inténtalo de nuevo.";
        alert(`Error: ${errorMessage}`);
    } finally {
        setLoadingMessage(null);
    }
  };

  const handleGenerateCoverLetter = useCallback(async (promptData: CoverLetterPromptData) => {
    setIsCoverLetterPromptModalOpen(false);
    setLoadingMessage("Generando carta de presentación con IA...");
    try {
      const letter = await generateCoverLetter(cvData, promptData);
      setCoverLetterContent(letter);
      setIsCoverLetterModalOpen(true);
    } catch (e) {
      console.error("Error generating cover letter:", e);
      const errorMessage = e instanceof Error ? e.message : "No se pudo generar la carta de presentación.";
      alert(`Error: ${errorMessage}`);
    } finally {
      setLoadingMessage(null);
    }
  }, [cvData]);

  const toggleCoverLetterPromptModal = () => setIsCoverLetterPromptModalOpen(prev => !prev);

  const isLoading = !!loadingMessage;

  return (
    <div className="min-h-screen flex flex-col font-sans">
      {isLoading && <LoadingOverlay message={loadingMessage!} />}
      <main className={`flex-grow flex flex-col ${formVisible ? 'container mx-auto p-4 md:p-8' : ''}`}>
        
        {formVisible ? (
          <>
            <header className="mb-8">
              <h1 className="text-5xl font-extrabold text-[#F54927]">Currículum Fácil</h1>
              <p className="text-xl text-white mt-2">Diseña un CV elegante y profesional en minutos</p>
            </header>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
              <div className="lg:col-span-1">
                <CVForm
                  data={cvData}
                  handlers={{
                    handlePersonalChange,
                    handleCountryCodeChange,
                    handleSummaryChange,
                    handleHasDrivingLicenseChange,
                    handleDrivingLicenseChange,
                    updateListItem,
                    addListItem,
                    removeListItem,
                    handleGenerateSummary,
                    handleImproveDescription,
                  }}
                  isLoading={isLoading}
                  summaryError={summaryError}
                />
              </div>
              <div className="lg:col-span-1">
                <div className="lg:sticky top-8 self-start">
                  <RecommendationBox />
                  <TemplateSelector selected={template} onSelect={(t: Template) => setTemplate(t)} />
                  <ColorSelector 
                    selectedColor={cvData.accentColor} 
                    onColorChange={(color) => handleDataChange('accentColor', color)}
                  />
                  {template === 'classic' && (
                    <FontSizeSelector
                      fontSizes={cvData.fontSizes}
                      onChange={handleFontSizeChange}
                    />
                  )}
                  <h2 className="text-2xl font-bold text-gray-800 my-4 text-center">Vista Previa</h2>
                  
                  <div ref={previewContainerRef} className="bg-[#e3e4e5] rounded-lg shadow-md p-5">
                    <div className="overflow-hidden">
                      {template === 'classic' && <ClassicTemplate key={JSON.stringify(cvData)} ref={previewRef} data={cvData} />}
                      {template === 'modern' && <ModernTemplate key={JSON.stringify(cvData)} ref={previewRef} data={cvData} />}
                      {template === 'creative' && <CreativeTemplate key={JSON.stringify(cvData)} ref={previewRef} data={cvData} />}
                    </div>
                  </div>
                  
                  <ActionBar
                    isLoading={isLoading}
                    handlers={{
                      toggleImportModal,
                      handleGenerateCoverLetter: toggleCoverLetterPromptModal,
                      handleDownloadPdf,
                    }}
                  />
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <header className="p-4 md:p-8 animate-fadeIn" style={{ animationDelay: '0.1s' }}>
              <h1 className="text-5xl font-extrabold text-[#F54927]">Currículum Fácil</h1>
              <p className="text-xl text-white mt-2">Diseña un CV elegante y profesional en minutos</p>
            </header>
            
            <div className="flex-grow flex flex-col justify-center items-center text-center p-4">
                <div className="mb-12 animate-fadeIn max-w-4xl" style={{ animationDelay: '0.2s' }}>
                  <h2 className="text-5xl font-bold text-white leading-tight">
                    Impulsa tu carrera con un CV profesional.
                  </h2>
                  <p className="text-xl text-gray-200 mt-6">
                    Crea tu currículum en minutos con la ayuda de nuestra IA. Resalta tus logros, sorprende a los reclutadores y consigue <span className="text-yellow-400 font-bold">la oportunidad que mereces</span>.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl mb-16 animate-fadeIn" style={{ animationDelay: '0.3s' }}>
                  <button
                    onClick={toggleImportModal}
                    className="group bg-[#e3e4e5] p-8 rounded-lg shadow-lg hover:shadow-2xl text-center transform hover:-translate-y-2 transition-all duration-300 flex flex-col items-center"
                  >
                    <div className="bg-[#F54927] p-4 rounded-full text-white mb-4 group-hover:bg-[#D43C1E] transition-colors">
                      <UploadIcon />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">Importar CV con IA</h3>
                    <p className="text-gray-600 flex-grow">
                      Ahorra tiempo. Pega el texto de tu CV y deja que nuestra IA rellene los campos por ti.
                    </p>
                  </button>
                  
                  <button
                    onClick={() => setFormVisible(true)}
                    className="group bg-[#e3e4e5] p-8 rounded-lg shadow-lg hover:shadow-2xl text-center transform hover:-translate-y-2 transition-all duration-300 flex flex-col items-center"
                  >
                    <div className="bg-[#F54927] p-4 rounded-full text-white mb-4 group-hover:bg-[#D43C1E] transition-colors">
                      <PencilIcon />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">Ingresar Manualmente</h3>
                    <p className="text-gray-600 flex-grow">
                      Control total. Completa cada sección de tu currículum paso a paso para un resultado a tu medida.
                    </p>
                  </button>
                </div>

                <div className="w-full max-w-6xl animate-fadeIn" style={{ animationDelay: '0.5s' }}>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-white text-center">
                    <div className="flex flex-col items-center gap-4">
                        <div className="flex-shrink-0 text-[#F54927]">
                            <SparklesIcon className="h-10 w-10"/>
                        </div>
                        <div>
                            <h4 className="text-xl font-bold">Asistencia IA</h4>
                            <p className="text-gray-200 mt-1">
                                Genera perfiles y descripciones de experiencia optimizados con nuestra inteligencia artificial integrada.
                            </p>
                        </div>
                    </div>
                    <div className="flex flex-col items-center gap-4">
                        <div className="flex-shrink-0 text-[#F54927]">
                            <TemplateIcon className="h-10 w-10" />
                        </div>
                        <div>
                            <h4 className="text-xl font-bold">Plantillas Profesionales</h4>
                            <p className="text-gray-200 mt-1">
                                Elige entre diseños modernos, creativos o el clásico formato Harvard (ATS-friendly) para impresionar.
                            </p>
                        </div>
                    </div>
                    <div className="flex flex-col items-center gap-4">
                        <div className="flex-shrink-0 text-[#F54927]">
                            <DownloadIcon className="h-10 w-10" />
                        </div>
                        <div>
                            <h4 className="text-xl font-bold">Descarga Fácil en PDF</h4>
                            <p className="text-gray-200 mt-1">
                                Exporta tu CV en formato PDF de alta calidad, listo para ser enviado con un solo clic.
                            </p>
                        </div>
                    </div>
                  </div>
                </div>
            </div>
          </>
        )}
      </main>
      
      <Footer />

      <ImportCVModal
        isOpen={isImportModalOpen}
        onClose={toggleImportModal}
        onExtract={handleExtractData}
        isLoading={isLoading}
      />
      <CoverLetterPromptModal
        isOpen={isCoverLetterPromptModalOpen}
        onClose={toggleCoverLetterPromptModal}
        onSubmit={handleGenerateCoverLetter}
        isLoading={isLoading}
      />
      <CoverLetterModal
        isOpen={isCoverLetterModalOpen}
        onClose={() => setIsCoverLetterModalOpen(false)}
        content={coverLetterContent}
        cvData={cvData}
      />
    </div>
  );
}

export default App;