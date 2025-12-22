// import { useState, useCallback, useMemo } from 'react';
// import { Phone, MessageSquare, AlertCircle, Users, MapPin } from 'lucide-react';

// import contactsData from '../data/contacts.json';
// import { hasSmsApi } from '../logic/env';
// import type { Contact } from '../types';

// const contacts: Contact[] = contactsData as Contact[];

// export default function EmergencySection() {
//   const [isSosActive, setIsSosActive] = useState(false);
//   const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
//   const [alertSent, setAlertSent] = useState(false);

//   const getCurrentLocation = useCallback((): Promise<{ lat: number; lng: number }> => {
//     return new Promise((resolve, reject) => {
//       if ('geolocation' in navigator) {
//         navigator.geolocation.getCurrentPosition(
//           (position) => {
//             resolve({
//               lat: position.coords.latitude,
//               lng: position.coords.longitude,
//             });
//           },
//           () => {
//             // Default to NYC if location unavailable
//             resolve({ lat: 40.7549, lng: -73.9840 });
//           }
//         );
//       } else {
//         resolve({ lat: 40.7549, lng: -73.9840 });
//       }
//     });
//   }, []);

//   const handleSosPress = useCallback(async () => {
//     setIsSosActive(true);

//     const location = await getCurrentLocation();
//     setUserLocation(location);

//     // Simulate sending alerts to contacts
//     const smsEnabled = hasSmsApi();

//     contacts.forEach((contact) => {
//       const message = `🚨 EMERGENCY ALERT: I need help! My location: https://maps.google.com/?q=${location.lat},${location.lng}`;

//       if (smsEnabled) {
//         // TODO: Call SMS API when VITE_SMS_API_KEY is set
//         console.log(`[SMS API] Sending to ${contact.name}: ${message}`);
//       } else {
//         console.log(`[SIMULATED] Alert to ${contact.name} (${contact.phone}): ${message}`);
//       }
//     });

//     setAlertSent(true);

//     // Reset after 5 seconds
//     setTimeout(() => {
//       setIsSosActive(false);
//       setAlertSent(false);
//     }, 5000);
//   }, [getCurrentLocation]);

//   const emergencyNumbers = useMemo(() => [
//     { name: 'Emergency', number: '911', icon: '🚨' },
//     { name: 'Police', number: '911', icon: '👮' },
//     { name: 'Fire', number: '911', icon: '🚒' },
//     { name: 'Ambulance', number: '911', icon: '🚑' },
//   ], []);

//   return (
//     <section className="space-y-4">
//       <div className="flex items-center gap-2 mb-4">
//         <AlertCircle className="w-5 h-5 text-risk-critical" />
//         <h2 className="text-xl font-bold">Emergency Assistance</h2>
//       </div>

//       {/* SOS Button */}
//       <div className="glass-panel p-6 text-center">
//         <button
//           onClick={handleSosPress}
//           disabled={isSosActive}
//           className={`relative w-32 h-32 rounded-full mx-auto flex items-center justify-center text-2xl font-bold transition-all ${
//             isSosActive
//               ? 'bg-risk-critical text-white pulse-danger'
//               : 'bg-gradient-to-br from-risk-critical to-risk-high text-white hover:scale-105 shadow-glow-danger'
//           }`}
//         >
//           {isSosActive ? (
//             <span className="animate-pulse">SENDING...</span>
//           ) : (
//             'SOS'
//           )}
//         </button>

//         <p className="mt-4 text-sm text-muted-foreground">
//           {alertSent 
//             ? '✓ Alerts sent to all trusted contacts'
//             : 'Press to alert trusted contacts with your location'}
//         </p>

//         {userLocation && alertSent && (
//           <div className="mt-3 flex items-center justify-center gap-2 text-xs text-muted-foreground">
//             <MapPin className="w-3 h-3" />
//             <span>Location shared: {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}</span>
//           </div>
//         )}
//       </div>

//       {/* Quick Dial */}
//       <div className="glass-panel p-4">
//         <h3 className="font-semibold mb-3 flex items-center gap-2">
//           <Phone className="w-4 h-4" />
//           Emergency Services
//         </h3>

//         <div className="grid grid-cols-2 gap-2">
//           {emergencyNumbers.map((service) => (
//             <a
//               key={service.name}
//               href={`tel:${service.number}`}
//               className="flex items-center gap-3 p-3 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
//             >
//               <span className="text-xl">{service.icon}</span>
//               <div>
//                 <span className="font-medium block">{service.name}</span>
//                 <span className="text-xs text-muted-foreground">{service.number}</span>
//               </div>
//             </a>
//           ))}
//         </div>
//       </div>

