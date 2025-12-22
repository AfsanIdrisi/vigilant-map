export interface Incident {
  id: string;
  lat: number;
  lng: number;
  type: 'assault' | 'theft' | 'harassment' | 'vandalism' | 'suspicious' | 'accident';
  severity: 1 | 2 | 3 | 4 | 5;
  timestamp: string;
  description?: string;
}

export interface Route {
  id: string;
  name: string;
  polyline: [number, number][];
  estimatedTime: number;
  distance?: number;
}

export interface SafePlace {
  id: string;
  name: string;
  lat: number;
  lng: number;
  category: 'police' | 'hospital' | 'fire_station' | 'shelter' | 'public_building';
  address?: string;
  phone?: string;
}

export interface Contact {
  id: string;
  name: string;
  phone: string;
  relationship?: string;
}

export interface RiskZone {
  lat: number;
  lng: number;
  radius: number;
  riskLevel: 'critical' | 'high' | 'medium' | 'low' | 'safe';
  score: number;
}

export interface RouteAnalysis {
  route: Route;
  riskScore: number;
  riskLevel: 'critical' | 'high' | 'medium' | 'low' | 'safe';
  incidentsNearby: number;
  recommendation: string;
}

export type RiskLevel = 'critical' | 'high' | 'medium' | 'low' | 'safe';
