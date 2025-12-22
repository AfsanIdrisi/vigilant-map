/**
 * Route risk analysis logic
 * Pure functions - framework agnostic
 */

import type { Route, Incident, RouteAnalysis, RiskLevel } from '../types';
import { calculateDistance, getRiskLevel, calculateIncidentRisk } from './risk';

/**
 * Calculate risk score for a route based on nearby incidents
 */
export function calculateRouteRisk(
  route: Route,
  incidents: Incident[],
  bufferKm: number = 0.3
): number {
  let totalRisk = 0;
  let segments = 0;
  
  for (let i = 0; i < route.polyline.length - 1; i++) {
    const [lat1, lng1] = route.polyline[i];
    const [lat2, lng2] = route.polyline[i + 1];
    
    // Check midpoint of segment
    const midLat = (lat1 + lat2) / 2;
    const midLng = (lng1 + lng2) / 2;
    
    let segmentRisk = 0;
    for (const incident of incidents) {
      const distance = calculateDistance(midLat, midLng, incident.lat, incident.lng);
      if (distance <= bufferKm) {
        const incidentRisk = calculateIncidentRisk(incident);
        const distanceFactor = 1 - (distance / bufferKm);
        segmentRisk += incidentRisk * distanceFactor;
      }
    }
    
    totalRisk += Math.min(segmentRisk, 1);
    segments++;
  }
  
  return segments > 0 ? totalRisk / segments : 0;
}

/**
 * Count incidents near a route
 */
export function countNearbyIncidents(
  route: Route,
  incidents: Incident[],
  bufferKm: number = 0.5
): number {
  const nearbyIncidents = new Set<string>();
  
  for (const [lat, lng] of route.polyline) {
    for (const incident of incidents) {
      const distance = calculateDistance(lat, lng, incident.lat, incident.lng);
      if (distance <= bufferKm) {
        nearbyIncidents.add(incident.id);
      }
    }
  }
  
  return nearbyIncidents.size;
}

/**
 * Generate recommendation based on route risk
 */
function generateRecommendation(riskLevel: RiskLevel, estimatedTime: number): string {
  const recommendations: Record<RiskLevel, string> = {
    critical: 'Avoid this route. Multiple high-severity incidents reported.',
    high: 'Use caution. Consider alternative routes if possible.',
    medium: 'Stay alert and be aware of your surroundings.',
    low: 'Generally safe. Standard precautions recommended.',
    safe: 'Low risk route. Enjoy your journey safely.',
  };
  
  return recommendations[riskLevel];
}

/**
 * Analyze a single route
 */
export function analyzeRoute(route: Route, incidents: Incident[]): RouteAnalysis {
  const riskScore = calculateRouteRisk(route, incidents);
  const riskLevel = getRiskLevel(riskScore);
  const incidentsNearby = countNearbyIncidents(route, incidents);
  
  return {
    route,
    riskScore,
    riskLevel,
    incidentsNearby,
    recommendation: generateRecommendation(riskLevel, route.estimatedTime),
  };
}

/**
 * Compare multiple routes and rank by safety
 */
export function compareRoutes(routes: Route[], incidents: Incident[]): RouteAnalysis[] {
  return routes
    .map(route => analyzeRoute(route, incidents))
    .sort((a, b) => a.riskScore - b.riskScore);
}

/**
 * Get the safest route
 */
export function getSafestRoute(routes: Route[], incidents: Incident[]): RouteAnalysis | null {
  const analyzed = compareRoutes(routes, incidents);
  return analyzed.length > 0 ? analyzed[0] : null;
}

/**
 * Get the fastest route
 */
export function getFastestRoute(routes: Route[], incidents: Incident[]): RouteAnalysis | null {
  const analyzed = routes
    .map(route => analyzeRoute(route, incidents))
    .sort((a, b) => a.route.estimatedTime - b.route.estimatedTime);
  
  return analyzed.length > 0 ? analyzed[0] : null;
}

/**
 * Calculate balanced route (considering both time and safety)
 */
export function getBalancedRoute(routes: Route[], incidents: Incident[]): RouteAnalysis | null {
  const analyzed = routes.map(route => {
    const analysis = analyzeRoute(route, incidents);
    // Score combining time (normalized) and safety
    const maxTime = Math.max(...routes.map(r => r.estimatedTime));
    const timeScore = 1 - (route.estimatedTime / maxTime);
    const safetyScore = 1 - analysis.riskScore;
    const balancedScore = (timeScore * 0.4) + (safetyScore * 0.6);
    return { ...analysis, balancedScore };
  });
  
  analyzed.sort((a, b) => b.balancedScore - a.balancedScore);
  return analyzed.length > 0 ? analyzed[0] : null;
}
