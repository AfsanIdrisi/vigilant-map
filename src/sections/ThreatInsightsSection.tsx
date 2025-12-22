import { useState, useMemo } from 'react';
import { AlertTriangle, Clock, MapPin, ChevronRight, Lightbulb } from 'lucide-react';

import incidentsData from '../data/incidents.json';
import { sortByDistance, getRiskLevel, calculateIncidentRisk } from '../logic/risk';
import { generateSafetyAdvice, generateIncidentSummary, getTimeBasedTips } from '../logic/ai';
import type { Incident } from '../types';

const incidents: Incident[] = incidentsData as Incident[];

const DEFAULT_LOCATION = { lat: 40.7549, lng: -73.9840 };

export default function ThreatInsightsSection() {
  const [userLocation] = useState(DEFAULT_LOCATION);
  
  const nearbyIncidents = useMemo(() => {
    return sortByDistance(userLocation.lat, userLocation.lng, incidents).slice(0, 5);
  }, [userLocation]);
  
  const safetyAdvice = useMemo(() => {
    return generateSafetyAdvice(incidents, userLocation);
  }, [userLocation]);
  
  const timeTips = useMemo(() => getTimeBasedTips(), []);

  const getIncidentIcon = (type: string) => {
    const icons: Record<string, string> = {
      assault: '⚠️',
      theft: '🔓',
      harassment: '👁️',
      suspicious: '❓',
      vandalism: '🔨',
      accident: '🚗',
    };
    return icons[type] || '📍';
  };

  const urgencyColors: Record<string, string> = {
    high: 'border-risk-critical bg-risk-critical/10',
    medium: 'border-risk-medium bg-risk-medium/10',
    low: 'border-border bg-card',
  };

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <AlertTriangle className="w-5 h-5 text-risk-medium" />
        <h2 className="text-xl font-bold">Threat Insights</h2>
      </div>

      {/* AI Safety Advice */}
      <div className={`glass-panel p-4 border-l-4 ${urgencyColors[safetyAdvice.urgency]} animate-fade-in`}>
        <div className="flex items-start gap-3">
          <Lightbulb className={`w-5 h-5 mt-0.5 ${
            safetyAdvice.urgency === 'high' ? 'text-risk-critical' : 
            safetyAdvice.urgency === 'medium' ? 'text-risk-medium' : 'text-primary'
          }`} />
          <div className="flex-1">
            <h3 className="font-semibold mb-1">Safety Assessment</h3>
            <p className="text-sm text-muted-foreground mb-3">{safetyAdvice.summary}</p>
            <ul className="space-y-1.5">
              {safetyAdvice.tips.map((tip, index) => (
                <li key={index} className="flex items-center gap-2 text-sm">
                  <ChevronRight className="w-3 h-3 text-muted-foreground" />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Nearby Incidents */}
      <div className="glass-panel p-4 animate-slide-in-right">
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <MapPin className="w-4 h-4" />
          Nearby Incidents
        </h3>
        
        <div className="space-y-3">
          {nearbyIncidents.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center">
              No incidents reported nearby
            </p>
          ) : (
            nearbyIncidents.map((incident) => {
              const riskLevel = getRiskLevel(calculateIncidentRisk(incident));
              return (
                <div
                  key={incident.id}
                  className="flex items-start gap-3 p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
                >
                  <span className="text-xl">{getIncidentIcon(incident.type)}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium capitalize">{incident.type}</span>
                      <span className={`risk-badge risk-badge-${riskLevel} text-[10px] py-0.5`}>
                        {riskLevel}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">
                      {incident.description}
                    </p>
                    <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {(incident.distance * 1000).toFixed(0)}m away
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {generateIncidentSummary(incident).split(' ').slice(-2).join(' ')}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Time-Based Tips */}
      <div className="glass-panel p-4">
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <Clock className="w-4 h-4" />
          Time-Based Advisory
        </h3>
        <ul className="space-y-2">
          {timeTips.map((tip, index) => (
            <li key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              {tip}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
