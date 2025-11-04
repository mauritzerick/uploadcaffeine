'use client'

import { Heart, Github, Linkedin, Mail, Coffee, Zap } from 'lucide-react'
import { motion } from 'framer-motion'

export default function Footer() {
  return (
    <footer className="relative bg-gradient-to-br from-[#0a0a14] via-[#0d0015] to-[#0a0a14] text-white py-12 px-4 overflow-hidden border-t-2 border-cyan-500/30">
      {/* Grid background */}
      <div className="absolute inset-0 grid-bg opacity-10" />
      
      {/* Animated particles */}
      <div className="absolute inset-0 overflow-hidden opacity-30">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-cyan-400"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              boxShadow: '0 0 10px rgba(0, 255, 255, 0.8)',
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.3, 1, 0.3],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              >
                <Coffee 
                  className="w-8 h-8 text-cyan-400"
                  style={{ filter: 'drop-shadow(0 0 10px rgba(0, 255, 255, 0.8))' }}
                />
              </motion.div>
              <h3 className="text-2xl font-bold uppercase tracking-wider bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                Buy Me Coffee
              </h3>
            </div>
            <p className="text-cyan-100/80 font-light leading-relaxed">
              Supporting creators in the digital age. Thank you for being part of this journey!
            </p>
          </div>

          <div>
            <h4 className="text-xl font-bold mb-4 flex items-center gap-2 text-cyan-400 uppercase tracking-wider">
              <Zap className="w-5 h-5" /> Quick Links
            </h4>
            <ul className="space-y-3">
              <li>
                <motion.a
                  href="#about"
                  whileHover={{ x: 5 }}
                  className="text-cyan-100/80 hover:text-cyan-400 transition-colors font-light flex items-center gap-2 group"
                >
                  <span className="w-2 h-2 rounded-full bg-cyan-400 group-hover:shadow-[0_0_10px_rgba(0,255,255,0.8)]" />
                  About
                </motion.a>
              </li>
              <li>
                <motion.a
                  href="#coffee"
                  whileHover={{ x: 5 }}
                  className="text-cyan-100/80 hover:text-cyan-400 transition-colors font-light flex items-center gap-2 group"
                >
                  <span className="w-2 h-2 rounded-full bg-purple-400 group-hover:shadow-[0_0_10px_rgba(176,0,255,0.8)]" />
                  Support Options
                </motion.a>
              </li>
              <li>
                <motion.a
                  href="#supporters"
                  whileHover={{ x: 5 }}
                  className="text-cyan-100/80 hover:text-cyan-400 transition-colors font-light flex items-center gap-2 group"
                >
                  <span className="w-2 h-2 rounded-full bg-pink-400 group-hover:shadow-[0_0_10px_rgba(255,0,255,0.8)]" />
                  Supporters
                </motion.a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xl font-bold mb-4 flex items-center gap-2 text-purple-400 uppercase tracking-wider">
              <Mail className="w-5 h-5" /> Connect
            </h4>
            <div className="flex gap-4">
              <motion.a
                href="https://github.com/mauritzerick"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
                className="w-12 h-12 bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg flex items-center justify-center border-2 border-cyan-500/30 backdrop-blur-sm"
                style={{
                  boxShadow: '0 0 20px rgba(0, 255, 255, 0.2)',
                }}
                aria-label="GitHub"
              >
                <Github className="w-6 h-6 text-cyan-400" />
              </motion.a>
              <motion.a
                href="https://www.linkedin.com/in/mauritzerick/"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
                className="w-12 h-12 bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg flex items-center justify-center border-2 border-purple-500/30 backdrop-blur-sm"
                style={{
                  boxShadow: '0 0 20px rgba(176, 0, 255, 0.2)',
                }}
                aria-label="LinkedIn"
              >
                <Linkedin className="w-6 h-6 text-purple-400" />
              </motion.a>
              <motion.a
                href="mailto:mauritz.erick@gmail.com"
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
                className="w-12 h-12 bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg flex items-center justify-center border-2 border-pink-500/30 backdrop-blur-sm"
                style={{
                  boxShadow: '0 0 20px rgba(255, 0, 255, 0.2)',
                }}
                aria-label="Email"
              >
                <Mail className="w-6 h-6 text-pink-400" />
              </motion.a>
            </div>
          </div>
        </div>

        <div className="border-t border-cyan-500/30 pt-8 text-center">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-cyan-100/70 flex items-center justify-center gap-2 font-light text-sm uppercase tracking-wider"
          >
            Crafted with 
            <motion.span
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <Heart className="w-4 h-4 fill-current text-pink-500" />
            </motion.span>
            and powered by
            <motion.span
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <Coffee className="w-4 h-4 text-cyan-400" />
            </motion.span>
            © {new Date().getFullYear()} All Rights Reserved
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="text-cyan-400/40 text-xs mt-2 font-mono"
          >
            Psst... Press &apos;M&apos; three times for a surprise 🎮
          </motion.p>
        </div>
      </div>
    </footer>
  )
}
