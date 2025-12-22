


// function decodePolyline(encoded: string) {
//   let points = [];
//   let index = 0, lat = 0, lng = 0;

//   while (index < encoded.length) {
//     let b, shift = 0, result = 0;
//     do {
//       b = encoded.charCodeAt(index++) - 63;
//       result |= (b & 0x1f) << shift;
//       shift += 5;
//     } while (b >= 0x20);
//     const dlat = result & 1 ? ~(result >> 1) : result >> 1;
//     lat += dlat;

//     shift = 0;
//     result = 0;
//     do {
//       b = encoded.charCodeAt(index++) - 63;
//       result |= (b & 0x1f) << shift;
//       shift += 5;
//     } while (b >= 0x20);
//     const dlng = result & 1 ? ~(result >> 1) : result >> 1;
//     lng += dlng;

//     points.push({ lat: lat / 1e5, lng: lng / 1e5 });
//   }
//   return points;
// }


// import { calculateDistance } from '../logic/risk';

// function analyzeRoute(route: any, incidents: any[]) {
//   const points = decodePolyline(route.geometry);
//   let riskScore = 0;
//   let incidentsNearby = 0;

//   incidents.forEach((inc) => {
//     const near = points.some(
//       (p) => calculateDistance(p.lat, p.lng, inc.lat, inc.lng) < 0.15 // 150m
//     );

//     if (near) {
//       incidentsNearby++;
//       riskScore += inc.severity * 0.2;
//     }
//   });

//   const normalizedRisk = Math.min(riskScore / 5, 1);

//   let riskLevel: 'safe' | 'low' | 'medium' | 'high' | 'critical' = 'safe';
//   if (normalizedRisk > 0.8) riskLevel = 'critical';
//   else if (normalizedRisk > 0.6) riskLevel = 'high';
//   else if (normalizedRisk > 0.4) riskLevel = 'medium';
//   else if (normalizedRisk > 0.2) riskLevel = 'low';

//   return {
//     riskScore: normalizedRisk,
//     riskLevel,
//     incidentsNearby,
//   };
// }

// import { useEffect, useMemo, useState } from 'react';
// import { Navigation, Clock, Shield, AlertTriangle, Route } from 'lucide-react';

// import incidentsData from '../data/incidents.json';
// import type { Incident } from '../types';

// const incidents: Incident[] = incidentsData as Incident[];

// const START = { lat: 19.0760, lng: 72.8777 }; // demo
// const END = { lat: 19.1025, lng: 72.8589 };   // demo

// export default function RoutePlannerSection() {
//   const [routes, setRoutes] = useState<any[]>([]);
//   const [selectedRouteId, setSelectedRouteId] = useState<string | null>(null);
//   const [comparisonMode, setComparisonMode] =
//     useState<'safest' | 'fastest' | 'all'>('all');

//   useEffect(() => {
//     async function fetchRoutes() {
//       const url = `https://router.project-osrm.org/route/v1/driving/${START.lng},${START.lat};${END.lng},${END.lat}?alternatives=true&overview=full&geometries=polyline`;

//       const res = await fetch(url);
//       const data = await res.json();
//       setRoutes(data.routes || []);
//     }

//     fetchRoutes();
//   }, []);

//   const analyzedRoutes = useMemo(() => {
//     return routes.map((route, idx) => {
//       const analysis = analyzeRoute(route, incidents);

//       return {
//         id: `route-${idx}`,
//         route,
//         estimatedTime: Math.round(route.duration / 60),
//         distance: (route.distance / 1000).toFixed(2),
//         ...analysis,
//       };
//     });
//   }, [routes]);


//   const safestRoute = useMemo(() => {
//   if (analyzedRoutes.length === 0) return null;

//   return analyzedRoutes.reduce((a, b) =>
//     a.riskScore < b.riskScore ? a : b
//   );
// }, [analyzedRoutes]);



//   const fastestRoute = useMemo(() => {
//   if (analyzedRoutes.length === 0) return null;

