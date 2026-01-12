import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ChevronDown, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocale, useLocaleNames } from '../contexts/locale.context';
import type { Locale } from '../types/portfolio-data.types';

const LOCALE_STORAGE_KEY = 'portfolio-locale';

interface LocaleSwitcherProps {
  /** Whether to show the compact variant (icon only when collapsed) */
  compact?: boolean;
}

const LocaleSwitcher: React.FC<LocaleSwitcherProps> = ({ compact = false }) => {
  const { locale, setLocale, supportedLocales } = useLocale();
  const localeNames = useLocaleNames();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Locale codes to display (short form)
  const localeDisplayCodes: Record<Locale, string> = {
    en: 'EN',
    pt: 'PT',
    es: 'ES',
  };

  // Load saved locale from localStorage on mount
  useEffect(() => {
    const savedLocale = localStorage.getItem(LOCALE_STORAGE_KEY);
    if (savedLocale && supportedLocales.includes(savedLocale as Locale)) {
      setLocale(savedLocale as Locale);
    }
  }, [setLocale, supportedLocales]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close dropdown on escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  const handleLocaleChange = useCallback((newLocale: Locale) => {
    setLocale(newLocale);
    localStorage.setItem(LOCALE_STORAGE_KEY, newLocale);
    setIsOpen(false);
  }, [setLocale]);

  return (
    <div ref={dropdownRef} className="relative">
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-3 py-2 text-slate-300 hover:text-primary transition-colors rounded-lg hover:bg-slate-800/50"
        aria-label="Change language"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <Globe size={18} />
        <span className="text-sm font-medium uppercase tracking-wider">
          {localeDisplayCodes[locale]}
        </span>
        <ChevronDown
          size={14}
          className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="absolute top-full right-0 mt-2 py-1 bg-card/95 backdrop-blur-xl border border-slate-700 rounded-lg shadow-xl min-w-[140px] z-50"
            role="listbox"
            aria-label="Select language"
          >
            {supportedLocales.map((localeOption) => (
              <button
                key={localeOption}
                onClick={() => handleLocaleChange(localeOption)}
                className={`w-full px-4 py-2.5 text-left flex items-center gap-3 transition-colors ${
                  locale === localeOption
                    ? 'bg-primary/10 text-primary'
                    : 'text-slate-300 hover:bg-slate-800/50 hover:text-white'
                }`}
                role="option"
                aria-selected={locale === localeOption}
              >
                <span className="text-sm font-semibold uppercase w-6">
                  {localeDisplayCodes[localeOption]}
                </span>
                <span className="text-sm">
                  {localeNames[localeOption]}
                </span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LocaleSwitcher;
