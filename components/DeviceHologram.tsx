'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Monitor, Smartphone, Globe, Clock, Zap, Battery } from 'lucide-react'
import { trackEvent } from '@/lib/analytics'

interface DeviceInfo {
  browser: string
  os: string
  viewport: string
  pixelRatio: number
  locale: string
  timezone: string
  reducedMotion: boolean
}

interface DeviceHologramProps {
  children?: React.ReactNode
}

export default function DeviceHologram({ children }: DeviceHologramProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo | null>(null)
  const [autoCloseTimer, setAutoCloseTimer] = useState<NodeJS.Timeout | null>(null)

  useEffect(() => {
    // Gather device information (client-side only)
    if (typeof window !== 'undefined') {
      const ua = navigator.userAgent
      let browser = 'Unknown'
      let os = 'Unknown'

      // Detect browser
      if (ua.includes('Firefox')) browser = 'Firefox'
      else if (ua.includes('Chrome')) browser = 'Chrome'
      else if (ua.includes('Safari') && !ua.includes('Chrome')) browser = 'Safari'
      else if (ua.includes('Edge')) browser = 'Edge'

      // Detect OS
      if (ua.includes('Windows')) os = 'Windows'
      else if (ua.includes('Mac')) os = 'macOS'
      else if (ua.includes('Linux')) os = 'Linux'
      else if (ua.includes('Android')) os = 'Android'
      else if (ua.includes('iOS') || ua.includes('iPhone') || ua.includes('iPad')) os = 'iOS'

      const info: DeviceInfo = {
        browser,
        os,
        viewport: `${window.innerWidth}×${window.innerHeight}`,
        pixelRatio: window.devicePixelRatio,
        locale: Intl.DateTimeFormat().resolvedOptions().locale,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
      }

      setDeviceInfo(info)
    }

    // Listen for custom event to toggle hologram
    const handleToggle = () => {
      setIsVisible((prev) => !prev)
    }

    window.addEventListener('toggle-hologram', handleToggle as EventListener)

    return () => {
      window.removeEventListener('toggle-hologram', handleToggle as EventListener)
    }
  }, [])

  const handleOpen = () => {
    setIsVisible(true)
    trackEvent('hologram_open', {})

    // Auto-close after 6 seconds
    const timer = setTimeout(() => {
      setIsVisible(false)
      trackEvent('hologram_autoclose', {})
    }, 6000)
    
    setAutoCloseTimer(timer)
  }

  const handleClose = () => {
    setIsVisible(false)
    trackEvent('hologram_close', {})
    if (autoCloseTimer) {
      clearTimeout(autoCloseTimer)
    }
  }

  useEffect(() => {
    return () => {
      if (autoCloseTimer) {
        clearTimeout(autoCloseTimer)
      }
    }
  }, [autoCloseTimer])

  if (!deviceInfo) return null

  const getStatusChip = () => {
    if (deviceInfo.reducedMotion) {
      return { label: 'Stable', color: 'from-blue-500 to-cyan-500', icon: Battery }
    } else if (deviceInfo.pixelRatio > 2) {
      return { label: 'Overclocked', color: 'from-purple-500 to-pink-500', icon: Zap }
    } else {
      return { label: 'Optimal', color: 'from-green-500 to-emerald-500', icon: Zap }
    }
  }

  const status = getStatusChip()
  const StatusIcon = status.icon

  return (
    <div
      onMouseEnter={handleOpen}
      onMouseLeave={handleClose}
      className="relative inline-block"
    >
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-4 z-50 pointer-events-none"
          >
            <div
              className="relative bg-gradient-to-br from-gray-900/95 to-gray-800/95 backdrop-blur-md border-2 border-cyan-500 rounded-xl p-6 shadow-2xl min-w-[320px]"
              style={{
                boxShadow: '0 0 40px rgba(0, 255, 255, 0.4), inset 0 0 20px rgba(0, 255, 255, 0.1)',
              }}
            >
              {/* Scan Grid Background */}
              <div className="absolute inset-0 overflow-hidden rounded-xl pointer-events-none">
                <div className="absolute inset-0 grid-bg opacity-20" />
                
                {/* Sweep Scanner Line */}
                <motion.div
                  className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent"
                  initial={{ top: 0, opacity: 0 }}
                  animate={{
                    top: ['0%', '100%', '0%'],
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: 'linear',
                  }}
                  style={{
                    boxShadow: '0 0 10px rgba(0, 255, 255, 0.8)',
                  }}
                />

                {/* Floating Particles */}
                {[...Array(8)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1 h-1 rounded-full bg-cyan-400"
                    initial={{
                      x: Math.random() * 300,
                      y: Math.random() * 200,
                      opacity: 0,
                    }}
                    animate={{
                      x: [
                        Math.random() * 300,
                        Math.random() * 300,
                        Math.random() * 300,
                      ],
                      y: [
                        Math.random() * 200,
                        Math.random() * 200,
                        Math.random() * 200,
                      ],
                      opacity: [0, 0.8, 0],
                    }}
                    transition={{
                      duration: 2 + Math.random() * 2,
                      repeat: Infinity,
                      delay: Math.random() * 2,
                    }}
                    style={{
                      filter: 'blur(1px) drop-shadow(0 0 3px rgba(0, 255, 255, 0.8))',
                    }}
                  />
                ))}
              </div>

              {/* Content */}
              <div className="relative z-10">
                {/* Header */}
                <div className="flex items-center gap-3 mb-4">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                    className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-full flex items-center justify-center"
                    style={{ boxShadow: '0 0 20px rgba(0, 255, 255, 0.6)' }}
                  >
                    {deviceInfo.os.includes('iOS') || deviceInfo.os.includes('Android') ? (
                      <Smartphone className="w-6 h-6 text-white" />
                    ) : (
                      <Monitor className="w-6 h-6 text-white" />
                    )}
                  </motion.div>
                  <div>
                    <h4 className="text-cyan-400 font-bold text-sm uppercase tracking-wider">
                      Device Scan
                    </h4>
                    <p className="text-gray-400 text-xs font-mono">
                      Holographic Analysis
                    </p>
                  </div>
                </div>

                {/* Device Info Rows */}
                <div className="space-y-2">
                  <InfoRow
                    icon={<Globe className="w-4 h-4" />}
                    label="Browser"
                    value={deviceInfo.browser}
                  />
                  <InfoRow
                    icon={<Monitor className="w-4 h-4" />}
                    label="OS"
                    value={deviceInfo.os}
                  />
                  <InfoRow
                    icon={<Monitor className="w-4 h-4" />}
                    label="Viewport"
                    value={deviceInfo.viewport}
                  />
                  <InfoRow
                    icon={<Zap className="w-4 h-4" />}
                    label="Pixel Ratio"
                    value={`${deviceInfo.pixelRatio}x`}
                  />
                  <InfoRow
                    icon={<Globe className="w-4 h-4" />}
                    label="Locale"
                    value={deviceInfo.locale}
                  />
                  <InfoRow
                    icon={<Clock className="w-4 h-4" />}
                    label="Timezone"
                    value={deviceInfo.timezone}
                  />
                </div>

                {/* Status Chip */}
                <div className="mt-4 pt-4 border-t border-cyan-500/30">
                  <motion.div
                    animate={{
                      boxShadow: [
                        '0 0 15px rgba(0, 255, 255, 0.4)',
                        '0 0 25px rgba(0, 255, 255, 0.6)',
                        '0 0 15px rgba(0, 255, 255, 0.4)',
                      ],
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r ${status.color} text-white text-xs font-bold uppercase tracking-wider`}
                  >
                    <StatusIcon className="w-3 h-3" />
                    {status.label}
                  </motion.div>
                </div>
              </div>

              {/* Arrow */}
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-4 h-4 bg-gray-900 border-b-2 border-r-2 border-cyan-500 rotate-45" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {children}
    </div>
  )
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string
}) {
  return (
    <div className="flex items-center gap-2 text-sm">
      <div className="text-cyan-400">{icon}</div>
      <span className="text-gray-400 font-mono min-w-[80px]">{label}:</span>
      <span className="text-cyan-100 font-mono flex-1 text-right truncate">
        {value}
      </span>
    </div>
  )
}

