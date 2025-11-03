'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { QrCode, X } from 'lucide-react'

export default function QRCodeBanner() {
  const [isDesktopVisible, setIsDesktopVisible] = useState(true)
  const [isMobileModalOpen, setIsMobileModalOpen] = useState(false)
  const [qrCodeUrl, setQrCodeUrl] = useState('')

  useEffect(() => {
    // Generate QR code URL using QR Server API (free, no API key needed)
    const siteUrl = 'https://uploadcaffeine.com'
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(siteUrl)}&bgcolor=0a0a14&color=00ffff`
    setQrCodeUrl(qrUrl)
  }, [])

  return (
    <>
      {/* Desktop: Bottom Right Corner */}
      {isDesktopVisible && (
        <motion.div
          key="desktop-qr"
          initial={{ opacity: 0, scale: 0.8, x: 100 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          exit={{ opacity: 0, scale: 0.8, x: 100 }}
          className="fixed bottom-8 right-8 z-50 hidden md:block"
        >
        <div className="relative group">
          {/* Close button */}
          <motion.button
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsDesktopVisible(false)}
            className="absolute -top-2 -right-2 w-7 h-7 flex items-center justify-center rounded-full bg-gray-900 border-2 border-cyan-500 hover:bg-cyan-500/20 transition-colors z-10 shadow-lg"
            aria-label="Close QR code"
          >
            <X className="w-4 h-4 text-cyan-400" />
          </motion.button>

          {/* QR Card */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl p-4 border-2 border-cyan-500/50 shadow-2xl cursor-pointer"
            style={{ boxShadow: '0 0 40px rgba(0, 255, 255, 0.3)' }}
            onClick={() => window.open('https://uploadcaffeine.com', '_blank')}
          >
            {/* Animated pulse ring */}
            <motion.div
              className="absolute inset-0 rounded-2xl border-2 border-cyan-400"
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.5, 0, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />

            {/* QR Code */}
            <div className="relative w-32 h-32 bg-white rounded-xl p-2">
              {qrCodeUrl ? (
                <img
                  src={qrCodeUrl}
                  alt="Scan to visit uploadcaffeine.com"
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <QrCode className="w-16 h-16 text-cyan-500 animate-pulse" />
                </div>
              )}
            </div>

            {/* Text */}
            <div className="mt-3 text-center">
              <p className="text-cyan-400 font-bold text-sm">Scan Me!</p>
              <p className="text-cyan-100/60 text-xs mt-1">Visit on mobile</p>
            </div>

            {/* Glow effect */}
            <div className="absolute inset-0 bg-cyan-500/10 rounded-2xl blur-2xl -z-10 group-hover:bg-cyan-500/20 transition-all" />
          </motion.div>
        </div>
      </motion.div>
      )}

      {/* Mobile: Floating Button to Open Modal */}
      <motion.button
        key="mobile-qr-button"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsMobileModalOpen(true)}
        className="fixed bottom-6 right-6 z-50 md:hidden w-16 h-16 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-full flex items-center justify-center shadow-2xl border-2 border-cyan-400/50"
        style={{ boxShadow: '0 0 30px rgba(0, 255, 255, 0.5)' }}
        aria-label="Open QR code"
      >
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
        >
          <QrCode className="w-8 h-8 text-white" />
        </motion.div>
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-cyan-400"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.5, 0, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </motion.button>

      {/* Mobile: Full-Screen Modal */}
      <AnimatePresence>
        {isMobileModalOpen && (
          <motion.div
            key="mobile-qr-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md md:hidden"
            onClick={() => setIsMobileModalOpen(false)}
          >
            {/* Close button */}
            <motion.button
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.stopPropagation()
                setIsMobileModalOpen(false)
              }}
              className="absolute top-6 right-6 w-12 h-12 flex items-center justify-center rounded-full bg-gray-900 border-2 border-cyan-500 hover:bg-cyan-500/20 transition-colors z-10 shadow-lg"
              aria-label="Close QR code"
            >
              <X className="w-6 h-6 text-cyan-400" />
            </motion.button>

            {/* QR Code Content - Centered */}
            <div className="flex items-center justify-center min-h-screen p-8">
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 50 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: 50 }}
                transition={{ type: 'spring', damping: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="relative bg-gradient-to-br from-gray-900 via-cyan-900/30 to-purple-900/30 rounded-3xl p-8 border-2 border-cyan-500 max-w-sm w-full"
                style={{ boxShadow: '0 0 60px rgba(0, 255, 255, 0.4)' }}
              >
                {/* Animated corner accents */}
                <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-cyan-400 rounded-tl-2xl" />
                <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-cyan-400 rounded-tr-2xl" />
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-cyan-400 rounded-bl-2xl" />
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-cyan-400 rounded-br-2xl" />

                {/* Pulsing rings */}
                <motion.div
                  className="absolute inset-0 rounded-3xl border-2 border-purple-400"
                  animate={{
                    scale: [1, 1.15, 1],
                    opacity: [0.3, 0, 0.3],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: 0.5,
                  }}
                />

                {/* Icon row */}
                <div className="flex items-center justify-center gap-3 mb-6">
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <span className="text-4xl">📱</span>
                  </motion.div>
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <span className="text-3xl">⚡</span>
                  </motion.div>
                </div>

                {/* QR Code - Large for easy scanning */}
                <div className="relative w-full aspect-square bg-white rounded-2xl p-4 mb-6">
                  {qrCodeUrl ? (
                    <img
                      src={qrCodeUrl}
                      alt="Scan to visit uploadcaffeine.com"
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <QrCode className="w-32 h-32 text-cyan-500 animate-pulse" />
                    </div>
                  )}
                </div>

                {/* Text */}
                <div className="text-center">
                  <motion.p
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="text-cyan-400 font-bold text-2xl mb-2"
                  >
                    📷 Scan Me!
                  </motion.p>
                  <p className="text-cyan-100 text-base mb-1">Open on another device</p>
                  <p className="text-cyan-400/80 text-sm font-mono">uploadcaffeine.com</p>
                </div>

                {/* Animated glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 via-purple-500/20 to-pink-500/20 rounded-3xl blur-3xl -z-10" />
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

