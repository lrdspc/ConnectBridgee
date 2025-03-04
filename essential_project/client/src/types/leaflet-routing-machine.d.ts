// Definição de tipos para leaflet-routing-machine
import * as L from 'leaflet';

declare module 'leaflet' {
  namespace Routing {
    function control(options?: RoutingControlOptions): RoutingControl;
    
    interface RoutingControlOptions {
      waypoints?: L.LatLng[];
      router?: any;
      plan?: any;
      showAlternatives?: boolean;
      altLineOptions?: any;
      fitSelectedRoutes?: boolean | string;
      lineOptions?: any;
      routeWhileDragging?: boolean;
      routeDragInterval?: number;
      addWaypoints?: boolean;
      draggableWaypoints?: boolean;
      reverseWaypoints?: boolean;
      useZoomParameter?: boolean;
      waypointMode?: string;
      createMarker?: Function;
      extendToWaypoints?: boolean;
      missingRouteTolerance?: number;
    }
    
    interface RoutingControl extends L.Control {
      getRouter(): any;
      setRouter(router: any): void;
      getWaypoints(): any[];
      setWaypoints(waypoints: L.LatLng[]): void;
      spliceWaypoints(index: number, waypointsToRemove: number, ...waypoints: L.LatLng[]): void;
      getPlan(): any;
      getRouter(): any;
      route(): void;
      on(type: string, fn: Function): this;
    }
  }
}