//   return analyzedRoutes.reduce((a, b) =>
//     a.estimatedTime < b.estimatedTime ? a : b
//   );
// }, [analyzedRoutes]);


//   const displayedRoutes = useMemo(() => {
//     if (comparisonMode === 'safest') return safestRoute ? [safestRoute] : [];
//     if (comparisonMode === 'fastest') return fastestRoute ? [fastestRoute] : [];
//     return analyzedRoutes;
//   }, [comparisonMode, analyzedRoutes, safestRoute, fastestRoute]);

//   return (
//     <section className="space-y-4">
//       <h2 className="text-xl font-bold flex items-center gap-2">
//         <Navigation className="w-5 h-5" /> Route Planner
//       </h2>

//       {/* Mode selector */}
//       <div className="flex gap-2">
//         {['all', 'safest', 'fastest'].map((mode) => (
//           <button
//             key={mode}
//             onClick={() => setComparisonMode(mode as any)}
//             className={`px-4 py-2 rounded ${
//               comparisonMode === mode ? 'bg-primary text-white' : 'bg-secondary'
//             }`}
//           >
//             {mode}
//           </button>
//         ))}
//       </div>

//       {/* Routes */}
//       <div className="space-y-3">
//         {displayedRoutes.map((r) => (
//           <button
//             key={r.id}
//             onClick={() => setSelectedRouteId(r.id)}
//             className="glass-panel p-4 w-full text-left"
//           >
//             <div className="flex justify-between">
//               <h3 className="font-semibold">
//                 {r === safestRoute && '🟢 Safest Route'}
//                 {r === fastestRoute && r !== safestRoute && '⚡ Fastest Route'}
//                 {r !== safestRoute && r !== fastestRoute && 'Route Option'}
//               </h3>
//               <span className={`risk-badge-${r.riskLevel}`}>
//                 {r.riskLevel}
//               </span>
//             </div>

//             <div className="grid grid-cols-3 mt-3 text-center">
//               <div>
//                 <Clock className="mx-auto w-4 h-4" />
//                 {r.estimatedTime} min
//               </div>
//               <div>
//                 <Route className="mx-auto w-4 h-4" />
//                 {r.distance} km
//               </div>
//               <div>
//                 <AlertTriangle className="mx-auto w-4 h-4" />
//                 {r.incidentsNearby} risks
//               </div>
//             </div>
//           </button>
//         ))}
//       </div>
//     </section>
//   );
// }


import { useEffect, useMemo, useState } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  useMapEvents,
} from 'react-leaflet';
import { Navigation, Clock, AlertTriangle, Route as RouteIcon } from 'lucide-react';
import type { Incident } from '../types';
import incidentsData from '../data/incidents.json';
import { calculateDistance, openInGoogleMaps } from '../logic/risk';

const incidents: Incident[] = incidentsData as Incident[];

/* ---------------- UTILS ---------------- */

function decodePolyline(encoded: string) {
  let points: { lat: number; lng: number }[] = [];
  let index = 0,
    lat = 0,
    lng = 0;

  while (index < encoded.length) {
    let b,
      shift = 0,
      result = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    lat += result & 1 ? ~(result >> 1) : result >> 1;

    shift = 0;
    result = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    lng += result & 1 ? ~(result >> 1) : result >> 1;

    points.push({ lat: lat / 1e5, lng: lng / 1e5 });
  }
  return points;
}

function analyzeRoute(route: any, incidents: Incident[]) {
  const points = decodePolyline(route.geometry);
  let riskScore = 0;
  let incidentsNearby = 0;

  incidents.forEach((inc) => {
    const near = points.some(
      (p) => calculateDistance(p.lat, p.lng, inc.lat, inc.lng) < 0.15
    );

    if (near) {
      incidentsNearby++;
      riskScore += inc.severity * 0.2;
    }
  });

  const normalized = Math.min(riskScore / 5, 1);

  let riskLevel: 'safe' | 'low' | 'medium' | 'high' | 'critical' = 'safe';
  if (normalized > 0.8) riskLevel = 'critical';
  else if (normalized > 0.6) riskLevel = 'high';
  else if (normalized > 0.4) riskLevel = 'medium';
  else if (normalized > 0.2) riskLevel = 'low';

  return { riskScore: normalized, riskLevel, incidentsNearby };
}

