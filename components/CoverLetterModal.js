

import React from 'react';
import type { CVData } from '../types.js';
import { CloseIcon } from './icons/CloseIcon.js';
import { CopyIcon } from './icons/CopyIcon.js';
import { DownloadIcon } from './icons/DownloadIcon.js';

declare const jspdf: any;

interface CoverLetterModalProps {
  isOpen: boolean;
  onClose: () => void;
  content: string;
  cvData: CVData;
}

export const CoverLetterModal: React.FC<CoverLetterModalProps> = ({ isOpen, onClose, content, cvData }) => {
  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(content.replace(/\*\*/g, ''))
      .then(() => alert('¡Carta copiada al portapapeles!'))
      .catch(err => console.error('Error al copiar: ', err));
  };

  const handleDownloadPdf = () => {
    const { jsPDF } = jspdf;
    const doc = new jsPDF({
      orientation: 'p',
      unit: 'pt',
      format: 'letter'
    });

    const FONT_FAMILY = 'helvetica'; // Calibri no es una fuente PDF estándar, Helvetica es una alternativa profesional.
    const FONT_SIZE_BODY = 12;
    const FONT_SIZE_NAME = 14;
    const LINE_SPACING = 1.5; // Actualizado desde 1.15 a 1.5
    const LINE_HEIGHT_BODY = FONT_SIZE_BODY * LINE_SPACING;
    const LINE_HEIGHT_NAME = FONT_SIZE_NAME * LINE_SPACING;

    const MARGIN_TOP = 2 * 28.35; // 2 cm
    const MARGIN_BOTTOM = 2 * 28.35;
    const MARGIN_SIDE = 2.5 * 28.35;

    const pageHeight = doc.internal.pageSize.getHeight();
    const pageWidth = doc.internal.pageSize.getWidth();
    const maxWidth = pageWidth - MARGIN_SIDE * 2;
    
    // Se añade el tamaño de la fuente al margen para asegurar 2cm de espacio en blanco real,
    // ya que la coordenada 'y' de jsPDF se refiere a la línea base del texto.
    let y = MARGIN_TOP + FONT_SIZE_NAME;

    const renderWrappedMixedStyleLine = (line: string, yPos: number): number => {
        const words: { text: string; bold: boolean }[] = [];
        const parts = line.split(/(\*\*.*?\*\*)/g).filter(p => p);
        
        parts.forEach(part => {
            const isBold = part.startsWith('**') && part.endsWith('**');
            const text = isBold ? part.slice(2, -2) : part;
            const splitWords = text.split(' ').filter(w => w);
            splitWords.forEach(word => words.push({ text: word, bold: isBold }));
        });

        let currentLineWords: { text: string; bold: boolean }[] = [];
        let currentLineWidth = 0;
        const spaceWidth = doc.getTextWidth(' ');
        let newY = yPos;

        const renderLine = (wordsToRender: { text: string; bold: boolean }[], yCoord: number) => {
            let currentX = MARGIN_SIDE;
            wordsToRender.forEach(word => {
                doc.setFont(FONT_FAMILY, word.bold ? 'bold' : 'normal');
                doc.text(word.text, currentX, yCoord);
                currentX += doc.getTextWidth(word.text) + spaceWidth;
            });
        };

        for (const word of words) {
            doc.setFont(FONT_FAMILY, word.bold ? 'bold' : 'normal');
            const wordWidth = doc.getTextWidth(word.text);

            if (currentLineWidth > 0 && currentLineWidth + spaceWidth + wordWidth > maxWidth) {
                renderLine(currentLineWords, newY);
                newY += LINE_HEIGHT_BODY;
                currentLineWords = [word];
                currentLineWidth = wordWidth;
            } else {
                currentLineWords.push(word);
                currentLineWidth += (currentLineWords.length > 1 ? spaceWidth : 0) + wordWidth;
            }
        }

        if (currentLineWords.length > 0) {
            renderLine(currentLineWords, newY);
            newY += LINE_HEIGHT_BODY;
        }

        return newY;
    };
    
    const lines = content.split('\n');

    lines.forEach((line, index) => {
      if (y > pageHeight - MARGIN_BOTTOM) {
        doc.addPage();
        y = MARGIN_TOP;
      }
      
      const cleanedLine = line.replace(/\*\*/g, '').trim();
      const isHeaderName = index === 0 && cleanedLine.toUpperCase() === cvData.personal.name.trim().toUpperCase();
      const isSignatureName = index === lines.length - 1 && cleanedLine.toUpperCase() === cvData.personal.name.trim().toUpperCase();
      const isStrengthsTitle = line.trim().toLowerCase() === 'fortalezas destacadas:';

      if (line.trim() === '') {
        y += LINE_HEIGHT_BODY / 2;
        return;
      }

      doc.setFont(FONT_FAMILY, 'normal');
      doc.setFontSize(FONT_SIZE_BODY);

      if (isHeaderName || isSignatureName) {
        doc.setFont(FONT_FAMILY, 'bold');
        doc.setFontSize(FONT_SIZE_NAME);
        doc.text(cleanedLine.toUpperCase(), MARGIN_SIDE, y);
        y += LINE_HEIGHT_NAME;
      } else if (isStrengthsTitle) {
        doc.setFont(FONT_FAMILY, 'bold');
        doc.text(line.trim(), MARGIN_SIDE, y);
        y += LINE_HEIGHT_BODY;
      }
      else if (line.includes('**')) {
        y = renderWrappedMixedStyleLine(line, y);
      } else {
        const textLines = doc.splitTextToSize(line, maxWidth);
        const isParagraph = textLines.length > 1 || line.length > 65;
        
        if (isParagraph) {
          doc.text(textLines, MARGIN_SIDE, y, { align: 'justify', maxWidth: maxWidth });
        } else {
          doc.text(textLines, MARGIN_SIDE, y);
        }
        y += textLines.length * LINE_HEIGHT_BODY;
      }
    });

    const fileName = `Carta_Presentacion_${cvData.personal.name.replace(/ /g, '_') || 'CV'}.pdf`;
    doc.save(fileName);
  };
  
  const renderContent = () => {
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .split('\n').map((line, index) => {
        if (line.trim().startsWith('-')) {
          return <li key={index} className="ml-4" dangerouslySetInnerHTML={{ __html: line.replace(/^- /, '') }} />;
        }
        if (line.trim() === '') {
          return <br key={index} />;
        }
        return <p key={index} dangerouslySetInnerHTML={{ __html: line }} />;
      });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="cover-letter-title">
      <div className="bg-[#e3e4e5] rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        <header className="flex justify-between items-center p-4 border-b">
          <h2 id="cover-letter-title" className="text-xl font-bold text-gray-800">Carta de Presentación Generada</h2>
          <button onClick={onClose} className="p-2 rounded-full text-gray-500 hover:bg-gray-100" aria-label="Cerrar modal">
            <CloseIcon />
          </button>
        </header>

        <main className="p-6 bg-white overflow-y-auto flex-grow font-serif" style={{ lineHeight: '1.5', textAlign: 'justify' }}>
          <div className="prose max-w-none text-black">
            {renderContent()}
          </div>
        </main>

        <footer className="p-4 border-t bg-gray-50 flex justify-end items-center gap-4">
          <button onClick={handleCopy} className="flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-gray-900 px-4 py-2 rounded-md">
            <CopyIcon />
            Copiar Texto
          </button>
          <button onClick={handleDownloadPdf} className="flex items-center gap-2 bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors shadow-sm">
            <DownloadIcon />
            Descargar PDF
          </button>
        </footer>
      </div>
    </div>
  );
};
