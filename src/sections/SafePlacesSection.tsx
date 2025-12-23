

// import { useState, useMemo } from 'react';
// import { MapPin, Building2, Phone, Navigation, Filter } from 'lucide-react';

// import safePlacesData from '../data/safePlaces.json';
// import { calculateDistance } from '../logic/risk';
// import type { SafePlace } from '../types';



// const safePlaces: SafePlace[] = safePlacesData as SafePlace[];

// /** ✅ Mumbai default (change dynamically later) */
// const DEFAULT_LOCATION = { lat: 19.0760, lng: 72.8777 };

// /** ✅ SINGLE SOURCE OF TRUTH FOR CATEGORIES */
// const categoryInfo: Record<
//   string,
//   { icon: string; label: string }
// > = {
//   police: { icon: '👮', label: 'Police Station' },
//   hospital: { icon: '🏥', label: 'Hospital' },
//   fire_station: { icon: '🚒', label: 'Fire Station' },
//   public_building: { icon: '🏛', label: 'Public Building' },
//   shelter: { icon: '🏠', label: 'Shelter' },
//   transport: { icon: '🚇', label: 'Transport Hub' },
//   safe_zone: { icon: '🛣', label: 'Safe Zone' }
// };

// export default function SafePlacesSection({location}:{lat:number,lng:number}) {
//   const [userLocation] = useState(DEFAULT_LOCATION);
//   const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
//   const [maxDistance, setMaxDistance] = useState<number>(5); // km

//   /** ✅ FIXED FILTER PIPELINE */
//   const placesWithDistance = useMemo(() => {
//     return safePlaces
//       .map((place) => ({
//         ...place,
//         distance: calculateDistance(
//           userLocation.lat,
//           userLocation.lng,
//           place.lat,
//           place.lng
//         ),
//       }))
//       .filter((place) =>
//         selectedCategory ? place.category === selectedCategory : true
//       )
//       .filter((place) => place.distance <= maxDistance)
//       .sort((a, b) => a.distance - b.distance);
//   }, [userLocation, selectedCategory, maxDistance]);

//   /** ✅ ONLY SHOW CATEGORIES THAT EXIST */
//   const categories = useMemo(() => {
//     return Array.from(
//       new Set(safePlaces.map((p) => p.category))
//     );
//   }, []);

//   const openDirections = (place: SafePlace) => {
//     window.open(
//       `https://www.google.com/maps/dir/?api=1&destination=${place.lat},${place.lng}`,
//       '_blank'
//     );
//   };

//   return (
//     <section className="space-y-4">
//       <div className="flex items-center gap-2">
//         <Building2 className="w-5 h-5 text-risk-safe" />
//         <h2 className="text-xl font-bold">Safe Places Nearby</h2>
//       </div>

//       {/* FILTERS */}
//       <div className="glass-panel p-4">
//         <div className="flex items-center gap-2 mb-3">
//           <Filter className="w-4 h-4 text-muted-foreground" />
//           <span className="text-sm font-medium">Filter by type</span>
//         </div>

//         <div className="flex flex-wrap gap-2 mb-4">
//           <button
//             onClick={() => setSelectedCategory(null)}
//             className={`px-3 py-1.5 rounded-full text-sm ${
//               selectedCategory === null
//                 ? 'bg-primary text-primary-foreground'
//                 : 'bg-secondary'
//             }`}
//           >
//             All
//           </button>

//           {categories.map((cat) => (
//             <button
//               key={cat}
//               onClick={() => setSelectedCategory(cat)}
//               className={`px-3 py-1.5 rounded-full text-sm flex items-center gap-1.5 ${
//                 selectedCategory === cat
//                   ? 'bg-primary text-primary-foreground'
//                   : 'bg-secondary'
//               }`}
//             >
//               <span>{categoryInfo[cat]?.icon ?? '📍'}</span>
//               {categoryInfo[cat]?.label ?? cat}
//             </button>
//           ))}
//         </div>

//         <div className="flex items-center gap-3">
//           <span className="text-sm text-muted-foreground">Distance</span>
//           <input
//             type="range"
//             min="1"
//             max="15"
//             step="1"
//             value={maxDistance}
//             onChange={(e) => setMaxDistance(Number(e.target.value))}
//             className="flex-1 accent-primary"
//           />
//           <span className="text-sm w-16 text-right">{maxDistance} km</span>
//         </div>
//       </div>

//       {/* RESULTS */}
//       <div className="space-y-3">
//         {placesWithDistance.length === 0 ? (
//           <div className="glass-panel p-8 text-center">
//             <MapPin className="w-10 h-10 mx-auto mb-3 text-muted-foreground" />
//             <p className="text-muted-foreground">
//               No safe places found within {maxDistance} km
//             </p>
//           </div>
//         ) : (
//           placesWithDistance.map((place) => {
//             const info = categoryInfo[place.category] ?? {
//               icon: '📍',
//               label: place.category,
//             };

//             return (
//               <div key={place.id} className="glass-panel p-4">
//                 <div className="flex items-start gap-3">
//                   <div className="text-2xl">{info.icon}</div>
//                   <div className="flex-1">
//                     <div className="flex items-center gap-2">
//                       <h3 className="font-semibold">{place.name}</h3>
//                       <span className="text-xs bg-secondary px-2 py-0.5 rounded">
//                         {(place.distance * 1000).toFixed(0)} m
//                       </span>
//                     </div>

//                     <p className="text-sm text-muted-foreground">
//                       {place.address}
//                     </p>

