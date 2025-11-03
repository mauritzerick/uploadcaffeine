'use client'

import React, { createContext, useContext } from 'react'
import { useFeatureFlags } from '@/hooks/useFeatureFlags'
import type { FeatureFlag } from '@/hooks/useFeatureFlags'

interface FeatureFlagsContextValue {
  flags: FeatureFlag[]
  isEnabled: (key: string) => boolean
  getFlag: (key: string) => FeatureFlag | undefined
  isLoading: boolean
  isError: any
  refresh: () => void
}

const FeatureFlagsContext = createContext<FeatureFlagsContextValue | undefined>(
  undefined
)

export function FeatureFlagsProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const featureFlags = useFeatureFlags()

  return (
    <FeatureFlagsContext.Provider value={featureFlags}>
      {children}
    </FeatureFlagsContext.Provider>
  )
}

export function useFeatureFlagsContext() {
  const context = useContext(FeatureFlagsContext)
  if (context === undefined) {
    throw new Error(
      'useFeatureFlagsContext must be used within a FeatureFlagsProvider'
    )
  }
  return context
}


