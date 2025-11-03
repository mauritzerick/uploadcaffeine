'use client'

import { motion } from 'framer-motion'
import { ArrowLeft, XCircle, Home } from 'lucide-react'
import Link from 'next/link'

export default function CancelPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0a0a14] via-[#120a1f] to-[#0a0a14] px-4 relative overflow-hidden">
      {/* Grid background */}
      <div className="absolute inset-0 grid-bg opacity-20" />
      
      {/* Floating cyber particles */}
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.2, 0.6, 0.2],
          }}
          transition={{
            duration: 4 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        >
          <div 
            className="w-1 h-1 rounded-full bg-purple-500"
            style={{
              boxShadow: '0 0 10px rgba(176, 0, 255, 0.6)',
            }}
          />
        </motion.div>
      ))}

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, type: "spring" }}
        className="max-w-md w-full bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 text-center border-2 border-purple-500/50 relative z-10 overflow-hidden"
        style={{
          boxShadow: '0 0 60px rgba(176, 0, 255, 0.4)',
        }}
      >
        {/* Scanline effect */}
        <div className="absolute inset-0 scanline pointer-events-none" />

        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="mb-6 relative z-10"
        >
          <motion.div
            animate={{ rotate: [0, -5, 5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mx-auto shadow-lg relative"
            style={{
              boxShadow: '0 0 40px rgba(176, 0, 255, 0.6)',
            }}
          >
            <XCircle 
              className="w-14 h-14 text-white"
              style={{
                filter: 'drop-shadow(0 0 20px rgba(176, 0, 255, 0.8))',
              }}
            />
          </motion.div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600 bg-clip-text text-transparent mb-4 uppercase tracking-wider relative z-10"
        >
          Cancelled
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-lg md:text-xl text-cyan-100 mb-8 font-light relative z-10"
        >
          <span className="text-purple-400 font-semibold">Transaction aborted</span>
          <br />
          No charges were made. Return anytime!
        </motion.p>

        <Link href="/" className="relative z-10 block">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:opacity-90 text-white font-bold py-4 px-6 rounded-lg transition-all duration-300 shadow-lg text-lg uppercase tracking-wider flex items-center justify-center gap-3"
            style={{
              boxShadow: '0 0 30px rgba(176, 0, 255, 0.5)',
            }}
          >
            <ArrowLeft className="w-5 h-5" />
            Return Home
            <Home className="w-5 h-5" />
          </motion.button>
        </Link>
      </motion.div>
    </div>
  )
}
