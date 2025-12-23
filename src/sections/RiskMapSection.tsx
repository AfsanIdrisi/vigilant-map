

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
const SEVERITY_COLORS: Record<number, string> = {
  1: '#22c55e', // green - low
  2: '#84cc16', // lime
  3: '#eab308', // yellow
  4: '#f97316', // orange
  5: '#ef4444', // red - critical
};

function getIncidentIcon(severity: number) {
  const color = SEVERITY_COLORS[severity] ?? '#6b7280';

  return L.divIcon({
    className: '',
    html: `
      <div style="
        width:14px;
        height:14px;
        background:${color};
        border-radius:50%;
        border:2px solid white;
        box-shadow:0 0 6px rgba(0,0,0,0.5);
      "></div>
    `,
    iconSize: [14, 14],
    iconAnchor: [7, 7],
  });
}


/* ============================
   BANDRA CENTER
============================ */
// const location? = {
//   lat: 19.0596,
//   lng: 72.8295,
// };

const INCIDENT_RADIUS_KM = 1.5; // 5 meters
const incidents: Incident[] = incidentsData as Incident[];

export default function RiskMapSection({location}) {
  const riskZones = useMemo(
    () => generateRiskZones(incidents),
    []
  );

  const areaRisk = useMemo(
    () =>
      calculateLocationRisk(
        location?.lat,
        location?.lng,
        incidents
      ),
    [location]
  );

  const areaRating = getAreaRating(areaRisk);
  const riskLevel = getRiskLevel(areaRisk);


  if(!location) return null
  return (
    <section className="space-y-4">
      <div className="relative h-[50vh] min-h-[350px] rounded-xl overflow-hidden border">

        <MapContainer
          center={[location?.lat, location.lng]}
          zoom={10}
          className="h-full "
          scrollWheelZoom
        >
          <TileLayer
            attribution="© OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <CircleMarker
            center={[location.lat,location.lng]}
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

     
          {/* {incidents
            .filter((incident) =>
              calculateDistance(
                location?.lat,
                location?.lng,
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
            ))} */}
            {incidents
  .filter((incident) =>
    calculateDistance(
      location.lat,
      location.lng,
      incident.lat,
      incident.lng
    ) <= INCIDENT_RADIUS_KM
  )
  .map((incident) => (
    <Marker
      key={incident.id}
      position={[incident.lat, incident.lng]}
      icon={getIncidentIcon(incident.severity)}
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
      <div className="grid grid-cols-1 gap-3">
        <div className="glass-panel p-4 text-center">
          <AlertTriangle className="w-6 h-6 mx-auto mb-2 text-risk-critical" />
          <div className="text-2xl font-bold">
            {/* {incidents.filter((i) => i.severity >= 4).length} */}
                   {incidents.filter((i) => i.severity >= 3 && calculateDistance(
                location?.lat,
                location?.lng,
                i.lat,
                i.lng
              ) <= INCIDENT_RADIUS_KM) .length}

          </div>
          <p className="text-xs text-muted-foreground">High Severity (Under {INCIDENT_RADIUS_KM} KM)</p>
        </div>

        {/* <div className="glass-panel p-4 text-center">
          <MapPin className="w-6 h-6 mx-auto mb-2 text-risk-medium" />
          <div className="text-2xl font-bold">{riskZones.length}</div>
          <p className="text-xs text-muted-foreground">Risk Zones</p>
        </div> */}

        {/* <div className="glass-panel p-4 text-center">
          <Shield className="w-6 h-6 mx-auto mb-2 text-risk-safe" />
          <div className="text-2xl font-bold">{areaRating}/5</div>
          <p className="text-xs text-muted-foreground">Area Score</p>
        </div> */}
      </div>
    </section>
  );
}
