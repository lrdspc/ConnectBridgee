import { useState, useEffect, useRef } from 'react';

interface Position {
  lat: number;
  lng: number;
}

interface GeolocationState {
  position: Position | null;
  error: string | null;
  loading: boolean;
}

interface GeolocationOptions {
  enableHighAccuracy?: boolean;
  timeout?: number;
  maximumAge?: number;
  watchPosition?: boolean;
  throttleInterval?: number; // Intervalo de limitação em ms (novo)
}

const defaultOptions: GeolocationOptions = {
  enableHighAccuracy: true,
  timeout: 10000,
  maximumAge: 5000,
  watchPosition: false,
  throttleInterval: 3000 // 3 segundos de intervalo para evitar piscadas (novo)
};

/**
 * Hook personalizado para obter e monitorar a localização do usuário
 * Com suporte a throttling para evitar piscadas do indicador GPS
 */
const useGeolocation = (options: GeolocationOptions = {}) => {
  const mergedOptions = { ...defaultOptions, ...options };
  const [state, setState] = useState<GeolocationState>({
    position: null,
    error: null,
    loading: true
  });
  
  // Referência para armazenar o ID do watchPosition
  const watchIdRef = useRef<number | null>(null);
  
  // Referência para a última atualização
  const lastUpdateRef = useRef<number>(0);
  
  // Referência para função de limpeza
  const cleanupRef = useRef<(() => void) | null>(null);
  
  // Armazenar a última posição válida
  const lastPositionRef = useRef<Position | null>(null);
  
  // Contador de tentativas de obtenção de localização
  const attemptsRef = useRef<number>(0);
  
  useEffect(() => {
    // Verificar se a API de geolocalização está disponível
    if (!navigator.geolocation) {
      setState({
        position: null,
        error: 'Geolocalização não é suportada pelo seu navegador',
        loading: false
      });
      return;
    }
    
    let isMounted = true;
    
    // Processador de posição com throttling
    const processPosition = (position: GeolocationPosition) => {
      const now = Date.now();
      const shouldUpdate = 
        // Primeira posição (sempre atualizar)
        !lastPositionRef.current || 
        // O intervalo de throttling passou
        now - lastUpdateRef.current >= mergedOptions.throttleInterval! || 
        // Mudança significativa na posição (mais de 10 metros)
        (lastPositionRef.current && 
          calculateDistance(
            lastPositionRef.current.lat, 
            lastPositionRef.current.lng, 
            position.coords.latitude, 
            position.coords.longitude
          ) > 0.01);
      
      if (shouldUpdate) {
        const newPosition = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        
        lastPositionRef.current = newPosition;
        lastUpdateRef.current = now;
        attemptsRef.current = 0;
        
        if (isMounted) {
          setState({
            position: newPosition,
            loading: false,
            error: null
          });
        }
      }
    };
    
    const handleSuccess = (position: GeolocationPosition) => {
      processPosition(position);
    };
    
    const handleError = (error: GeolocationPositionError) => {
      attemptsRef.current += 1;
      
      // Se já temos uma posição e estamos apenas tendo erros temporários, manter a última posição válida
      if (lastPositionRef.current && attemptsRef.current < 3) {
        return; // Ignorar erros temporários para evitar piscadas
      }
      
      if (isMounted) {
        setState({
          position: lastPositionRef.current, // Manter a última posição conhecida
          error: getGeolocationErrorMessage(error),
          loading: false
        });
      }
    };
    
    const cleanup = () => {
      isMounted = false;
      
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
    };
    
    const getGeolocationErrorMessage = (error: GeolocationPositionError): string => {
      switch (error.code) {
        case error.PERMISSION_DENIED:
          return 'Usuário negou a solicitação de Geolocalização';
        case error.POSITION_UNAVAILABLE:
          return 'Informações de localização indisponíveis';
        case error.TIMEOUT:
          return 'A solicitação para obter a localização do usuário expirou';
        default:
          return 'Ocorreu um erro desconhecido ao obter a localização';
      }
    };
    
    // Configuração baseada no modo watch ou once
    if (mergedOptions.watchPosition) {
      // Obter posição inicial imediatamente
      navigator.geolocation.getCurrentPosition(handleSuccess, handleError, {
        enableHighAccuracy: mergedOptions.enableHighAccuracy,
        timeout: mergedOptions.timeout,
        maximumAge: 0 // Queremos a posição mais recente como inicial
      });
      
      // Continuar observando as mudanças com intervalo maior
      watchIdRef.current = navigator.geolocation.watchPosition(
        handleSuccess,
        handleError,
        {
          enableHighAccuracy: mergedOptions.enableHighAccuracy,
          timeout: mergedOptions.timeout,
          maximumAge: mergedOptions.maximumAge
        }
      );
    } else {
      // Modo único
      navigator.geolocation.getCurrentPosition(
        handleSuccess,
        handleError,
        {
          enableHighAccuracy: mergedOptions.enableHighAccuracy,
          timeout: mergedOptions.timeout,
          maximumAge: mergedOptions.maximumAge
        }
      );
    }
    
    cleanupRef.current = cleanup;
    return cleanup;
  }, [
    mergedOptions.enableHighAccuracy,
    mergedOptions.timeout,
    mergedOptions.maximumAge,
    mergedOptions.watchPosition,
    mergedOptions.throttleInterval
  ]);
  
  return state;
};

// Função auxiliar para calcular distância entre coordenadas em km
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Raio da Terra em km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function deg2rad(deg: number): number {
  return deg * (Math.PI / 180);
}

export default useGeolocation;