//                     <div className="flex gap-2 mt-3">
//                       {place.phone && (
//                         <a
//                           href={`tel:${place.phone}`}
//                           className="px-3 py-1.5 rounded bg-risk-safe/20 text-risk-safe text-sm"
//                         >
//                           <Phone className="inline w-3 h-3 mr-1" />
//                           Call
//                         </a>
//                       )}

//                       <button
//                         onClick={() => openDirections(place)}
//                         className="px-3 py-1.5 rounded bg-primary/20 text-primary text-sm"
//                       >
//                         <Navigation className="inline w-3 h-3 mr-1" />
//                         Directions
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             );
//           })
//         )}
//       </div>

//       <p className="text-xs text-muted-foreground text-center">
//         {placesWithDistance.length} safe places within {maxDistance} km
//       </p>
//     </section>
//   );
// }


import { useEffect, useMemo, useState } from 'react';
import { MapPin, Building2, Phone, Navigation, Filter } from 'lucide-react';

import { calculateDistance } from '../logic/risk';
import type { SafePlace } from '../types';

// const DEFAULT_LOCATION = { lat: 19.0760, lng: 72.8777 };


function buildOverpassQuery(lat: number, lng: number, radius = 2000) {
  return `
    [out:json];
    (
      node["amenity"~"police|hospital|fire_station|clinic"](around:${radius},${lat},${lng});
      node["railway"="station"](around:${radius},${lat},${lng});
    );
    out body 10;
  `;
}
async function fetchSafePlaces(lat: number, lng: number) {
  const query = buildOverpassQuery(lat, lng);

  const res = await fetch('https://overpass-api.de/api/interpreter', {
    method: 'POST',
    body: query,
  });

  const data = await res.json();

  return data.elements.map((el: any) => ({
    id: `osm-${el.id}`,
    lat: el.lat,
    lng: el.lon,
    name: el.tags?.name ?? 'Unnamed Place',
    category:
      el.tags?.amenity ??
      (el.tags?.railway === 'station' ? 'transport' : 'other'),
    address:
      el.tags?.['addr:street']
        ? `${el.tags['addr:street']} ${el.tags['addr:housenumber'] ?? ''}`
        : 'Address unavailable',
    phone: el.tags?.phone ?? null,
  }));
}

export default function SafePlacesSection({
  location,
}: {
  location?: { lat: number; lng: number };
}) {
  console.log(location)
  const userLocation = location;

  const [safePlaces, setSafePlaces] = useState<SafePlace[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [maxDistance, setMaxDistance] = useState<number>(5);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const places = await fetchSafePlaces(
          userLocation.lat,
          userLocation.lng
        );
        setSafePlaces(places);
      } catch (e) {
        console.error('Failed to fetch OSM data', e);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [userLocation.lat, userLocation.lng]);

  const placesWithDistance = useMemo(() => {
    return safePlaces
      .map((place) => ({
        ...place,
        distance: calculateDistance(
          userLocation.lat,
          userLocation.lng,
          place.lat,
          place.lng
        ),
      }))
      .filter((p) =>
        selectedCategory ? p.category === selectedCategory : true
      )
      .filter((p) => p.distance <= maxDistance)
      .sort((a, b) => a.distance - b.distance);
  }, [safePlaces, selectedCategory, maxDistance, userLocation]);

  const categories = useMemo(() => {
    return Array.from(new Set(safePlaces.map((p) => p.category)));
  }, [safePlaces]);

  const openDirections = (place: SafePlace) => {
    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${place.lat},${place.lng}`,
      '_blank'
    );
  };

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2">
        <Building2 className="w-5 h-5 text-risk-safe" />
        <h2 className="text-xl font-bold">Safe Places Nearby ({safePlaces?.length})</h2>
      </div>

      {loading && (
        <div className="glass-panel p-6 text-center text-sm">
          Fetching nearby safe places…
        </div>
      )}

      {!loading && (
        <>
          <div className="glass-panel p-4">
            <div className="flex flex-wrap gap-2 mb-4">
              <button
                onClick={() => setSelectedCategory(null)}
                className="px-3 py-1.5 rounded bg-secondary text-sm"
              >
                All
              </button>

              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className="px-3 py-1.5 rounded bg-secondary text-sm"
                >
                  {cat}
                </button>
              ))}
            </div>

            <input
              type="range"
              min="1"
              max="15"
              value={maxDistance}
              onChange={(e) => setMaxDistance(Number(e.target.value))}
              className="w-full"
            />
            <div className="text-xs mt-1">{maxDistance} km radius</div>
          </div>

          {/* Results */}
          {placesWithDistance.length === 0 ? (
            <div className="glass-panel p-8 text-center">
              <MapPin className="w-10 h-10 mx-auto mb-3 text-muted-foreground" />
              No places found
            </div>
          ) : (
            placesWithDistance.map((place) => (
              <div key={place.id} className="glass-panel p-4">
                <h3 className="font-semibold">{place.name}</h3>
                <p className="text-xs text-muted-foreground">
                  {(place.distance * 1000).toFixed(0)} m away
                </p>

                <div className="flex gap-2 mt-3">
                  {place.phone && (
                    <a href={`tel:${place.phone}`} className="text-sm">
                      <Phone className="inline w-3 h-3 mr-1" />
                      Call
                    </a>
                  )}
                  <button
                    onClick={() => openDirections(place)}
                    className="text-sm"
                  >
                    <Navigation className="inline w-3 h-3 mr-1" />
                    Directions
                  </button>
                </div>
              </div>
            ))
          )}
        </>
      )}
    </section>
  );
}
