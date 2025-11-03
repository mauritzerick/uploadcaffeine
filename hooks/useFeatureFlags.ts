import useSWR from 'swr'

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export interface FeatureFlag {
  key: string
  name: string
  description?: string
  enabled: boolean
  jsonConfig?: any
  updatedAt: string
}

export interface FeatureFlagsResponse {
  flags: FeatureFlag[]
}

// Default flags as fallback if API fails
const DEFAULT_FLAGS: Record<string, boolean> = {
  terminal_console: true,
  device_hologram: true,
  matrix_rain: true,
  ai_agents: true,
  particle_effects: true,
  neon_radio: true,
}

export function useFeatureFlags() {
  const { data, error, mutate } = useSWR<FeatureFlagsResponse>(
    '/api/flags',
    fetcher,
    {
      refreshInterval: 30000, // Poll every 30 seconds
      revalidateOnFocus: true,
      fallbackData: {
        flags: Object.entries(DEFAULT_FLAGS).map(([key, enabled]) => ({
          key,
          name: key.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
          enabled,
          updatedAt: new Date().toISOString(),
        })),
      },
    }
  )

  const flags = data?.flags || []

  /**
   * Check if a specific feature is enabled
   * @param key Feature flag key
   * @returns Boolean indicating if feature is enabled
   */
  const isEnabled = (key: string): boolean => {
    const flag = flags.find((f) => f.key === key)
    if (flag) {
      return flag.enabled
    }
    // Fallback to default if not found
    return DEFAULT_FLAGS[key] ?? false
  }

  /**
   * Get a specific feature flag
   * @param key Feature flag key
   * @returns Feature flag object or undefined
   */
  const getFlag = (key: string): FeatureFlag | undefined => {
    return flags.find((f) => f.key === key)
  }

  return {
    flags,
    isEnabled,
    getFlag,
    isLoading: !error && !data,
    isError: error,
    refresh: mutate,
  }
}


