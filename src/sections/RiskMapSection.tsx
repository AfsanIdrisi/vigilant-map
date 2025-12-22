// import { useMemo, useState } from 'react';
// import { Shield, MapPin, AlertTriangle } from 'lucide-react';

// import incidentsData from '../data/incidents.json';
// import { generateRiskZones, getRiskColor, getRiskLevel, getAreaRating, calculateLocationRisk } from '../logic/risk';
// import type { Incident, RiskZone } from '../types';

// const incidents: Incident[] = incidentsData as Incident[];

// const DEFAULT_CENTER = { lat: 40.7549, lng: -73.9840 };

// export default function RiskMapSection() {
//   const riskZones = useMemo(() => generateRiskZones(incidents), []);
//   const areaRisk = useMemo(() => calculateLocationRisk(DEFAULT_CENTER.lat, DEFAULT_CENTER.lng, incidents), []);

//   const areaRating = getAreaRating(areaRisk);
//   const riskLevel = getRiskLevel(areaRisk);

//   const getIncidentIcon = (type: string) => {
//     const icons: Record<string, string> = {
//       assault: '⚠️',
//       theft: '🔓',
//       harassment: '👁️',
//       suspicious: '❓',
//       vandalism: '🔨',
//       accident: '🚗',
//     };
//     return icons[type] || '📍';
//   };

//   // Create a visual grid representation of risk zones
//   const gridSize = 5;
//   const riskGrid = useMemo(() => {
//     const grid: { x: number; y: number; level: string }[] = [];
//     for (let x = 0; x < gridSize; x++) {
//       for (let y = 0; y < gridSize; y++) {
//         // Map grid position to lat/lng range
//         const lat = DEFAULT_CENTER.lat + (x - gridSize / 2) * 0.005;
//         const lng = DEFAULT_CENTER.lng + (y - gridSize / 2) * 0.005;
//         const risk = calculateLocationRisk(lat, lng, incidents);
//         grid.push({ x, y, level: getRiskLevel(risk) });
//       }
//     }
//     return grid;
//   }, []);

//   return (
//     <section className="space-y-4">
//       {/* Map Placeholder with Visual Risk Grid */}
//       <div className="relative h-[50vh] min-h-[350px] rounded-xl overflow-hidden border border-border bg-card">
//         {/* Visual Risk Grid */}
//         <div className="absolute inset-0 grid grid-cols-5 grid-rows-5 gap-0.5 p-2 opacity-60">
//           {riskGrid.map((cell, i) => (
//             <div
//               key={i}
//               className={`rounded-lg transition-all ${
//                 cell.level === 'critical' ? 'bg-risk-critical/40' :
//                 cell.level === 'high' ? 'bg-risk-high/30' :
//                 cell.level === 'medium' ? 'bg-risk-medium/25' :
//                 cell.level === 'low' ? 'bg-risk-low/20' :
//                 'bg-risk-safe/15'
//               }`}
//             />
//           ))}
//         </div>

//         {/* Map Background Pattern */}
//         <div 
//           className="absolute inset-0 opacity-10"
//           style={{
//             backgroundImage: `
//               linear-gradient(90deg, hsl(var(--border)) 1px, transparent 1px),
//               linear-gradient(hsl(var(--border)) 1px, transparent 1px)
//             `,
//             backgroundSize: '40px 40px',
//           }}
//         />

//         {/* Incident Markers Overlay */}
//         <div className="absolute inset-0 p-8">
//           {incidents.slice(0, 8).map((incident, i) => {
//             const offsetX = ((incident.lng + 74) * 500) % 80 + 10;
//             const offsetY = ((incident.lat - 40.7) * 800) % 70 + 10;
//             return (
//               <div
//                 key={incident.id}
//                 className="absolute animate-fade-in"
//                 style={{ 
//                   left: `${offsetX}%`, 
//                   top: `${offsetY}%`,
//                   animationDelay: `${i * 100}ms`
//                 }}
//               >
//                 <div className={`
//                   w-10 h-10 rounded-full flex items-center justify-center text-lg
//                   border-2 shadow-lg backdrop-blur-sm
//                   ${incident.severity >= 4 ? 'bg-risk-critical/30 border-risk-critical' :
//                     incident.severity >= 3 ? 'bg-risk-high/30 border-risk-high' :
//                     incident.severity >= 2 ? 'bg-risk-medium/30 border-risk-medium' :
//                     'bg-risk-low/30 border-risk-low'}
//                 `}>
//                   {getIncidentIcon(incident.type)}
//                 </div>
//               </div>
//             );
//           })}
//         </div>

