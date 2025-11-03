export interface EffectConfig {
  intensity: {
    low: number
    med: number
    high: number
  }
  duration: number
  cooldown?: number
}

export const EFFECTS_CONFIG = {
  glitch: {
    intensity: {
      low: 0.6,
      med: 1.0,
      high: 1.4,
    },
    duration: 900, // ms
    cooldown: 6000, // ms
  },
  fracture: {
    intensity: {
      low: 0.5,
      med: 1.0,
      high: 1.5,
    },
    duration: 350, // ms
  },
  beanRain: {
    intensity: {
      low: 20, // particle count
      med: 40,
      high: 60,
    },
    duration: 1500, // ms
  },
  timeWarp: {
    intensity: {
      low: 0.7, // speed multiplier
      med: 0.5,
      high: 0.3,
    },
    duration: 1500, // ms
  },
  kaleidoscope: {
    intensity: {
      low: 2, // mirror count
      med: 4,
      high: 6,
    },
    duration: 5000, // ms
  },
  cursorTrail: {
    intensity: {
      low: 8, // trail length (increased for more visibility)
      med: 15,
      high: 25,
    },
    duration: 0, // continuous
  },
} as const

export type EffectType = keyof typeof EFFECTS_CONFIG
export type IntensityLevel = 'low' | 'med' | 'high'

