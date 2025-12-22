import { useState, useMemo } from 'react';
import { Navigation, Clock, Shield, AlertTriangle, Route } from 'lucide-react';

import routesData from '../data/routes.json';
import incidentsData from '../data/incidents.json';
import { compareRoutes, getFastestRoute, getSafestRoute } from '../logic/routing';
import type { Route as RouteType, Incident, RouteAnalysis } from '../types';

const routes: RouteType[] = routesData as RouteType[];
const incidents: Incident[] = incidentsData as Incident[];

export default function RoutePlannerSection() {
  const [selectedRouteId, setSelectedRouteId] = useState<string | null>(null);
  const [comparisonMode, setComparisonMode] = useState<'safest' | 'fastest' | 'all'>('all');

  const analyzedRoutes = useMemo(() => compareRoutes(routes, incidents), []);
  const safestRoute = useMemo(() => getSafestRoute(routes, incidents), []);
  const fastestRoute = useMemo(() => getFastestRoute(routes, incidents), []);

  const displayedRoutes = useMemo(() => {
    if (comparisonMode === 'safest' && safestRoute) return [safestRoute];
    if (comparisonMode === 'fastest' && fastestRoute) return [fastestRoute];
    return analyzedRoutes;
  }, [comparisonMode, analyzedRoutes, safestRoute, fastestRoute]);

  const getRiskBadgeClass = (level: string) => {
    return `risk-badge risk-badge-${level}`;
  };

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Navigation className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-bold">Route Planner</h2>
        </div>
      </div>

      {/* Mode Selector */}
      <div className="flex gap-2 mb-4">
        {[
          { id: 'all', label: 'All Routes', icon: Route },
          { id: 'safest', label: 'Safest', icon: Shield },
          { id: 'fastest', label: 'Fastest', icon: Clock },
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setComparisonMode(id as typeof comparisonMode)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              comparisonMode === id
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary hover:bg-secondary/80 text-foreground'
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {/* Route Cards */}
      <div className="space-y-3">
        {displayedRoutes.map((analysis, index) => {
          const isSelected = selectedRouteId === analysis.route.id;
          const isSafest = safestRoute?.route.id === analysis.route.id;
          const isFastest = fastestRoute?.route.id === analysis.route.id;

          return (
            <button
              key={analysis.route.id}
              onClick={() => setSelectedRouteId(isSelected ? null : analysis.route.id)}
              className={`w-full text-left glass-panel p-4 transition-all hover:border-primary/50 ${
                isSelected ? 'border-primary ring-1 ring-primary/30' : ''
              } animate-fade-in`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold">{analysis.route.name}</h3>
                    {isSafest && (
                      <span className="px-2 py-0.5 bg-risk-safe/20 text-risk-safe text-xs rounded-full font-medium">
                        Recommended
                      </span>
                    )}
                    {isFastest && !isSafest && (
                      <span className="px-2 py-0.5 bg-primary/20 text-primary text-xs rounded-full font-medium">
                        Fastest
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {analysis.recommendation}
                  </p>
                </div>
                <span className={getRiskBadgeClass(analysis.riskLevel)}>
                  {analysis.riskLevel}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-2 rounded-lg bg-secondary/50">
                  <Clock className="w-4 h-4 mx-auto mb-1 text-muted-foreground" />
                  <span className="text-lg font-bold">{analysis.route.estimatedTime}</span>
                  <span className="text-xs text-muted-foreground block">min</span>
                </div>
                <div className="p-2 rounded-lg bg-secondary/50">
                  <Route className="w-4 h-4 mx-auto mb-1 text-muted-foreground" />
                  <span className="text-lg font-bold">{analysis.route.distance || '—'}</span>
                  <span className="text-xs text-muted-foreground block">km</span>
                </div>
                <div className="p-2 rounded-lg bg-secondary/50">
                  <AlertTriangle className="w-4 h-4 mx-auto mb-1 text-muted-foreground" />
                  <span className="text-lg font-bold">{analysis.incidentsNearby}</span>
                  <span className="text-xs text-muted-foreground block">risks</span>
                </div>
              </div>

              {isSelected && (
                <div className="mt-4 pt-4 border-t border-border">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Risk Score</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 rounded-full bg-secondary overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            analysis.riskLevel === 'safe' ? 'bg-risk-safe' :
                            analysis.riskLevel === 'low' ? 'bg-risk-low' :
                            analysis.riskLevel === 'medium' ? 'bg-risk-medium' :
                            analysis.riskLevel === 'high' ? 'bg-risk-high' :
                            'bg-risk-critical'
                          }`}
                          style={{ width: `${analysis.riskScore * 100}%` }}
                        />
                      </div>
                      <span className="font-mono text-xs">{(analysis.riskScore * 100).toFixed(0)}%</span>
                    </div>
                  </div>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* TODO: Draw selected route on map when routing API is connected */}
      {selectedRouteId && (
        <p className="text-xs text-muted-foreground text-center mt-4">
          Route visualization available when map routing is enabled
        </p>
      )}
    </section>
  );
}