//         {/* Center Location Marker */}
//         <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
//           <div className="relative">
//             <div className="w-6 h-6 rounded-full bg-primary shadow-glow-primary animate-pulse" />
//             <div className="absolute inset-0 w-6 h-6 rounded-full bg-primary/30 animate-ping" />
//           </div>
//         </div>

//         {/* Area Status Overlay */}
//         <div className="absolute top-4 left-4 right-4 z-10">
//           <div className="glass-panel p-4 max-w-sm animate-fade-in">
//             <div className="flex items-center justify-between mb-3">
//               <div className="flex items-center gap-2">
//                 <Shield className="w-5 h-5 text-primary" />
//                 <span className="font-semibold">Area Status</span>
//               </div>
//               <span className={`risk-badge risk-badge-${riskLevel}`}>
//                 {riskLevel}
//               </span>
//             </div>

//             <div className="flex items-center gap-1 mb-2">
//               {[1, 2, 3, 4, 5].map((star) => (
//                 <span
//                   key={star}
//                   className={`text-lg ${star <= areaRating ? 'text-risk-safe' : 'text-muted-foreground/30'}`}
//                 >
//                   ★
//                 </span>
//               ))}
//               <span className="ml-2 text-sm text-muted-foreground">
//                 Safety Rating
//               </span>
//             </div>

//             <p className="text-sm text-muted-foreground">
//               {incidents.length} incidents tracked • {riskZones.length} risk zones
//             </p>
//           </div>
//         </div>

//         {/* Legend */}
//         <div className="absolute bottom-4 left-4 z-10">
//           <div className="glass-panel p-3 animate-fade-in">
//             <div className="flex items-center gap-3 text-xs">
//               <div className="flex items-center gap-1.5">
//                 <div className="w-3 h-3 rounded-full bg-risk-safe" />
//                 <span>Safe</span>
//               </div>
//               <div className="flex items-center gap-1.5">
//                 <div className="w-3 h-3 rounded-full bg-risk-medium" />
//                 <span>Medium</span>
//               </div>
//               <div className="flex items-center gap-1.5">
//                 <div className="w-3 h-3 rounded-full bg-risk-critical" />
//                 <span>High Risk</span>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Coordinates Display */}
//         <div className="absolute bottom-4 right-4 z-10">
//           <div className="glass-panel px-3 py-2">
//             <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
//               <MapPin className="w-3 h-3" />
//               <span>{DEFAULT_CENTER.lat.toFixed(4)}, {DEFAULT_CENTER.lng.toFixed(4)}</span>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Quick Stats */}
//       <div className="grid grid-cols-3 gap-3">
//         <div className="glass-panel p-4 text-center">
//           <AlertTriangle className="w-6 h-6 mx-auto mb-2 text-risk-critical" />
//           <span className="text-2xl font-bold">{incidents.filter(i => i.severity >= 4).length}</span>
//           <p className="text-xs text-muted-foreground mt-1">High Severity</p>
//         </div>
//         <div className="glass-panel p-4 text-center">
//           <MapPin className="w-6 h-6 mx-auto mb-2 text-risk-medium" />
//           <span className="text-2xl font-bold">{riskZones.length}</span>
//           <p className="text-xs text-muted-foreground mt-1">Risk Zones</p>
//         </div>
//         <div className="glass-panel p-4 text-center">
//           <Shield className="w-6 h-6 mx-auto mb-2 text-risk-safe" />
//           <span className="text-2xl font-bold">{areaRating}/5</span>
//           <p className="text-xs text-muted-foreground mt-1">Area Score</p>
//         </div>
//       </div>
//     </section>
//   );
// }


import { useMemo } from "react";
import { Shield, MapPin, AlertTriangle } from "lucide-react";
import { MapContainer, TileLayer, Circle, Marker, Popup, CircleMarker } from "react-leaflet";
import L from "leaflet";

import "leaflet/dist/leaflet.css"; // 🔥 REQUIRED

import incidentsData from "../data/incidents.json";
import {
  generateRiskZones,
  getRiskLevel,
  getAreaRating,
  calculateLocationRisk,
} from "../logic/risk";
import type { Incident } from "../types";

