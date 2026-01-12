import React, { useState, useCallback } from 'react';
import { Menu, X, Terminal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavbarScroll, useScrollManagerContext } from '../hooks/scroll';
import LocaleSwitcher from './LocaleSwitcher';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isScrolled: scrolled } = useNavbarScroll();
  const { scrollToElement } = useScrollManagerContext();

  const navLinks = [
    { name: 'Profile', href: '#profile', sectionId: 'profile' },
    { name: 'Experience', href: '#experience', sectionId: 'experience' },
    { name: 'Skills', href: '#skills', sectionId: 'skills' },
    { name: 'Awards', href: '#awards', sectionId: 'awards' },
    { name: 'Contact', href: '#contact', sectionId: 'contact' },
  ];

  const handleNavClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    e.preventDefault();
    scrollToElement(sectionId);
    setIsOpen(false);
  }, [scrollToElement]);

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-dark/90 backdrop-blur-md shadow-lg py-4' : 'bg-transparent py-6'}`}
    >
      <div className="container mx-auto px-6 md:px-12 flex justify-between items-center">
        <a href="#" className="flex items-center gap-2 text-2xl font-bold tracking-tighter text-white">
          <Terminal className="text-primary w-8 h-8" />
          <span>BT<span className="text-primary">.</span></span>
        </a>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link, index) => (
            <motion.a
              key={link.name}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.sectionId)}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 + (index * 0.1) }}
              className="text-base font-medium text-slate-300 hover:text-primary transition-colors uppercase tracking-widest"
            >
              {link.name}
            </motion.a>
          ))}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 + (navLinks.length * 0.1) }}
          >
            <LocaleSwitcher />
          </motion.div>
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden text-white" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={32} /> : <Menu size={32} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden absolute top-full left-0 w-full bg-card/95 backdrop-blur-xl border-t border-slate-700 overflow-hidden"
          >
            <div className="flex flex-col p-8 gap-6">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-slate-200 text-xl font-medium hover:text-primary"
                  onClick={(e) => handleNavClick(e, link.sectionId)}
                >
                  {link.name}
                </a>
              ))}
              <div className="pt-4 border-t border-slate-700">
                <LocaleSwitcher />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;