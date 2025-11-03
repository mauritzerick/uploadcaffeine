import { useState, useCallback, useEffect, useRef } from 'react'
import { EFFECTS_CONFIG, IntensityLevel } from '@/lib/effectsConfig'
import { trackEvent } from '@/lib/analytics'

interface EffectState {
  isActive: boolean
  lastTriggered: number
  cooldownRemaining: number
}

export function useGlitchEffects() {
  const [glitchState, setGlitchState] = useState<EffectState>({
    isActive: false,
    lastTriggered: 0,
    cooldownRemaining: 0,
  })

  const [timeWarpActive, setTimeWarpActive] = useState(false)
  const cooldownIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const timeWarpTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (cooldownIntervalRef.current) {
        clearInterval(cooldownIntervalRef.current)
      }
      if (timeWarpTimeoutRef.current) {
        clearTimeout(timeWarpTimeoutRef.current)
      }
    }
  }, [])

  const triggerGlitch = useCallback((intensity: IntensityLevel = 'med') => {
    const now = Date.now()
    const config = EFFECTS_CONFIG.glitch
    const cooldown = config.cooldown || 0

    // Check cooldown
    if (glitchState.cooldownRemaining > 0) {
      console.log('⏳ Glitch on cooldown')
      return false
    }

    // Check reduced motion preference
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      console.log('♿ Reduced motion: glitch disabled')
      return false
    }

    // Trigger effect
    setGlitchState({
      isActive: true,
      lastTriggered: now,
      cooldownRemaining: cooldown,
    })

    trackEvent('glitch_effect_start', { intensity })

    // Add effect class to body
    document.body.classList.add('fx-glitch')
    document.body.setAttribute('data-glitch-intensity', intensity)

    // Remove after duration
    setTimeout(() => {
      document.body.classList.remove('fx-glitch')
      document.body.removeAttribute('data-glitch-intensity')
      setGlitchState(prev => ({ ...prev, isActive: false }))
      trackEvent('glitch_effect_end', { intensity })
    }, config.duration)

    // Start cooldown countdown
    if (cooldownIntervalRef.current) {
      clearInterval(cooldownIntervalRef.current)
    }

    cooldownIntervalRef.current = setInterval(() => {
      setGlitchState(prev => {
        const newRemaining = Math.max(0, cooldown - (Date.now() - now))
        if (newRemaining === 0 && cooldownIntervalRef.current) {
          clearInterval(cooldownIntervalRef.current)
          cooldownIntervalRef.current = null
        }
        return {
          ...prev,
          cooldownRemaining: newRemaining,
        }
      })
    }, 100)

    return true
  }, [glitchState.cooldownRemaining])

  const triggerTimeWarp = useCallback((intensity: IntensityLevel = 'med') => {
    if (timeWarpActive) return false

    // Check reduced motion
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return false
    }

    const config = EFFECTS_CONFIG.timeWarp

    setTimeWarpActive(true)
    document.body.classList.add('fx-time-warp')
    document.body.setAttribute('data-warp-intensity', intensity)

    trackEvent('time_warp_on', { intensity })

    if (timeWarpTimeoutRef.current) {
      clearTimeout(timeWarpTimeoutRef.current)
    }

    timeWarpTimeoutRef.current = setTimeout(() => {
      document.body.classList.remove('fx-time-warp')
      document.body.removeAttribute('data-warp-intensity')
      setTimeWarpActive(false)
      trackEvent('time_warp_off', { intensity })
    }, config.duration)

    return true
  }, [timeWarpActive])

  return {
    glitchState,
    timeWarpActive,
    triggerGlitch,
    triggerTimeWarp,
  }
}


