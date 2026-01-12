import React from 'react';
import { ArrowLeft, Printer, Download } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import MarkdownViewer from './MarkdownViewer';
import cvContent from '../../cv.md?raw';

const CVViewer: React.FC = () => {
  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // Create a blob with the markdown content
    const blob = new Blob([cvContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Bruno_Tachinardi_CV.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-dark min-h-screen text-slate-200">
      {/* Header - hidden during print */}
      <header className="print:hidden sticky top-0 z-50 bg-dark/95 backdrop-blur-md border-b border-slate-800">
        <div className="container mx-auto px-6 py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Link to="/">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 px-4 py-2 text-slate-300 hover:text-white transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                  Back
                </motion.button>
              </Link>
              <h1 className="text-xl font-semibold text-white">Curriculum Vitae</h1>
            </div>

            <div className="flex items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleDownload}
                className="flex items-center gap-2 px-4 py-2 border border-slate-600 rounded-lg text-slate-300 hover:text-white hover:border-slate-500 transition-colors"
              >
                <Download className="w-4 h-4" />
                Download MD
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handlePrint}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                <Printer className="w-4 h-4" />
                Print / Export PDF
              </motion.button>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto px-6 py-8 print:py-0 print:px-0">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto bg-card rounded-xl border border-slate-700 p-8 md:p-12 shadow-xl print:shadow-none print:border-0 print:p-0 print:bg-white print:text-black"
        >
          <MarkdownViewer content={cvContent} />
        </motion.div>
      </main>

      {/* Print styles */}
      <style>{`
        @media print {
          @page {
            margin: 0.5in;
            size: A4;
          }

          body {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
            background: white !important;
            color: black !important;
          }

          .print\\:hidden {
            display: none !important;
          }

          .prose-invert {
            --tw-prose-body: #1f2937 !important;
            --tw-prose-headings: #111827 !important;
            --tw-prose-links: #2563eb !important;
          }

          article {
            color: #1f2937 !important;
          }

          article h1, article h2, article h3 {
            color: #111827 !important;
          }

          article p, article li {
            color: #374151 !important;
          }

          article a {
            color: #2563eb !important;
          }

          article hr {
            border-color: #d1d5db !important;
          }
        }
      `}</style>
    </div>
  );
};

export default CVViewer;
