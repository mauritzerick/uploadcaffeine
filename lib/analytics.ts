// Client-side analytics helper

type EventType = 'cta_click' | 'checkout_start' | 'checkout_success' | 'page_view'

export async function trackEvent(type: EventType, metadata?: Record<string, any>) {
  try {
    await fetch('/api/track', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type,
        metadata,
      }),
    })
  } catch (error) {
    // Silently fail - don't break user experience
    console.error('Failed to track event:', error)
  }
}

// A/B testing utilities
export function getVariant(experimentName: string): 'a' | 'b' {
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
  localStorage.setItem(`experiment_${experimentName}_converted`, 'true')
  
  // Track the conversion event
  trackEvent('checkout_success', {
    experiment: experimentName,
    variant,
  })
}


