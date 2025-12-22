import { useEffect, useState } from 'react';
import { Shield, AlertTriangle, Menu, X, Map, ShieldAlert, Clock10, Siren, MapPinHouse, LucideIcon } from 'lucide-react';

import RiskMapSection from '../sections/RiskMapSection';
import ThreatInsightsSection from '../sections/ThreatInsightsSection';
import RoutePlannerSection from '../sections/RoutePlannerSection';
import EmergencySection from '../sections/EmergencySection';
import SafePlacesSection from '../sections/SafePlacesSection';
import { getEnvConfig } from '../logic/env';
import { getTimeBasedSafety } from '../logic/risk';
import AddToHomeHelp from '@/components/AddToHomeHelp';

type ActiveSection = 'map' | 'threats' | 'routes' | 'emergency' | 'places';
function setCookie(name: string, value: string, days = 1) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/`;
}

function getCookie(name: string) {
  return document.cookie
    .split('; ')
    .find(row => row.startsWith(name + '='))
    ?.split('=')[1];
}

export default function Home() {
  const [activeSection, setActiveSection] = useState<ActiveSection>('map');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [timeWarning, setTimeWarning] = useState<string | null>(null);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    getEnvConfig();


    // Check time-based safety
    const loc = {
      coords: {
        latitude: 19.0596,
        longitude: 72.8295,
        accuracy: 120,              // meters
        altitude: null,             // often null
        altitudeAccuracy: null,     // often null
        heading: null,              // device direction
        speed: null                 // m/s
      },
      timestamp: 1735219823000      // Unix timestamp (ms)
    }

    setLocation({ lat: loc.coords.latitude, lng: loc.coords.longitude });
    const timeSafety = getTimeBasedSafety();
    // console.log(timeSafety)

    setTimeWarning(timeSafety.warning);
  }, []);




  const navItems: {
    id: ActiveSection;
    label: string;
    icon: LucideIcon;
  }[] = [
      { id: 'map', label: 'Risk Map', icon: Map },
      // { id: 'threats', label: 'Insights', icon: ShieldAlert },
      { id: 'routes', label: 'Routes', icon: Clock10 },
      { id: 'emergency', label: 'SOS', icon: Siren },
      { id: 'places', label: 'Safe Places', icon: MapPinHouse },
    ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-primary/20">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="font-bold text-lg tracking-tight">Vigilant Map</h1>
                {/* <p className="text-xs text-muted-foreground">Real-Time Safety Awareness</p> */}
              </div>
            </div>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;

                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeSection === item.id
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-secondary text-muted-foreground hover:text-foreground"
                      }`}
                  >
                    <Icon className="w-6 h-6" />
                    {item.label}
                  </button>
                );
              })}
            </nav>


            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-secondary"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Nav */}
          {mobileMenuOpen && (
            <nav className="md:hidden py-4 border-t border-border animate-fade-in">
              <div className="grid grid-cols-4 gap-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveSection(item.id);
                        setMobileMenuOpen(false);
                      }}
                      className={`flex flex-col items-center gap-1 p-3 rounded-lg text-xs font-medium transition-all ${activeSection === item.id
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-secondary text-muted-foreground'
                        }`}
                    >
                      {/* <span className="text-lg">{item.icon}</span> */}
                      <Icon className="w-6 h-6" />
                      {item.label}
                    </button>
                  )
                })}
              </div>
            </nav>
          )}
        </div>
      </header>

      {/* Time Warning Banner */}
      {timeWarning && (
        <div className="bg-risk-medium/20 border-b border-risk-medium/30 px-4 py-2 animate-fade-in">
          <div className="container mx-auto flex items-center gap-2 text-sm">
            <AlertTriangle className="w-4 h-4 text-risk-medium" />
            <span className="text-risk-medium font-medium">{timeWarning}</span>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <div className={`grid ${activeSection!="routes"? "lg:grid-cols-3" : "lg:grid-cols-1"} gap-6`}>
          {/* Map Section - Always visible on desktop */}
          {activeSection!="routes" && <div className={`lg:col-span-2 ${activeSection !== 'map' && activeSection !== 'routes' ? 'hidden lg:block' : ''}`}>
            <RiskMapSection location={location} />
          </div>}

          {/* Side Panel */}
          <div className="space-y-6 w-full ">
            {(activeSection === 'map' || activeSection === 'threats') && (
              <ThreatInsightsSection />
            )}

            {activeSection === 'routes' && (
              <RoutePlannerSection />
            )}

            {activeSection === 'emergency' && (
              <EmergencySection />
            )}

            {activeSection === 'places' && (
              <SafePlacesSection />
            )}
          </div>
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-xl border-t border-border z-50">
        <div className="grid grid-cols-4">
          {navItems.map((item) => {
            const Icon = item.icon
            return <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`flex flex-col items-center gap-1 py-3 text-xs font-medium transition-all ${activeSection === item.id
                ? 'text-primary'
                : 'text-muted-foreground'
                }`}
            >
              {/* <span className="text-xl">{item.icon}</span> */}
              <Icon className="w-6 h-6" />
              <span className={activeSection === item.id ? 'font-semibold' : ''}>
                {item.label}
              </span>
              {activeSection === item.id && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-primary rounded-full" />
              )}
            </button>
          })}
        </div>
      </nav>

      {/* Bottom padding for mobile nav */}
      <AddToHomeHelp/>
      <div className="md:hidden h-20" />
    </div>
  );
}