/* ---------------- MAP CLICK HANDLER ---------------- */

function MapClickHandler({
  onClick,
}: {
  onClick: (lat: number, lng: number) => void;
}) {
  useMapEvents({
    click(e) {
      onClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

/* ---------------- COMPONENT ---------------- */

export default function RoutePlannerSection() {
  const [start, setStart] = useState<{ lat: number; lng: number } | null>(null);
  const [end, setEnd] = useState<{ lat: number; lng: number } | null>(null);
  const [routes, setRoutes] = useState<any[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [mode, setMode] = useState<'all' | 'safest' | 'fastest'>('all');

  /* ---- FETCH ROUTES ---- */
  useEffect(() => {
    if (!start || !end) return;

    async function fetchRoutes() {
      const url = `https://router.project-osrm.org/route/v1/driving/${start.lng},${start.lat};${end.lng},${end.lat}?alternatives=true&overview=full&geometries=polyline`;
      const res = await fetch(url);
      const data = await res.json();
      setRoutes(data.routes || []);
      setSelectedIndex(null);
    }

    fetchRoutes();
  }, [start, end]);

  /* ---- ANALYSIS ---- */
  const analyzedRoutes = useMemo(() => {
    return routes.map((r, idx) => ({
      id: idx,
      geometry: r.geometry,
      estimatedTime: Math.round(r.duration / 60),
      distance: (r.distance / 1000).toFixed(2),
      ...analyzeRoute(r, incidents),
    }));
  }, [routes]);

  const safest = useMemo(() => {
    if (!analyzedRoutes.length) return null;
    return analyzedRoutes.reduce((a, b) =>
      a.riskScore < b.riskScore ? a : b
    );
  }, [analyzedRoutes]);

  const fastest = useMemo(() => {
    if (!analyzedRoutes.length) return null;
    return analyzedRoutes.reduce((a, b) =>
      a.estimatedTime < b.estimatedTime ? a : b
    );
  }, [analyzedRoutes]);

  const visibleRoutes = useMemo(() => {
    if (mode === 'safest') return safest ? [safest] : [];
    if (mode === 'fastest') return fastest ? [fastest] : [];
    return analyzedRoutes;
  }, [mode, safest, fastest, analyzedRoutes]);

  /* ---------------- UI ---------------- */

  return (
    <section className="space-y-6 w-full">
      <h2 className="text-xl font-bold flex items-center gap-2">
        <Navigation className="w-5 h-5" /> Route Planner
      </h2>

      {/* MAP */}
      {/* <MapContainer
        center={[19.076, 72.8777]}
        zoom={13}
        className="h-[400px]  rounded-lg"
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <MapClickHandler
          onClick={(lat, lng) => {
            if (!start) setStart({ lat, lng });
            else if (!end) setEnd({ lat, lng });
            else {
              setStart({ lat, lng });
              setEnd(null);
              setRoutes([]);
            }
          }}
        />

        {start && <Marker position={[start.lat, start.lng]} />}
        {end && <Marker position={[end.lat, end.lng]} />}

        {routes.map((r, i) => (
          <Polyline
            key={i}
            positions={decodePolyline(r.geometry).map((p) => [
              p.lat,
              p.lng,
            ])}
            color={i === selectedIndex ? '#2563eb' : '#999'}
            weight={i === selectedIndex ? 6 : 3}
            opacity={i === selectedIndex ? 1 : 0.4}
          />
        ))}
      </MapContainer>
       */}
      <div className="w-full">
        <MapContainer
          center={[19.076, 72.8777]}
          zoom={13}
          className="h-[400px] w-full rounded-none"
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <MapClickHandler
            onClick={(lat, lng) => {
              if (!start) setStart({ lat, lng });
              else if (!end) setEnd({ lat, lng });
              else {
                setStart({ lat, lng });
                setEnd(null);
                setRoutes([]);
              }
            }}
          />

          {start && <Marker position={[start.lat, start.lng]} />}
          {end && <Marker position={[end.lat, end.lng]} />}

          {routes.map((r, i) => (
            <Polyline
              key={i}
              positions={decodePolyline(r.geometry).map((p) => [
                p.lat,
                p.lng,
              ])}
              color={i === selectedIndex ? '#2563eb' : '#999'}
              weight={i === selectedIndex ? 6 : 3}
              opacity={i === selectedIndex ? 1 : 0.4}
            />
          ))}
        </MapContainer>
      </div>


      {/* MODE */}
      <div className="flex gap-2">
        {['all', 'safest', 'fastest'].map((m) => (
          <button
            key={m}
            onClick={() => setMode(m as any)}
            className={`px-4 py-2 rounded ${mode === m ? 'bg-primary text-white' : 'bg-secondary'
              }`}
          >
            {m}
          </button>
        ))}
      </div>

      {/* ROUTE CARDS */}
      <div className="space-y-3">
        {/* {visibleRoutes.map((r) => (
          <button
            key={r.id}
            onClick={() => setSelectedIndex(r.id)}
            className="glass-panel p-4 w-full text-left"
          >
            <div className="flex justify-between mb-2">
              <span className="font-semibold">
                {r === safest && '🟢 Safest'}
                {r === fastest && r !== safest && '⚡ Fastest'}
                {r !== safest && r !== fastest && 'Route Option'}
              </span>
              <span className={`risk-badge-${r.riskLevel}`}>
                {r.riskLevel}
              </span>
            </div>

            <div className="grid grid-cols-3 text-center">
              <div>
                <Clock className="mx-auto w-4 h-4" />
                {r.estimatedTime} min
              </div>
              <div>
                <RouteIcon className="mx-auto w-4 h-4" />
                {r.distance} km
              </div>
              <div>
                <AlertTriangle className="mx-auto w-4 h-4" />
                {r.incidentsNearby} risks
              </div>
            </div>
          </button>
        ))} */}
        {visibleRoutes.map((r) => (
          <button
            key={r.id}
            onClick={() => setSelectedIndex(r.id)}
            className="glass-panel p-4 w-full text-left"
          >
            <div className="flex justify-between mb-2">
              <span className="font-semibold">
                {r === safest && '🟢 Safest'}
                {r === fastest && r !== safest && '⚡ Fastest'}
                {r !== safest && r !== fastest && 'Route Option'}
              </span>
              <span className={`risk-badge-${r.riskLevel}`}>
                {r.riskLevel}
              </span>
            </div>

            <div className="grid grid-cols-3 text-center mb-3">
              <div>
                <Clock className="mx-auto w-4 h-4" />
                {(r.estimatedTime * 1.3).toFixed(2)} min (Estimate)
              </div>
              <div>
                <RouteIcon className="mx-auto w-4 h-4" />
                {r.distance} km
              </div>
              <div>
                <AlertTriangle className="mx-auto w-4 h-4" />
                {r.incidentsNearby} risks
              </div>
            </div>

            {/* 🔗 GOOGLE MAPS CTA */}
            <div className="flex justify-end">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation(); // important
                  openInGoogleMaps(start, end);
                }}
                className="text-sm px-3 py-1.5 rounded bg-primary/20 text-primary hover:bg-primary/30 transition"
              >
                Open in Google Maps →
              </button>
            </div>
          </button>
        ))}

      </div>

      <p className="text-xs text-muted-foreground text-center">
        Click map to set start → end. Third click resets.
      </p>
    </section>
  );
}
