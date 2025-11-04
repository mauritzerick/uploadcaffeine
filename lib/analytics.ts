// Strongly-typed analytics event system

export type EventMap = {
  // Core events
  page_view: { path?: string; experiment?: string; variant?: string };
  cta_click: { tier?: string; amount?: number; location?: string; action?: string; platform?: string; variant?: string };
  
  // Checkout flow
  checkout_start: { amount: number; monthly: boolean; method?: string };
  checkout_success: { amount?: number; method?: string; experiment?: string; variant?: string };
  payment_failed: { error: string; amount: number };
  payment_error: { error: string; amount: number };
  
  // Coffee selection
  coffee_type_selected: { type: string };
  
  // Glitch effects
  glitch_agent_click: { intensity: string };
  glitch_effect_start: { intensity: string };
  glitch_effect_end: { intensity: string };
  cursor_trail_toggle: { enabled: boolean };
  kaleidoscope_on: Record<string, never>;
  time_warp_on: { intensity: string };
  time_warp_off: { intensity: string };
  
  // Radio/Media
  radio_open: Record<string, never>;
  radio_close: Record<string, never>;
  radio_play: { track: string };
  radio_pause: { track: string };
  radio_next: { track: string };
  radio_prev: { track: string };
  radio_volume_change: { volume: number };
  radio_playlist_change: { playlist: string };
  
  // Effects
  bean_rain_emit: { intensity: string; count: number };
  
  // UI Components
  hologram_open: Record<string, never>;
  hologram_autoclose: Record<string, never>;
  hologram_close: Record<string, never>;
  terminal_open: Record<string, never>;
  terminal_close: Record<string, never>;
  terminal_cmd_invoke: { command: string; args?: string[] };
};

export type EventType = keyof EventMap;

export async function trackEvent<T extends EventType>(
  event: T,
  props: EventMap[T]
): Promise<void> {
  try {
    await fetch('/api/track', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: event,
        metadata: props,
      }),
    })
  } catch (error) {
    // Silently fail - don't break user experience
    if (process.env.NODE_ENV === 'development') {
      console.error('[analytics] Failed to track event:', event, error)
    }
  }
}

// A/B testing utilities
export function getVariant(experimentName: string): 'a' | 'b' {
  if (typeof window === 'undefined') return 'a'
  
  // Check if variant already stored in cookie/localStorage
  const stored = localStorage.getItem(`experiment_${experimentName}`)
  if (stored === 'a' || stored === 'b') {
    return stored
  }

  // Randomly assign variant
  const variant = Math.random() < 0.5 ? 'a' : 'b'
  localStorage.setItem(`experiment_${experimentName}`, variant)
  
  return variant
}

export function trackVariantConversion(experimentName: string, variant: 'a' | 'b') {
  // Store conversion in localStorage (could also send to backend)
  if (typeof window !== 'undefined') {
    localStorage.setItem(`experiment_${experimentName}_converted`, 'true')
    
    // Track the conversion event
    trackEvent('checkout_success', {
      experiment: experimentName,
      variant,
    })
  }
}
