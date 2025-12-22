/**
 * Risk calculation logic
 * Pure deterministic functions - framework agnostic
 */

// import { calculateDistance } from '@/sections/RiskMapSection';
import type { Incident, RiskLevel, RiskZone } from '../types';

const SEVERITY_WEIGHTS: Record<number, number> = {
  1: 0.2,
  2: 0.4,
  3: 0.6,
  4: 0.8,
  5: 1.0,
};

const TYPE_WEIGHTS: Record<string, number> = {
  assault: 1.0,
  theft: 0.7,
  harassment: 0.6,
  suspicious: 0.4,
  vandalism: 0.3,
  accident: 0.5,
};

const DECAY_HOURS = 24;

/**
 * Calculate time decay factor (0-1)
 * Newer incidents have higher weight
 */
export function calculateTimeDecay(timestamp: string): number {
  const incidentTime = new Date(timestamp).getTime();
  const now = Date.now();
  const hoursAgo = (now - incidentTime) / (1000 * 60 * 60);
  
  if (hoursAgo <= 0) return 1;
  if (hoursAgo >= DECAY_HOURS) return 0.1;
  
  return 1 - (hoursAgo / DECAY_HOURS) * 0.9;
}

/**
 * Calculate distance between two points (Haversine formula)
 * Returns distance in kilometers
 */
export function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(deg: number): number {
  return deg * (Math.PI / 180);
}

/**
 * Calculate risk score for a single incident
 */
export function calculateIncidentRisk(incident: Incident): number {
  const severityWeight = SEVERITY_WEIGHTS[incident.severity] || 0.5;
  const typeWeight = TYPE_WEIGHTS[incident.type] || 0.5;
  const timeDecay = calculateTimeDecay(incident.timestamp);
  
  return severityWeight * typeWeight * timeDecay;
}

/**
 * Calculate aggregate risk score for a location
 * Based on nearby incidents
 */
export function calculateLocationRisk(
  lat: number,
  lng: number,
  incidents: Incident[],
  radiusKm: number = 0.5
): number {
  let totalRisk = 0;
  
  for (const incident of incidents) {
    const distance = calculateDistance(lat, lng, incident.lat, incident.lng);
    
    if (distance <= radiusKm) {
      const incidentRisk = calculateIncidentRisk(incident);
      const distanceFactor = 1 - (distance / radiusKm);
      totalRisk += incidentRisk * distanceFactor;
    }
  }
  
  return Math.min(totalRisk, 1);
}

/**
 * Convert numeric risk score to risk level
 */
export function getRiskLevel(score: number): RiskLevel {
  if (score >= 0.08) return 'critical';
  if (score >= 0.06) return 'high';
  if (score >= 0.04) return 'medium';
  if (score >= 0.02) return 'low';
  return 'safe';
}

/**
 * Get color for risk level (for map visualization)
 */
export function getRiskColor(level: RiskLevel): string {
  const colors: Record<RiskLevel, string> = {
    critical: '#ef4444',
    high: '#f97316',
    medium: '#eab308',
    low: '#22c55e',
    safe: '#10b981',
  };
  return colors[level];
}

/**
 * Generate risk zones based on incidents
 */
export function generateRiskZones(incidents: Incident[]): RiskZone[] {
  const zones: RiskZone[] = [];
  const gridSize = 0.005; // ~500m grid cells
  const processed = new Set<string>();
  
  for (const incident of incidents) {
    const gridLat = Math.floor(incident.lat / gridSize) * gridSize;
    const gridLng = Math.floor(incident.lng / gridSize) * gridSize;
    const key = `${gridLat},${gridLng}`;
    
    if (!processed.has(key)) {
      processed.add(key);
      const score = calculateLocationRisk(gridLat + gridSize / 2, gridLng + gridSize / 2, incidents);
      
      if (score > 0.3) {
        zones.push({
          lat: gridLat + gridSize / 2,
          lng: gridLng + gridSize / 2,
          radius: 500,
          riskLevel: getRiskLevel(score),
          score,
        });
      }
    }
  }
  
  return zones;
}

export function sortByDistance(
  lat: number,
  lng: number,
  incidents: Incident[]
): (Incident & { distance: number })[] {
  return incidents
    .map(incident => ({
      ...incident,
      distance: calculateDistance(lat, lng, incident.lat, incident.lng),
    }))
    .sort((a, b) => a.distance - b.distance);
}

/**
 * Get time-based safety status
 */
export function getTimeBasedSafety(): { isNightTime: boolean; warning: string | null } {
  const hour = new Date().getHours();
  const isNightTime = hour >= 22 || hour < 4;
  
  return {
    isNightTime,
    warning: isNightTime ? 'Late night hours - Exercise extra caution' : null,
  };
}

/**
 * Calculate area safety rating (1-5 stars)
 */
export function getAreaRating(riskScore: number): number {
  if (riskScore >= 0.8) return 1;
  if (riskScore >= 0.6) return 2;
  if (riskScore >= 0.4) return 3;
  if (riskScore >= 0.2) return 4;
  return 5;
}


export function openInGoogleMaps(
  start: { lat: number; lng: number },
  end: { lat: number; lng: number }
) {
  const url = `https://www.google.com/maps/dir/?api=1&origin=${start.lat},${start.lng}&destination=${end.lat},${end.lng}&travelmode=driving`;
  window.open(url, '_blank');
}
