/**
 * Serviço para geocodificação e otimização de rotas
 */

import { Visit } from './db';

// Interface para coordenadas
export interface Coordinate {
  lat: number;
  lng: number;
}

// Interface para visita com coordenadas
export interface VisitWithCoordinates extends Visit {
  coordinates: Coordinate;
}

// Cache de coordenadas para endereços comuns (para evitar chamadas de API desnecessárias)
// Focando em endereços de São Leopoldo e outros de teste
const coordinatesCache: Record<string, Coordinate> = {
  // São Leopoldo - RS
  // São Leopoldo - RS (endereços comuns)
  'Av. João Corrêa, 1250, São Leopoldo - RS': { lat: -29.7604, lng: -51.1480 },
  'Rua São Joaquim, 880, São Leopoldo - RS': { lat: -29.7688, lng: -51.1465 },
  'Av. Unisinos, 855, São Leopoldo - RS': { lat: -29.7923, lng: -51.1512 },
  'Av. Unisinos, 950, São Leopoldo - RS': { lat: -29.7945, lng: -51.1519 },
  
  // Variações de endereços em São Leopoldo para melhorar a busca
  'Centro, São Leopoldo - RS': { lat: -29.7604, lng: -51.1480 },
  'Rua Independência, São Leopoldo': { lat: -29.7558, lng: -51.1468 },
  'São Leopoldo, RS': { lat: -29.7604, lng: -51.1480 },
  'Avenida João Corrêa, São Leopoldo': { lat: -29.7604, lng: -51.1480 },
  'Praça XX de Setembro, São Leopoldo': { lat: -29.7576, lng: -51.1458 },
  'Rio dos Sinos, São Leopoldo': { lat: -29.7781, lng: -51.1326 },
  
  // Outras cidades (endereços fictícios) - para compatibilidade com dados existentes
  'Av. Paulista, 1000, São Paulo - SP': { lat: -23.5654, lng: -46.6510 },
  'Rua das Flores, 123, Campinas - SP': { lat: -22.9064, lng: -47.0616 },
  'Rodovia BR-101, Km 30, Rio de Janeiro - RJ': { lat: -22.9068, lng: -43.1729 },
  'Av. Brigadeiro Faria Lima, 4500, São Paulo - SP': { lat: -23.5841, lng: -46.6800 },
  
  // Valor padrão para São Leopoldo (centro)
  'DEFAULT_SAO_LEOPOLDO': { lat: -29.7604, lng: -51.1480 }
};

/**
 * Converte um endereço em coordenadas usando cache local ou API de Geocodificação
 */
