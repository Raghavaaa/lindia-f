/**
 * LegalIndia.AI Design System Configuration
 * 
 * This file contains all design tokens and utilities for consistent UI
 */

export const designSystem = {
  // Colors
  colors: {
    background: '#FFFFFF',
    primaryText: '#0A0A0A',
    secondaryText: '#555555',
    accentBlue: '#2E7CF6',
    lightAccent: '#E8F1FF',
    border: '#C4C4C4',
    shadow: 'rgba(0, 0, 0, 0.05)',
  },

  // Typography
  typography: {
    fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif',
    baseSize: '16px',
    lineHeight: 1.6,
    headings: {
      h1: { size: '32px', weight: 600 },
      h2: { size: '24px', weight: 500 },
      h3: { size: '20px', weight: 500 },
    },
  },

  // Spacing
  spacing: {
    sectionVertical: '64px',
    sectionHorizontal: '32px',
    card: '32px',
    element: '20px',
  },

  // Layout
  layout: {
    maxWidth: '1440px',
    sidebarWidth: '280px',
    footerHeight: '60px',
  },

  // Border Radius
  borderRadius: {
    card: '1rem', // 16px / rounded-2xl
    button: '1rem',
    full: '9999px',
  },

  // Shadows
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -4px rgba(0, 0, 0, 0.05)',
  },

  // Motion
  motion: {
    duration: '0.3s',
    timing: 'ease-in-out',
  },

  // Breakpoints
  breakpoints: {
    mobile: '768px',
    tablet: '1024px',
    desktop: '1440px',
  },

  // Component Sizes
  components: {
    button: {
      height: '48px', // h-12
      padding: '0 24px',
    },
    upload: {
      width: '400px',
      height: '220px',
    },
    logo: {
      width: '120px',
      height: '40px',
    },
  },
} as const;

// Framer Motion Variants
export const motionVariants = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.3, ease: 'easeInOut' },
  },
  
  slideUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 },
    transition: { duration: 0.3, ease: 'easeInOut' },
  },
  
  slideDown: {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.3, ease: 'easeInOut' },
  },
  
  scaleIn: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
    transition: { duration: 0.3, ease: 'easeInOut' },
  },
  
  buttonHover: {
    whileHover: { 
      y: -2,
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -4px rgba(0, 0, 0, 0.05)',
    },
    transition: { duration: 0.3, ease: 'easeInOut' },
  },
};

// Tailwind Class Helpers
export const tw = {
  // Layout
  container: 'max-w-[1440px] mx-auto px-8',
  section: 'py-16',
  card: 'p-8 rounded-2xl bg-white shadow-md',
  
  // Typography
  h1: 'text-[32px] font-semibold leading-tight text-[#0A0A0A]',
  h2: 'text-2xl font-medium leading-snug text-[#0A0A0A]',
  h3: 'text-xl font-medium leading-normal text-[#0A0A0A]',
  body: 'text-base text-[#555555] leading-relaxed',
  
  // Buttons
  btnPrimary: 'h-12 px-6 bg-[#2E7CF6] text-white rounded-2xl text-sm font-medium shadow-sm hover:shadow-lg transition-all duration-300',
  btnSecondary: 'h-12 px-6 bg-white text-[#0A0A0A] border border-[#C4C4C4] rounded-2xl text-sm font-medium hover:border-[#2E7CF6] hover:shadow-lg transition-all duration-300',
  
  // Upload
  upload: 'w-[400px] h-[220px] border-2 border-dashed border-[#C4C4C4] rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-[#2E7CF6] transition-colors duration-300',
  
  // Footer
  footer: 'h-[60px] border-t border-gray-200 flex items-center',
  
  // Sidebar
  sidebar: 'w-[280px] lg:block hidden',
  sidebarMobile: 'w-full lg:hidden',
} as const;

export default designSystem;

