import React, { useEffect, useMemo } from 'react';
import { X, Download, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { PDFDownloadLink } from '@react-pdf/renderer';
import CVPreview from './CVPreview';
import CoverLetterPreview from './CoverLetterPreview';
import { CVDocument, CoverLetterDocument } from './pdf';
import { useLocale } from '../contexts/locale.context';

interface DocumentModalProps {
  type: 'cv' | 'cover-letter';
  isOpen: boolean;
}

const DocumentModal: React.FC<DocumentModalProps> = ({ type, isOpen }) => {
  const navigate = useNavigate();
  const { locale } = useLocale();

  const config = useMemo(() => ({
    cv: {
      title: 'Curriculum Vitae',
      preview: <CVPreview />,
      pdfDocument: <CVDocument locale={locale} />,
      filename: 'Bruno_Tachinardi_CV.pdf',
    },
    'cover-letter': {
      title: 'Cover Letter',
      preview: <CoverLetterPreview />,
      pdfDocument: <CoverLetterDocument locale={locale} />,
      filename: 'Bruno_Tachinardi_Cover_Letter.pdf',
    },
  }), [locale]);

  const { title, preview, pdfDocument, filename } = config[type];

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        navigate('/');
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [navigate]);

  const handleClose = () => {
    navigate('/');
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/80 backdrop-blur-sm"
          onClick={handleBackdropClick}
        >
          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="relative w-full max-w-4xl mx-4 my-8 bg-card rounded-xl border border-slate-700 shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 bg-dark/95 backdrop-blur-md border-b border-slate-700">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-semibold text-white">{title}</h2>
              </div>

              <div className="flex items-center gap-3">
                {/* PDF Download Button */}
                <PDFDownloadLink
                  document={pdfDocument}
                  fileName={filename}
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium"
                >
                  {({ loading }) => (
                    <>
                      <Download className="w-4 h-4" />
                      {loading ? 'Generating...' : 'Download PDF'}
                    </>
                  )}
                </PDFDownloadLink>

                {/* Close Button */}
                <button
                  onClick={handleClose}
                  className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 md:p-10 max-h-[calc(100vh-12rem)] overflow-y-auto">
              {preview}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DocumentModal;
