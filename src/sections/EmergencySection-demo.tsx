import { useState, useCallback, useMemo } from 'react';
import { Phone, MessageSquare, AlertCircle, Users, MapPin } from 'lucide-react';

import contactsData from '../data/contacts.json';
import { hasSmsApi } from '../logic/env';
import type { Contact } from '../types';

const contacts: Contact[] = contactsData as Contact[];

export default function EmergencySection() {
  const [isSosActive, setIsSosActive] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [alertSent, setAlertSent] = useState(false);

  const getCurrentLocation = useCallback((): Promise<{ lat: number; lng: number }> => {
    return new Promise((resolve, reject) => {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            });
          },
          () => {
            // Default to NYC if location unavailable
            resolve({ lat: 40.7549, lng: -73.9840 });
          }
        );
      } else {
        resolve({ lat: 40.7549, lng: -73.9840 });
      }
    });
  }, []);

  const handleSosPress = useCallback(async () => {
    setIsSosActive(true);
    
    const location = await getCurrentLocation();
    setUserLocation(location);

    // Simulate sending alerts to contacts
    const smsEnabled = hasSmsApi();
    
    contacts.forEach((contact) => {
      const message = `🚨 EMERGENCY ALERT: I need help! My location: https://maps.google.com/?q=${location.lat},${location.lng}`;
      
      if (smsEnabled) {
        // TODO: Call SMS API when VITE_SMS_API_KEY is set
        console.log(`[SMS API] Sending to ${contact.name}: ${message}`);
      } else {
        console.log(`[SIMULATED] Alert to ${contact.name} (${contact.phone}): ${message}`);
      }
    });

    setAlertSent(true);

    // Reset after 5 seconds
    setTimeout(() => {
      setIsSosActive(false);
      setAlertSent(false);
    }, 5000);
  }, [getCurrentLocation]);

  const emergencyNumbers = useMemo(() => [
    { name: 'Emergency', number: '911', icon: '🚨' },
    { name: 'Police', number: '911', icon: '👮' },
    { name: 'Fire', number: '911', icon: '🚒' },
    { name: 'Ambulance', number: '911', icon: '🚑' },
  ], []);

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <AlertCircle className="w-5 h-5 text-risk-critical" />
        <h2 className="text-xl font-bold">Emergency Assistance</h2>
      </div>

      {/* SOS Button */}
      <div className="glass-panel p-6 text-center">
        <button
          onClick={handleSosPress}
          disabled={isSosActive}
          className={`relative w-32 h-32 rounded-full mx-auto flex items-center justify-center text-2xl font-bold transition-all ${
            isSosActive
              ? 'bg-risk-critical text-white pulse-danger'
              : 'bg-gradient-to-br from-risk-critical to-risk-high text-white hover:scale-105 shadow-glow-danger'
          }`}
        >
          {isSosActive ? (
            <span className="animate-pulse">SENDING...</span>
          ) : (
            'SOS'
          )}
        </button>
        
        <p className="mt-4 text-sm text-muted-foreground">
          {alertSent 
            ? '✓ Alerts sent to all trusted contacts'
            : 'Press to alert trusted contacts with your location'}
        </p>

        {userLocation && alertSent && (
          <div className="mt-3 flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <MapPin className="w-3 h-3" />
            <span>Location shared: {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}</span>
          </div>
        )}
      </div>

      {/* Quick Dial */}
      <div className="glass-panel p-4">
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <Phone className="w-4 h-4" />
          Emergency Services
        </h3>
        
        <div className="grid grid-cols-2 gap-2">
          {emergencyNumbers.map((service) => (
            <a
              key={service.name}
              href={`tel:${service.number}`}
              className="flex items-center gap-3 p-3 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
            >
              <span className="text-xl">{service.icon}</span>
              <div>
                <span className="font-medium block">{service.name}</span>
                <span className="text-xs text-muted-foreground">{service.number}</span>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Trusted Contacts */}
      <div className="glass-panel p-4">
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <Users className="w-4 h-4" />
          Trusted Contacts
        </h3>
        
        <div className="space-y-2">
          {contacts.map((contact) => (
            <div
              key={contact.id}
              className="flex items-center justify-between p-3 rounded-lg bg-secondary/50"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold">
                  {contact.name.charAt(0)}
                </div>
                <div>
                  <span className="font-medium block">{contact.name}</span>
                  <span className="text-xs text-muted-foreground">{contact.relationship}</span>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <a
                  href={`tel:${contact.phone}`}
                  className="p-2 rounded-lg bg-risk-safe/20 text-risk-safe hover:bg-risk-safe/30 transition-colors"
                >
                  <Phone className="w-4 h-4" />
                </a>
                <a
                  href={`sms:${contact.phone}`}
                  className="p-2 rounded-lg bg-primary/20 text-primary hover:bg-primary/30 transition-colors"
                >
                  <MessageSquare className="w-4 h-4" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
