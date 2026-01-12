import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';

interface HoverCardProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  side?: 'top' | 'bottom';
  align?: 'start' | 'center' | 'end';
}

const HoverCard: React.FC<HoverCardProps> = ({
  trigger,
  children,
  side = 'top',
  align = 'center',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setIsOpen(true);
    }, 100);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 150);
  };

  useEffect(() => {
    if (isOpen && triggerRef.current && contentRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const contentRect = contentRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      let x = 0;
      let y = 0;

      // Calculate horizontal position
      if (align === 'center') {
        x = triggerRect.left + triggerRect.width / 2 - contentRect.width / 2;
      } else if (align === 'start') {
        x = triggerRect.left;
      } else {
        x = triggerRect.right - contentRect.width;
      }

      // Keep within viewport horizontally
      const padding = 8;
      if (x < padding) x = padding;
      if (x + contentRect.width > viewportWidth - padding) {
        x = viewportWidth - contentRect.width - padding;
      }

      // Calculate vertical position
      if (side === 'top') {
        y = triggerRect.top - contentRect.height - 8;
        // If not enough space on top, flip to bottom
        if (y < padding) {
          y = triggerRect.bottom + 8;
        }
      } else {
        y = triggerRect.bottom + 8;
        // If not enough space on bottom, flip to top
        if (y + contentRect.height > viewportHeight - padding) {
          y = triggerRect.top - contentRect.height - 8;
        }
      }

      setPosition({ x, y });
    }
  }, [isOpen, side, align]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <>
      <div
        ref={triggerRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="inline-block"
      >
        {trigger}
      </div>
      {createPortal(
        <AnimatePresence>
          {isOpen && (
            <motion.div
              ref={contentRef}
              initial={{ opacity: 0, scale: 0.95, y: side === 'top' ? 5 : -5 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: side === 'top' ? 5 : -5 }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
              style={{
                position: 'fixed',
                left: position.x,
                top: position.y,
                zIndex: 9999,
              }}
              className="pointer-events-auto"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              {children}
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
};

export default HoverCard;