//       {/* Trusted Contacts */}
//       <div className="glass-panel p-4">
//         <h3 className="font-semibold mb-3 flex items-center gap-2">
//           <Users className="w-4 h-4" />
//           Trusted Contacts
//         </h3>

//         <div className="space-y-2">
//           {contacts.map((contact) => (
//             <div
//               key={contact.id}
//               className="flex items-center justify-between p-3 rounded-lg bg-secondary/50"
//             >
//               <div className="flex items-center gap-3">
//                 <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold">
//                   {contact.name.charAt(0)}
//                 </div>
//                 <div>
//                   <span className="font-medium block">{contact.name}</span>
//                   <span className="text-xs text-muted-foreground">{contact.relationship}</span>
//                 </div>
//               </div>

//               <div className="flex items-center gap-2">
//                 <a
//                   href={`tel:${contact.phone}`}
//                   className="p-2 rounded-lg bg-risk-safe/20 text-risk-safe hover:bg-risk-safe/30 transition-colors"
//                 >
//                   <Phone className="w-4 h-4" />
//                 </a>
//                 <a
//                   href={`sms:${contact.phone}`}
//                   className="p-2 rounded-lg bg-primary/20 text-primary hover:bg-primary/30 transition-colors"
//                 >
//                   <MessageSquare className="w-4 h-4" />
//                 </a>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// }

import { useState, useCallback, useMemo, useEffect } from 'react';
import { Phone, MessageSquare, AlertCircle, Users, MapPin, Trash2, Edit, Plus } from 'lucide-react';

import contactsData from '../data/contacts.json';
import { hasSmsApi } from '../logic/env';
import type { Contact } from '../types';

const STORAGE_KEY = 'trusted_contacts';

