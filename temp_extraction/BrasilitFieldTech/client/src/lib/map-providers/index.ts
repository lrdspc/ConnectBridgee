/**
 * Módulo para gerenciar provedores de mapas
 * 
 * Este módulo permite que a aplicação utilize diferentes provedores de mapas
 * com suporte gratuito ou de baixo custo.
 */

// Definir tipos para provedores de mapas
export type MapProvider = 'openstreetmap' | 'cyclosm' | 'esri' | 'cartodb' | 'osm-hot' | 'jawg' | 'here-normal' | 'here-satellite';

// Interface para informações do provedor de mapa
export interface MapProviderInfo {
  name: string;
  attribution: string;
  url: string;
  maxZoom: number;
  id?: string;
}

// Informações de mapa para cada provedor
export const mapProviders: Record<MapProvider, MapProviderInfo> = {
  openstreetmap: {
    name: 'OpenStreetMap',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" style="z-index: 400; position: relative;">OpenStreetMap</a> contributors',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    maxZoom: 19
  },
  'osm-hot': {
    name: 'Humanitarian',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Tiles style by <a href="https://www.hotosm.org/">HOT</a>',
    url: 'https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png',
    maxZoom: 19
  },
  cyclosm: {
    name: 'CyclOSM',
    attribution: '<a href="https://github.com/cyclosm/cyclosm-cartocss-style/releases" title="CyclOSM - Open Bicycle render">CyclOSM</a> | Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    url: 'https://{s}.tile-cyclosm.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png',
    maxZoom: 20
  },
  esri: {
    name: 'ESRI World',
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    maxZoom: 19
  },
  cartodb: {
    name: 'CartoDB',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
    maxZoom: 19
  },
  jawg: {
    name: 'Jawg Maps',
    attribution: '<a href="https://www.jawg.io" target="_blank">&copy; Jawg</a> - <a href="https://www.openstreetmap.org" target="_blank">&copy; OpenStreetMap</a>',
    url: 'https://tile.jawg.io/jawg-streets/{z}/{x}/{y}{r}.png?access-token=community',
    maxZoom: 22
  },
  'here-normal': {
    name: 'HERE Normal',
    attribution: 'Map &copy; 1987-2023 <a href="https://developer.here.com">HERE</a>',
    url: 'https://maps.hereapi.com/v3/base/mc/{z}/{x}/{y}/png8?apiKey=8n1xw8e7Z_QcWkGbPh0YB0gCYDgLsq68DXqLN0JxIxQ&style=explore.day',
    maxZoom: 20
  },
  'here-satellite': {
    name: 'HERE Satellite',
    attribution: 'Map &copy; 1987-2023 <a href="https://developer.here.com">HERE</a>',
    url: 'https://maps.hereapi.com/v3/base/mc/{z}/{x}/{y}/png8?apiKey=8n1xw8e7Z_QcWkGbPh0YB0gCYDgLsq68DXqLN0JxIxQ&style=satellite.day',
    maxZoom: 20
  }
};

// Lista de provedores disponíveis para seleção
export const availableProviders: MapProvider[] = [
  'openstreetmap'
];

// Função para obter informações do provedor
export const getProviderInfo = (provider: MapProvider): MapProviderInfo => {
  return mapProviders[provider] || mapProviders.openstreetmap;
};

// Função para salvar o provedor preferido no localStorage
export const savePreferredProvider = (provider: MapProvider): void => {
  try {
    localStorage.setItem('preferred-map-provider', provider);
  } catch (error) {
    console.warn('Não foi possível salvar a preferência de mapa:', error);
  }
};

// Função para obter o provedor preferido do localStorage
export const getPreferredProvider = (): MapProvider => {
  try {
    const saved = localStorage.getItem('preferred-map-provider') as MapProvider;
    return saved && mapProviders[saved] ? saved : 'openstreetmap';
  } catch (error) {
    console.warn('Não foi possível recuperar a preferência de mapa:', error);
    return 'openstreetmap';
  }
};