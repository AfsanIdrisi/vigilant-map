import { useState, useMemo } from 'react';
import { MapPin, Building2, Shield, Phone, Navigation, Filter } from 'lucide-react';

import safePlacesData from '../data/safePlaces.json';
import { calculateDistance } from '../logic/risk';
import type { SafePlace } from '../types';

const safePlaces: SafePlace[] = safePlacesData as SafePlace[];

const DEFAULT_LOCATION = { lat: 40.7549, lng: -73.9840 };

const categoryInfo: Record<string, { icon: string; color: string; label: string }> = {
  police: { icon: '👮', color: 'text-primary', label: 'Police Station' },
  hospital: { icon: '🏥', color: 'text-risk-critical', label: 'Hospital' },
  fire_station: { icon: '🚒', color: 'text-risk-high', label: 'Fire Station' },
  shelter: { icon: '🏠', color: 'text-risk-safe', label: 'Shelter' },
  public_building: { icon: '🏛️', color: 'text-risk-medium', label: 'Public Building' },
};

export default function SafePlacesSection() {
  const [userLocation] = useState(DEFAULT_LOCATION);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [maxDistance, setMaxDistance] = useState<number>(2); // km

  const placesWithDistance = useMemo(() => {
    return safePlaces
      .map((place) => ({
        ...place,
        distance: calculateDistance(userLocation.lat, userLocation.lng, place.lat, place.lng),
      }))
      .filter((place) => place.distance <= maxDistance)
      .filter((place) => !selectedCategory || place.category === selectedCategory)
      .sort((a, b) => a.distance - b.distance);
  }, [userLocation, selectedCategory, maxDistance]);

  const categories = useMemo(() => {
    const cats = new Set(safePlaces.map((p) => p.category));
    return Array.from(cats);
  }, []);

  const openDirections = (place: SafePlace) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${place.lat},${place.lng}`;
    window.open(url, '_blank');
  };

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Building2 className="w-5 h-5 text-risk-safe" />
        <h2 className="text-xl font-bold">Safe Places Nearby</h2>
      </div>

      {/* Filters */}
      <div className="glass-panel p-4">
        <div className="flex items-center gap-2 mb-3">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-medium">Filter by type</span>
        </div>
        
        <div className="flex flex-wrap gap-2 mb-4">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
              selectedCategory === null
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary hover:bg-secondary/80'
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(selectedCategory === cat ? null : cat)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all flex items-center gap-1.5 ${
                selectedCategory === cat
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary hover:bg-secondary/80'
              }`}
            >
              <span>{categoryInfo[cat]?.icon}</span>
              {categoryInfo[cat]?.label || cat}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">Distance:</span>
          <input
            type="range"
            min="0.5"
            max="5"
            step="0.5"
            value={maxDistance}
            onChange={(e) => setMaxDistance(parseFloat(e.target.value))}
            className="flex-1 accent-primary"
          />
          <span className="text-sm font-mono w-16">{maxDistance} km</span>
        </div>
      </div>

      {/* Places List */}
      <div className="space-y-3">
        {placesWithDistance.length === 0 ? (
          <div className="glass-panel p-8 text-center">
            <MapPin className="w-10 h-10 mx-auto mb-3 text-muted-foreground" />
            <p className="text-muted-foreground">No safe places found within {maxDistance}km</p>
          </div>
        ) : (
          placesWithDistance.map((place, index) => {
            const info = categoryInfo[place.category] || { icon: '📍', color: 'text-foreground', label: place.category };
            
            return (
              <div
                key={place.id}
                className="glass-panel p-4 animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-start gap-3">
                  <div className="text-2xl">{info.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold truncate">{place.name}</h3>
                      <span className="px-2 py-0.5 bg-secondary rounded-full text-xs text-muted-foreground">
                        {(place.distance * 1000).toFixed(0)}m
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">{place.address}</p>
                    
                    <div className="flex items-center gap-2 mt-3">
                      {place.phone && (
                        <a
                          href={`tel:${place.phone}`}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-risk-safe/20 text-risk-safe text-sm hover:bg-risk-safe/30 transition-colors"
                        >
                          <Phone className="w-3 h-3" />
                          Call
                        </a>
                      )}
                      <button
                        onClick={() => openDirections(place)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/20 text-primary text-sm hover:bg-primary/30 transition-colors"
                      >
                        <Navigation className="w-3 h-3" />
                        Directions
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      <p className="text-xs text-muted-foreground text-center">
        {placesWithDistance.length} safe places within {maxDistance}km
      </p>
    </section>
  );
}