export default function EmergencySection() {
  const [isSosActive, setIsSosActive] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [alertSent, setAlertSent] = useState(false);

  const [contacts, setContacts] = useState<Contact[]>([]);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [form, setForm] = useState({ name: '', phone: '', relationship: '' });

  /* -------------------------------------------
     Load contacts from localStorage or JSON
  -------------------------------------------- */
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setContacts(JSON.parse(stored));
    } else {
      setContacts(contactsData as Contact[]);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(contactsData));
    }
  }, []);

  const saveContacts = (updated: Contact[]) => {
    setContacts(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  /* -------------------------------------------
     Location
  -------------------------------------------- */
  const getCurrentLocation = useCallback((): Promise<{ lat: number; lng: number }> => {
    return new Promise((resolve) => {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
          () => resolve({ lat: 40.7549, lng: -73.9840 })
        );
      } else {
        resolve({ lat: 40.7549, lng: -73.9840 });
      }
    });
  }, []);

  /* -------------------------------------------
     SOS Logic (UNCHANGED except contacts source)
  -------------------------------------------- */
  const handleSosPress = useCallback(async () => {
    setIsSosActive(true);

    const location = await getCurrentLocation();
    setUserLocation(location);

    const smsEnabled = hasSmsApi();

    contacts.forEach((contact) => {
      const message = `🚨 EMERGENCY ALERT: I need help!
Location: https://maps.google.com/?q=${location.lat},${location.lng}`;

      if (smsEnabled) {
        console.log(`[SMS API] Sending to ${contact.name}: ${message}`);
      } else {
        console.log(`[SIMULATED] Alert to ${contact.name} (${contact.phone})`);
      }
    });

    setAlertSent(true);

    setTimeout(() => {
      setIsSosActive(false);
      setAlertSent(false);
    }, 5000);
  }, [contacts, getCurrentLocation]);

  /* -------------------------------------------
     CONTACT CRUD
  -------------------------------------------- */
  const handleAddOrUpdate = () => {
    if (!form.name || !form.phone) return;

    if (editingContact) {
      const updated = contacts.map((c) =>
        c.id === editingContact.id ? { ...c, ...form } : c
      );
      saveContacts(updated);
      setEditingContact(null);
    } else {
      const newContact: Contact = {
        id: crypto.randomUUID(),
        ...form,
      };
      saveContacts([...contacts, newContact]);
    }

    setForm({ name: '', phone: '', relationship: '' });
  };

  const handleEdit = (contact: Contact) => {
    setEditingContact(contact);
    setForm(contact);
  };

  const handleDelete = (id: string) => {
    saveContacts(contacts.filter((c) => c.id !== id));
  };

  /* -------------------------------------------
     Emergency numbers
  -------------------------------------------- */
  //  const emergencyNumbers = useMemo(() => [
  //    { name: 'Emergency', number: '911', icon: '🚨' },
  //    { name: 'Police', number: '911', icon: '👮' },
  //    { name: 'Fire', number: '911', icon: '🚒' },
  //    { name: 'Ambulance', number: '911', icon: '🚑' },
  //  ], []);

  const emergencyNumbers = useMemo(() => [
    { name: 'National Emergency', number: '112', icon: '🚨' },   // Unified emergency number
    { name: 'Police', number: '100', icon: '👮' },
    { name: 'Fire Brigade', number: '101', icon: '🚒' },
    { name: 'Ambulance', number: '108', icon: '🚑' },
    { name: 'Women Helpline', number: '1091', icon: '👩' },
    { name: 'Child Helpline', number: '1098', icon: '🧒' },
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
          className={`relative w-32 h-32 rounded-full mx-auto flex items-center justify-center text-2xl font-bold ${isSosActive
              ? 'bg-risk-critical text-white animate-pulse'
              : 'bg-gradient-to-br from-risk-critical to-risk-high text-white'
            }`}
        >
          {isSosActive ? 'SENDING...' : 'SOS'}
        </button>

        <p className="mt-4 text-sm text-muted-foreground">
          {alertSent ? '✓ Alerts sent to trusted contacts' : 'Press to alert contacts'}
        </p>

        {userLocation && alertSent && (
          <div className="mt-2 text-xs text-muted-foreground flex justify-center gap-2">
            <MapPin className="w-3 h-3" />
            {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}
          </div>
        )}
      </div>
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
      {/* </div> */}
      {/* Trusted Contacts */}
      <div className="glass-panel p-4">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <Users className="w-4 h-4 text-primary" />
          Trusted Contacts
        </h3>

        {/* Add / Edit Contact Form */}
        <div className="mb-5 p-4 rounded-xl border border-border/40 bg-secondary/30">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">

            {/* Name */}
            <div className="relative">
              <Users className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
              <input
                placeholder="Contact name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full pl-10 pr-3 py-2 rounded-lg   border bg-background border-border/40 focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            {/* Phone */}
            <div className="relative">
              <Phone className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
              <input
                placeholder="Phone number"
                inputMode='numeric'
                pattern='[0-9]*'
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value.replace(/[^0-9]/g, '') })}
                className="w-full pl-10 pr-3 py-2 rounded-lg bg-background/60 border border-border/40 focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            {/* Relationship */}
            <div className="relative">
              <MessageSquare className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
              <input
                placeholder="Relationship (Parent, Friend…)"
                value={form.relationship}
                onChange={(e) => setForm({ ...form, relationship: e.target.value })}
                className="w-full pl-10 pr-3 py-2 rounded-lg bg-background/60 border border-border/40 focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          <div className="flex justify-end mt-4">
            <button
              onClick={handleAddOrUpdate}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${editingContact
                  ? 'bg-primary text-white hover:bg-primary/90'
                  : 'bg-risk-safe text-white hover:bg-risk-safe/90'
                }`}
            >
              <Plus className="w-4 h-4" />
              {editingContact ? 'Update Contact' : 'Add Contact'}
            </button>
          </div>
        </div>

        {/* Contact List */}
        <div className="space-y-3">
          {contacts.map((contact) => (
            <div
              key={contact.id}
              className="flex items-center justify-between p-4 rounded-xl bg-secondary/40 border border-border/40 hover:bg-secondary/60 transition"
            >
              {/* Contact Info */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold">
                  {contact.name.charAt(0)}
                </div>
                <div>
                  <div className="font-medium leading-tight">{contact.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {contact.relationship || 'Trusted Contact'}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <a
                  href={`tel:${contact.phone}`}
                  className="p-2 rounded-lg bg-risk-safe/20 text-risk-safe hover:bg-risk-safe/30 transition"
                >
                  <Phone className="w-4 h-4" />
                </a>

                <a
                  href={`sms:${contact.phone}`}
                  className="p-2 rounded-lg bg-primary/20 text-primary hover:bg-primary/30 transition"
                >
                  <MessageSquare className="w-4 h-4" />
                </a>

                <button
                  onClick={() => handleEdit(contact)}
                  className="p-2 rounded-lg bg-secondary hover:bg-secondary/80 transition"
                >
                  <Edit className="w-4 h-4" />
                </button>

                <button
                  onClick={() => handleDelete(contact.id)}
                  className="p-2 rounded-lg bg-risk-critical/20 text-risk-critical hover:bg-risk-critical/30 transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </section>
  );
}
