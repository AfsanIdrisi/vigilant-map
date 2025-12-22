/**
 * AI-powered insights (simulated)
 * Pure functions - framework agnostic
 */

import { hasAiApi } from './env';
import type { Incident, RiskLevel } from '../types';

interface SafetyAdvice {
  summary: string;
  tips: string[];
  urgency: 'low' | 'medium' | 'high';
}

/**
 * Generate safety advice based on nearby incidents
 * TODO: Connect to AI API when VITE_AI_API_KEY is set
 */
export function generateSafetyAdvice(
  incidents: Incident[],
  currentLocation: { lat: number; lng: number }
): SafetyAdvice {
  if (hasAiApi()) {
    // TODO: Call external AI API for personalized advice
    console.log('AI API available - would call external service');
  }
  
  // Rule-based fallback
  const recentIncidents = incidents.filter(inc => {
    const hoursSince = (Date.now() - new Date(inc.timestamp).getTime()) / (1000 * 60 * 60);
    return hoursSince < 6;
  });
  
  const highSeverity = recentIncidents.filter(inc => inc.severity >= 4);
  const hasAssaults = recentIncidents.some(inc => inc.type === 'assault');
  
  if (hasAssaults || highSeverity.length > 0) {
    return {
      summary: 'Elevated risk detected in your area. Multiple serious incidents reported recently.',
      tips: [
        'Stay in well-lit, populated areas',
        'Share your live location with a trusted contact',
        'Consider using a safer route or transportation',
        'Keep emergency contacts readily accessible',
      ],
      urgency: 'high',
    };
  }
  
  if (recentIncidents.length > 3) {
    return {
      summary: 'Moderate activity in your area. Stay aware of your surroundings.',
      tips: [
        'Be aware of people around you',
        'Avoid isolated areas',
        'Keep valuables concealed',
      ],
      urgency: 'medium',
    };
  }
  
  return {
    summary: 'Area appears relatively calm. Standard safety precautions apply.',
    tips: [
      'Stay on main roads when possible',
      'Trust your instincts',
      'Keep your phone charged',
    ],
    urgency: 'low',
  };
}

/**
 * Generate incident summary text
 */
export function generateIncidentSummary(incident: Incident): string {
  const timeAgo = getTimeAgo(incident.timestamp);
  const typeLabels: Record<string, string> = {
    assault: 'Physical assault',
    theft: 'Theft/robbery',
    harassment: 'Harassment',
    suspicious: 'Suspicious activity',
    vandalism: 'Vandalism',
    accident: 'Accident',
  };
  
  return `${typeLabels[incident.type] || incident.type} reported ${timeAgo}`;
}

/**
 * Get human-readable time ago string
 */
function getTimeAgo(timestamp: string): string {
  const seconds = Math.floor((Date.now() - new Date(timestamp).getTime()) / 1000);
  
  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

/**
 * Generate area safety description
 */
export function generateAreaDescription(riskLevel: RiskLevel, incidentCount: number): string {
  const descriptions: Record<RiskLevel, string> = {
    critical: `High-risk area with ${incidentCount} recent incidents. Extreme caution advised.`,
    high: `Elevated risk. ${incidentCount} incidents reported. Stay alert.`,
    medium: `Moderate activity. ${incidentCount} incidents in the area.`,
    low: `Relatively safe. ${incidentCount} minor incidents reported.`,
    safe: 'Area appears safe. Minimal incident activity.',
  };
  
  return descriptions[riskLevel];
}

/**
 * Get time-based safety tips
 */
export function getTimeBasedTips(): string[] {
  const hour = new Date().getHours();
  
  if (hour >= 22 || hour < 5) {
    return [
      'Late night travel - use well-lit main roads',
      'Consider rideshare over walking',
      'Share your trip with someone',
      'Have emergency numbers ready',
    ];
  }
  
  if (hour >= 17 && hour < 22) {
    return [
      'Evening hours - stay aware of surroundings',
      'Avoid shortcuts through unfamiliar areas',
      'Keep valuables secure',
    ];
  }
  
  return [
    'Daytime travel - standard precautions apply',
    'Stay aware of your surroundings',
  ];
}
