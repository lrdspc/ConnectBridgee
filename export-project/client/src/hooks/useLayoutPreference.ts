import { useState, useEffect } from 'react';

// Tipo para preferência de layout
export type LayoutMode = 'auto' | 'mobile' | 'desktop';

// Chave para armazenar a preferência no localStorage
const STORAGE_KEY = 'brasilit_layout_preference';

export function useLayoutPreference() {
  // Inicializar com a preferência salva ou padrão 'auto'
  const [layoutPreference, setLayoutPreferenceState] = useState<LayoutMode>('auto');
  
  // Carregar preferência do localStorage na inicialização
  useEffect(() => {
    const savedPreference = localStorage.getItem(STORAGE_KEY);
    if (savedPreference && ['auto', 'mobile', 'desktop'].includes(savedPreference)) {
      setLayoutPreferenceState(savedPreference as LayoutMode);
    }
  }, []);
  
  // Função para atualizar e salvar a preferência
  const setLayoutPreference = (newPreference: LayoutMode) => {
    setLayoutPreferenceState(newPreference);
    localStorage.setItem(STORAGE_KEY, newPreference);
  };
  
  // Determinar o layout real com base na preferência e orientação
  const getEffectiveLayout = (): 'mobile' | 'desktop' => {
    // Se o usuário definiu uma preferência fixa, respeitar
    if (layoutPreference === 'mobile') return 'mobile';
    if (layoutPreference === 'desktop') return 'desktop';
    
    // No modo 'auto', usar orientação do dispositivo
    const isLandscape = window.innerWidth > window.innerHeight;
    return isLandscape ? 'desktop' : 'mobile';
  };
  
  return {
    // A preferência atual do usuário
    layoutPreference,
    
    // Função para atualizar a preferência
    setLayoutPreference,
    
    // Layout efetivo após considerar preferência e orientação
    effectiveLayout: getEffectiveLayout(),
    
    // Helpers convenientes
    isMobile: getEffectiveLayout() === 'mobile',
    isDesktop: getEffectiveLayout() === 'desktop',
    isAutoMode: layoutPreference === 'auto'
  };
}