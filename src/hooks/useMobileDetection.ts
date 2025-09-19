import { useState, useEffect } from 'react';

export const BREAKPOINTS = {
  mobile: 768,
  tablet: 1024,
  desktop: 1200,
} as const;

interface MobileDetectionResult {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  columnWidth: number;
  screenWidth: number;
}

/**
 * Enhanced hook to detect device type and provide responsive column widths
 * for the mobile column-based UI implementation
 */
export const useMobileDetection = (): MobileDetectionResult => {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [columnWidth, setColumnWidth] = useState(240);
  const [screenWidth, setScreenWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);

  useEffect(() => {
    const updateLayout = () => {
      const width = window.innerWidth;
      setScreenWidth(width);
      
      const mobile = width <= BREAKPOINTS.mobile;
      const tablet = width > BREAKPOINTS.mobile && width <= BREAKPOINTS.tablet;
      const desktop = width > BREAKPOINTS.tablet;
      
      setIsMobile(mobile);
      setIsTablet(tablet);
      setIsDesktop(desktop);
      
      // Set responsive column width for mobile column-based UI
      if (mobile) {
        setColumnWidth(180);
      } else if (tablet) {
        setColumnWidth(200);
      } else {
        setColumnWidth(240);
      }
    };

    // Initial update
    updateLayout();
    
    // Listen for resize events with debounce for performance
    let resizeTimer: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(updateLayout, 100);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimer);
    };
  }, []);

  return {
    isMobile,
    isTablet,
    isDesktop,
    columnWidth,
    screenWidth,
  };
};

/**
 * Legacy hook for backward compatibility
 * @deprecated Use useMobileDetection() instead for full responsive information
 */
export const useIsMobile = (): boolean => {
  const { isMobile } = useMobileDetection();
  return isMobile;
};