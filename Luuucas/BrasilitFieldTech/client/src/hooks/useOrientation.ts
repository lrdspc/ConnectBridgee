import { useState, useEffect } from 'react';

type Orientation = 'portrait' | 'landscape';

export function useOrientation() {
  // Inicializar com a orientação atual
  const [orientation, setOrientation] = useState<Orientation>(
    window.innerWidth > window.innerHeight ? 'landscape' : 'portrait'
  );
  
  // Estado de animação para transição suave
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    // Função para detectar mudanças de orientação
    const updateOrientation = () => {
      const isLandscape = window.innerWidth > window.innerHeight;
      const newOrientation = isLandscape ? 'landscape' : 'portrait';
      
      if (newOrientation !== orientation) {
        // Iniciar animação de transição
        setIsTransitioning(true);
        
        // Definir nova orientação após breve atraso para permitir animação
        setTimeout(() => {
          setOrientation(newOrientation);
          
          // Finalizar animação após a mudança
          setTimeout(() => {
            setIsTransitioning(false);
          }, 300); // Duração da animação de saída
        }, 50);
      }
    };

    // Registrar listener para evento de redimensionamento
    window.addEventListener('resize', updateOrientation);
    
    // Também detectar orientação por API específica para dispositivos móveis
    if (window.screen && window.screen.orientation) {
      window.screen.orientation.addEventListener('change', updateOrientation);
    }
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', updateOrientation);
      if (window.screen && window.screen.orientation) {
        window.screen.orientation.removeEventListener('change', updateOrientation);
      }
    };
  }, [orientation]);

  return {
    orientation,
    isLandscape: orientation === 'landscape',
    isPortrait: orientation === 'portrait',
    isTransitioning
  };
}