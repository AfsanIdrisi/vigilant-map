import { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Shield,
  AlertTriangle,
  Navigation,
  MapPin,
  Siren,
} from "lucide-react";

type Feature = {
  id: string;
  title: string;
  icon: any;
  description: string;
  steps: string[];
};

export default function FeatureGuideSection() {
  const [openId, setOpenId] = useState<string | null>("risk-map");

  const features: Feature[] = [
    {
      id: "risk-map",
      title: "Risk Map & Nearby Incidents",
      icon: AlertTriangle,
      description:
        "Visualize crime-prone areas and nearby incidents around your current location.",
      steps: [
        "Open the Risk Map section.",
        "Your current location is shown on the map.",
        "Colored markers indicate crime incidents based on severity.",
        "Only incidents within 1.5 km radius are displayed.",
        "Tap on any marker to see incident details.",
        "Scroll below the map to view the incident list.",
      ],
    },
    {
      id: "sos",
      title: "SOS & Emergency Assistance",
      icon: Siren,
      description:
        "Instant emergency response with trusted contacts and official helplines.",
      steps: [
        "Add trusted contacts with phone numbers.",
        "These contacts are saved locally on your device.",
        "Press the SOS button during an emergency.",
        "Your live location is shared via SMS to all contacts.",
        "You can directly call Police, Ambulance, Fire, or Helplines.",
      ],
    },
    {
      id: "routes",
      title: "Safe & Smart Route Planning",
      icon: Navigation,
      description:
        "Plan routes based on safety, speed, and nearby crime data.",
      steps: [
        "Select a start location on the map.",
        "Select a destination point.",
        "Multiple routes are generated automatically.",
        "Routes are tagged as Safest or Fastest.",
        "Crime incidents near routes affect safety ranking.",
        "Click Directions to open the route in Google Maps.",
      ],
    },
    {
      id: "safe-places",
      title: "Nearby Safe Places",
      icon: Shield,
      description:
        "Find essential safe locations near you during emergencies.",
      steps: [
        "Open the Safe Places section.",
        "Nearby police stations, hospitals, and shelters are shown.",
        "Results are fetched based on your current location.",
        "Distance from your location is displayed.",
        "Use Directions to navigate instantly.",
      ],
    },
  ];

  return (
    <section className="glass-panel p-5 space-y-4">
      <h2 className="text-lg font-semibold flex items-center gap-2">
        <MapPin className="w-5 h-5 text-primary" />
        How Vigilant Map Keeps You Safe
      </h2>

      <div className="space-y-3">
        {features.map((feature) => {
          const Icon = feature.icon;
          const isOpen = openId === feature.id;

          return (
            <div
              key={feature.id}
              className="rounded-xl border border-border/40 bg-secondary/30 overflow-hidden"
            >
              {/* Header */}
              <button
                onClick={() =>
                  setOpenId(isOpen ? null : feature.id)
                }
                className="w-full flex items-center justify-between p-4"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/15 text-primary">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium">{feature.title}</div>
                    <div className="text-xs text-muted-foreground">
                      {feature.description}
                    </div>
                  </div>
                </div>

                {isOpen ? (
                  <ChevronUp className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                )}
              </button>

              {/* Content */}
              {isOpen && (
                <div className="px-5 pb-4 animate-fade-in">
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    {feature.steps.map((step, index) => (
                      <li key={index} className="flex gap-2">
                        <span className="text-primary font-semibold">
                          {index + 1}.
                        </span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
