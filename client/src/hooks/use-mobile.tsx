import { useState, useEffect } from 'react';

/**
 * Hook para detectar se o dispositivo é mobile baseado no tamanho da tela
 * @returns {boolean} true se a tela for menor que 768px (mobile)
 */
export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? window.innerWidth < 768 : false
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Adicionar listener para detectar mudanças no tamanho da tela
    window.addEventListener('resize', handleResize);
    
    // Executar imediatamente para configurar o valor inicial correto
    handleResize();
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return isMobile;
}

/**
 * Hook para obter o tipo de dispositivo com mais detalhes
 * @returns {string} 'mobile', 'tablet', 'desktop'
 */
export function useDeviceType() {
  const [deviceType, setDeviceType] = useState<'mobile' | 'tablet' | 'desktop'>(
    typeof window !== 'undefined' 
      ? window.innerWidth < 640 
        ? 'mobile' 
        : window.innerWidth < 1024 
          ? 'tablet' 
          : 'desktop'
      : 'desktop'
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setDeviceType('mobile');
      } else if (width < 1024) {
        setDeviceType('tablet');
      } else {
        setDeviceType('desktop');
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return deviceType;
}