export const geocodeAddress = async (address: string): Promise<Coordinate | null> => {
  // Verificar se temos coordenadas em cache para este endereço
  if (coordinatesCache[address]) {
    return coordinatesCache[address];
  }
  
  // Se o endereço menciona São Leopoldo, mas não temos as coordenadas exatas,
  // usamos coordenadas padrão para São Leopoldo para evitar chamadas à API
  if (address.includes('São Leopoldo')) {
    return coordinatesCache['DEFAULT_SAO_LEOPOLDO'];
  }
  
  // Para endereços não cacheados, tentamos buscar via API
  try {
    console.log(`Buscando coordenadas para: ${address}`);
    const encodedAddress = encodeURIComponent(address);
    const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodedAddress}&limit=1`);
    
    if (!response.ok) {
      throw new Error('Falha ao buscar coordenadas');
    }
    
    const data = await response.json();
    
    if (data && data.length > 0) {
      // Salvar no cache para futuras consultas
      const coordinates = {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon)
      };
      
      coordinatesCache[address] = coordinates;
      return coordinates;
    }
    
    return null;
  } catch (error) {
    console.error('Erro ao geocodificar endereço:', error);
    return null;
  }
};

/**
 * Obtém as coordenadas para várias visitas (otimizado com cache)
 */
export const getVisitsWithCoordinates = async (visits: Visit[]): Promise<VisitWithCoordinates[]> => {
  const visitsWithCoordinates: VisitWithCoordinates[] = [];
  
  for (const visit of visits) {
    try {
      // Buscar coordenadas (usando cache quando disponível)
      const coordinates = await geocodeAddress(visit.address);
      
      if (coordinates) {
        visitsWithCoordinates.push({
          ...visit,
          coordinates
        });
      } else {
        // Valor padrão para São Paulo se não encontrar coordenadas
        visitsWithCoordinates.push({
          ...visit,
          coordinates: { lat: -23.5505, lng: -46.6333 }
        });
      }
    } catch (error) {
      console.error(`Erro ao obter coordenadas para visita ${visit.id}:`, error);
    }
  }
  
  return visitsWithCoordinates;
};

/**
 * Reordena as visitas para criar uma rota otimizada (implementação simples)
 * Usa o algoritmo do vizinho mais próximo
 */
export const optimizeRoute = (
  visitsWithCoordinates: VisitWithCoordinates[],
  startPosition: Coordinate
): VisitWithCoordinates[] => {
  if (visitsWithCoordinates.length <= 1) return visitsWithCoordinates;
  
  // Clonar o array para não modificar o original
  const unvisited = [...visitsWithCoordinates];
  const optimizedRoute: VisitWithCoordinates[] = [];
  let currentPosition = startPosition;
  
  // Enquanto houver visitas não visitadas
  while (unvisited.length > 0) {
    // Encontrar o vizinho mais próximo
    let closestIndex = 0;
    let closestDistance = getDistance(currentPosition, unvisited[0].coordinates);
    
    for (let i = 1; i < unvisited.length; i++) {
      const distance = getDistance(currentPosition, unvisited[i].coordinates);
      
      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = i;
      }
    }
    
    // Adicionar o mais próximo à rota
    const nextVisit = unvisited.splice(closestIndex, 1)[0];
    optimizedRoute.push(nextVisit);
    
    // Atualizar a posição atual
    currentPosition = nextVisit.coordinates;
  }
  
  return optimizedRoute;
};

/**
 * Calcula a distância entre dois pontos (usando a fórmula de Haversine)
 */
export const getDistance = (point1: Coordinate, point2: Coordinate): number => {
  const R = 6371; // Raio da Terra em km
  const dLat = deg2rad(point2.lat - point1.lat);
  const dLon = deg2rad(point2.lng - point1.lng);
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(point1.lat)) * Math.cos(deg2rad(point2.lat)) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distância em km
  
  return distance;
};

/**
 * Converte graus para radianos
 */
const deg2rad = (deg: number): number => {
  return deg * (Math.PI / 180);
};

/**
 * Gera uma URL para navegação no Google Maps
 * @param destino Coordenadas de destino ou endereço
 * @param origem Coordenadas de origem (opcional)
 * @returns URL para o Google Maps
 */
export const gerarLinkGoogleMaps = (
  destino: Coordinate | string,
  origem?: Coordinate | string
): string => {
  let url = 'https://www.google.com/maps/dir/?api=1';
  
  // Adicionar destino
  if (typeof destino === 'string') {
    url += `&destination=${encodeURIComponent(destino)}`;
  } else {
    url += `&destination=${destino.lat},${destino.lng}`;
  }
  
  // Adicionar origem se especificada
  if (origem) {
    if (typeof origem === 'string') {
      url += `&origin=${encodeURIComponent(origem)}`;
    } else {
      url += `&origin=${origem.lat},${origem.lng}`;
    }
  }
  
  // Adicionar modo de transporte (carro)
  url += '&travelmode=driving';
  
  return url;
};

/**
 * Gera uma URL para navegação no Waze
 * @param destino Coordenadas de destino ou endereço
 * @returns URL para o Waze
 */
export const gerarLinkWaze = (destino: Coordinate | string): string => {
  let url = 'https://waze.com/ul?';
  
  // Adicionar destino
  if (typeof destino === 'string') {
    url += `q=${encodeURIComponent(destino)}`;
  } else {
    url += `ll=${destino.lat},${destino.lng}&navigate=yes`;
  }
  
  return url;
};

/**
 * Gera uma URL para navegação no Google Maps com múltiplas paradas
 * @param origem Coordenadas ou endereço de origem
 * @param destinos Array de coordenadas ou endereços de destino
 * @returns URL para o Google Maps com rota completa
 */
export const gerarRotaCompletaGoogleMaps = (
  origem: Coordinate | string,
  destinos: (Coordinate | string)[]
): string => {
  if (destinos.length === 0) {
    return '';
  }

  let url = 'https://www.google.com/maps/dir/?api=1';
  
  // Adicionar origem
  if (typeof origem === 'string') {
    url += `&origin=${encodeURIComponent(origem)}`;
  } else {
    url += `&origin=${origem.lat},${origem.lng}`;
  }
  
  // Último destino é considerado o destino final
  const destinoFinal = destinos[destinos.length - 1];
  if (typeof destinoFinal === 'string') {
    url += `&destination=${encodeURIComponent(destinoFinal)}`;
  } else {
    url += `&destination=${destinoFinal.lat},${destinoFinal.lng}`;
  }
  
  // Se tivermos destinos intermediários (waypoints)
  if (destinos.length > 1) {
    const waypoints = destinos.slice(0, destinos.length - 1);
    const waypointsStr = waypoints.map(wp => {
      if (typeof wp === 'string') {
        return encodeURIComponent(wp);
      } else {
        return `${wp.lat},${wp.lng}`;
      }
    }).join('|');
    
    url += `&waypoints=${waypointsStr}`;
  }
  
  // Adicionar modo de transporte (carro)
  url += '&travelmode=driving';
  
  return url;
};