/* ============================
   FIX LEAFLET ICONS
============================ */
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Distance in KM between two lat/lng points
export function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  console.log(lat1, lng1, lat2, lng2);
  const R = 6371; // Earth radius in KM

  const dLat = degToRad(lat2 - lat1);
  const dLng = degToRad(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(degToRad(lat1)) *
    Math.cos(degToRad(lat2)) *
    Math.sin(dLng / 2) *
    Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // distance in KM
}

function degToRad(deg: number): number {
  return deg * (Math.PI / 180);
}


/* ============================
   BANDRA CENTER
============================ */
const DEFAULT_CENTER = {
  lat: 19.0596,
  lng: 72.8295,
};

const INCIDENT_RADIUS_KM = 2.5; // 5 meters
const incidents: Incident[] = incidentsData as Incident[];

export default function RiskMapSection() {
  const riskZones = useMemo(
    () => generateRiskZones(incidents),
    []
  );

  const areaRisk = useMemo(
    () =>
      calculateLocationRisk(
        DEFAULT_CENTER.lat,
        DEFAULT_CENTER.lng,
        incidents
      ),
    []
  );

  const areaRating = getAreaRating(areaRisk);
  const riskLevel = getRiskLevel(areaRisk);

  return (
    <section className="space-y-4">
      {/* ============================
          MAP
      ============================ */}
      <div className="relative h-[50vh] min-h-[350px] rounded-xl overflow-hidden border">
        <MapContainer
          center={[DEFAULT_CENTER.lat, DEFAULT_CENTER.lng]}
          zoom={14}
          className="h-full w-full"
          scrollWheelZoom
        >
          <TileLayer
            attribution="© OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <CircleMarker
            center={[19.0596, 72.8295]}
            radius={10}
            pathOptions={{
              color: "blue",
              fillColor: "blue",
              fillOpacity: 1,
            }}
          >
            <Popup>Test pin</Popup>
          </CircleMarker>


          {/* RISK ZONES */}
          {riskZones.map((zone, index) => (
            <Circle
              key={index}
              center={[zone.lat, zone.lng]}
              radius={zone.radius}
              pathOptions={{
                color:
                  zone.level === "critical"
                    ? "#dc2626"
                    : zone.level === "high"
                      ? "#f97316"
                      : zone.level === "medium"
                        ? "#eab308"
                        : "#16a34a",
                fillOpacity: 0.3,
              }}
            />
          ))}

          {/* INCIDENT MARKERS */}
          const INCIDENT_RADIUS_KM = 0.005; // 5 meters
{console.log(incidents
            .filter((incident) =>
              calculateDistance(
                DEFAULT_CENTER.lat,
                DEFAULT_CENTER.lng,
                incident.lat,
                incident.lng
              ) <= INCIDENT_RADIUS_KM
            ))}
          {incidents
            .filter((incident) =>
              calculateDistance(
                DEFAULT_CENTER.lat,
                DEFAULT_CENTER.lng,
                incident.lat,
                incident.lng
              ) <= INCIDENT_RADIUS_KM
            )
            .map((incident) => (
              <Marker
                key={incident.id}
                position={[incident.lat, incident.lng]}
              >
                <Popup>
                  <div className="space-y-1">
                    <div className="font-semibold capitalize">
                      {incident.type}
                    </div>
                    <div>Severity: {incident.severity}</div>
                    <div className="text-xs text-muted-foreground">
                      {incident.description}
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}

        </MapContainer>
      </div>

      {/* ============================
          STATS
      ============================ */}
      <div className="grid grid-cols-3 gap-3">
        <div className="glass-panel p-4 text-center">
          <AlertTriangle className="w-6 h-6 mx-auto mb-2 text-risk-critical" />
          <div className="text-2xl font-bold">
            {incidents.filter((i) => i.severity >= 4).length}
          </div>
          <p className="text-xs text-muted-foreground">High Severity</p>
        </div>

        <div className="glass-panel p-4 text-center">
          <MapPin className="w-6 h-6 mx-auto mb-2 text-risk-medium" />
          <div className="text-2xl font-bold">{riskZones.length}</div>
          <p className="text-xs text-muted-foreground">Risk Zones</p>
        </div>

        <div className="glass-panel p-4 text-center">
          <Shield className="w-6 h-6 mx-auto mb-2 text-risk-safe" />
          <div className="text-2xl font-bold">{areaRating}/5</div>
          <p className="text-xs text-muted-foreground">Area Score</p>
        </div>
      </div>
    </section>
  );
}
