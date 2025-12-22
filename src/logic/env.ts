/**
 * Environment detection and configuration
 * Pure functions - framework agnostic
 */

interface EnvConfig {
  mapApiKey: string | null;
  routingApiKey: string | null;
  aiApiKey: string | null;
  smsApiKey: string | null;
  isApiModeEnabled: boolean;
}

export function getEnvConfig(): EnvConfig {
  const mapApiKey = import.meta.env.VITE_MAP_API_KEY || null;
  const routingApiKey = import.meta.env.VITE_ROUTING_API_KEY || null;
  const aiApiKey = import.meta.env.VITE_AI_API_KEY || null;
  const smsApiKey = import.meta.env.VITE_SMS_API_KEY || null;

  const hasAnyApiKey = !!(mapApiKey || routingApiKey || aiApiKey || smsApiKey);

  if (hasAnyApiKey) {
    console.log("API MODE ENABLED");
  }

  return {
    mapApiKey,
    routingApiKey,
    aiApiKey,
    smsApiKey,
    isApiModeEnabled: hasAnyApiKey,
  };
}

export function hasMapApi(): boolean {
  return !!import.meta.env.VITE_MAP_API_KEY;
}

export function hasRoutingApi(): boolean {
  return !!import.meta.env.VITE_ROUTING_API_KEY;
}

export function hasAiApi(): boolean {
  return !!import.meta.env.VITE_AI_API_KEY;
}

export function hasSmsApi(): boolean {
  return !!import.meta.env.VITE_SMS_API_KEY;
}
