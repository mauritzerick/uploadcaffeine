'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Zap, X } from 'lucide-react'
import { useFeatureFlagsContext } from '@/providers/FeatureFlagsProvider'
import { useGlitchEffects } from '@/hooks/useGlitchEffects'
import { trackEvent } from '@/lib/analytics'
import BeanRain from './effects/BeanRain'
import ScreenFracture from './effects/ScreenFracture'
import CursorTrail from './effects/CursorTrail'
import KaleidoscopeLayer from './effects/KaleidoscopeLayer'

export default function GlitchAgent() {
  const { isEnabled, getFlag } = useFeatureFlagsContext()
  const { glitchState, timeWarpActive, triggerGlitch, triggerTimeWarp } = useGlitchEffects()
  
  const [showMenu, setShowMenu] = useState(false)
  const [cursorTrailEnabled, setCursorTrailEnabled] = useState(false)
  const [fractureTriggered, setFractureTriggered] = useState(false)
  const [beanRainTriggered, setBeanRainTriggered] = useState(false)
  const [kaleidoscopeTriggered, setKaleidoscopeTriggered] = useState(false)
  const [spaceHoldStart, setSpaceHoldStart] = useState<number | null>(null)

  const glitchIntensity = (getFlag('effect_glitch_cinematic')?.intensity as 'low' | 'med' | 'high') || 'med'

  const handleGlitchClick = useCallback(() => {
    if (!isEnabled('effect_glitch_cinematic')) return
    
    const success = triggerGlitch(glitchIntensity)
    if (success) {
      trackEvent('glitch_agent_click', { intensity: glitchIntensity })
      
      // Trigger particle bursts for chaos
      setBeanRainTriggered(true)
      setTimeout(() => setBeanRainTriggered(false), 100)
      
      // Also trigger fracture if enabled
      if (isEnabled('effect_screen_fracture')) {
        setFractureTriggered(true)
        setTimeout(() => setFractureTriggered(false), 100)
      }
    }
  }, [isEnabled, triggerGlitch, glitchIntensity])

  const toggleCursorTrail = useCallback(() => {
    if (!isEnabled('cursor_afterimage')) return
    setCursorTrailEnabled(prev => !prev)
    trackEvent('cursor_trail_toggle', { enabled: !cursorTrailEnabled })
  }, [isEnabled, cursorTrailEnabled])

  const triggerKaleidoscope = useCallback(() => {
    if (!isEnabled('kaleidoscope_mode')) return
    setKaleidoscopeTriggered(true)
    setTimeout(() => setKaleidoscopeTriggered(false), 100)
    trackEvent('kaleidoscope_on', {})
  }, [isEnabled])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // G key - trigger glitch
      if (e.key.toLowerCase() === 'g' && !e.ctrlKey && !e.metaKey && !e.altKey) {
        const target = e.target as HTMLElement
        if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA' && !target.isContentEditable) {
          e.preventDefault()
          handleGlitchClick()
        }
      }

      // Space hold - time warp
      if (e.key === ' ' && !spaceHoldStart) {
        const target = e.target as HTMLElement
        if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA' && !target.isContentEditable) {
          setSpaceHoldStart(Date.now())
        }
      }

      // ESC - close menu
      if (e.key === 'Escape' && showMenu) {
        setShowMenu(false)
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === ' ' && spaceHoldStart) {
        const holdDuration = Date.now() - spaceHoldStart
        setSpaceHoldStart(null)

        if (holdDuration >= 800 && isEnabled('effect_time_warp')) {
          triggerTimeWarp()
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [handleGlitchClick, spaceHoldStart, isEnabled, triggerTimeWarp, showMenu])

  const cooldownProgress = glitchState.cooldownRemaining / 6000

  // Check if agent should be visible (after all hooks)
  if (!isEnabled('glitch_agent')) return null

  return (
    <>
      {/* Glitch Agent Button */}
      <motion.div
        className="fixed top-4 right-4 z-[10000]"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200 }}
      >
        <motion.button
          onClick={handleGlitchClick}
          onContextMenu={(e) => {
            e.preventDefault()
            setShowMenu(prev => !prev)
          }}
          disabled={glitchState.cooldownRemaining > 0}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="relative w-14 h-14 rounded-full bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            boxShadow: glitchState.isActive
              ? '0 0 40px rgba(0, 255, 255, 1)'
              : '0 0 20px rgba(0, 255, 255, 0.6)',
          }}
          aria-label="Trigger glitch effect"
          aria-pressed={glitchState.isActive}
        >
          {/* Cooldown ring */}
          {glitchState.cooldownRemaining > 0 && (
            <svg className="absolute inset-0 w-full h-full -rotate-90">
              <circle
                cx="50%"
                cy="50%"
                r="26"
                fill="none"
                stroke="rgba(255, 255, 255, 0.3)"
                strokeWidth="3"
                strokeDasharray={`${163 * (1 - cooldownProgress)} 163`}
                className="transition-all duration-100"
              />
            </svg>
          )}

          <motion.div
            animate={glitchState.isActive ? { rotate: 360 } : { rotate: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Zap className="w-7 h-7 text-white" style={{ filter: 'drop-shadow(0 0 10px rgba(255, 255, 255, 0.8))' }} />
          </motion.div>

          {/* Pulsing ring */}
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-cyan-400"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.5, 0, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
          />
        </motion.button>

        {/* Tooltip */}
        {!showMenu && (
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-3 py-2 bg-gray-900 border border-cyan-500/50 rounded-lg whitespace-nowrap pointer-events-none"
          >
            <div className="text-xs text-cyan-400 font-mono uppercase">
              {glitchState.cooldownRemaining > 0
                ? `Cooldown: ${Math.ceil(glitchState.cooldownRemaining / 1000)}s`
                : 'Press G or Click'}
            </div>
          </motion.div>
        )}

        {/* Context Menu */}
        <AnimatePresence>
          {showMenu && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -10 }}
              className="absolute top-full right-0 mt-2 w-64 bg-gradient-to-br from-gray-900 to-gray-800 border-2 border-cyan-500/50 rounded-xl p-4 shadow-2xl"
              style={{
                boxShadow: '0 0 30px rgba(0, 255, 255, 0.3)',
              }}
            >
              <button
                onClick={() => setShowMenu(false)}
                className="absolute top-2 right-2 p-1 text-cyan-400 hover:text-cyan-300"
              >
                <X className="w-4 h-4" />
              </button>

              <h3 className="text-cyan-400 font-bold text-sm uppercase tracking-wider mb-3">
                Glitch Controls
              </h3>

              <div className="space-y-2">
                <button
                  onClick={() => {
                    handleGlitchClick()
                    setShowMenu(false)
                  }}
                  disabled={!isEnabled('effect_glitch_cinematic') || glitchState.cooldownRemaining > 0}
                  className="w-full text-left px-3 py-2 bg-gray-800/50 hover:bg-gray-700/50 text-cyan-100 text-sm rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  ⚡ Trigger Glitch Now
                </button>

                <button
                  onClick={toggleCursorTrail}
                  disabled={!isEnabled('cursor_afterimage')}
                  className={`w-full text-left px-3 py-2 bg-gray-800/50 hover:bg-gray-700/50 text-cyan-100 text-sm rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${
                    cursorTrailEnabled ? 'ring-2 ring-cyan-400' : ''
                  }`}
                >
                  ✨ Cursor Trail {cursorTrailEnabled ? 'ON' : 'OFF'}
                </button>

                <button
                  onClick={triggerKaleidoscope}
                  disabled={!isEnabled('kaleidoscope_mode')}
                  className="w-full text-left px-3 py-2 bg-gray-800/50 hover:bg-gray-700/50 text-cyan-100 text-sm rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  🔮 Kaleidoscope
                </button>

                <div className="pt-2 border-t border-cyan-500/30 mt-2">
                  <p className="text-cyan-400/60 text-xs font-mono">
                    G = Glitch • Hold Space = Time Warp
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Effects */}
      <CursorTrail enabled={cursorTrailEnabled} />
      <ScreenFracture trigger={fractureTriggered} />
      <BeanRain trigger={beanRainTriggered} />
      <KaleidoscopeLayer trigger={kaleidoscopeTriggered} />
    </>
  )
}

