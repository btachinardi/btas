import React from 'react';
import { useLocation } from 'react-router-dom';
import { ScrollManagerProvider } from './hooks/scroll';
import { LocaleProvider } from './contexts/locale.context';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Experience from './components/Experience';
import Skills from './components/Skills';
import Education from './components/Education';
import Languages from './components/Languages';
import Awards from './components/Awards';
import Contact from './components/Contact';
import DocumentModal from './components/DocumentModal';

const App: React.FC = () => {
  const location = useLocation();
  const isCVOpen = location.pathname === '/cv';

  return (
    <LocaleProvider defaultLocale="en" defaultDocumentType="portfolio">
    <ScrollManagerProvider>
      {/* Main Page - Always rendered */}
      <div className="bg-dark min-h-screen text-slate-200 selection:bg-primary selection:text-white font-sans text-lg">
        <Navbar />
        <main>
          <Hero />
          <Experience />
          <Skills />
          <Awards />
          <Education />
          <Languages />
          <Contact />
        </main>
      </div>

      {/* Document Modal - Rendered on top based on route */}
      <DocumentModal type="cv" isOpen={isCVOpen} />
    </ScrollManagerProvider>
    </LocaleProvider>
  );
};

export default App;