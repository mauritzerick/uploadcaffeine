'use client'

import { motion } from 'framer-motion'
import { Quote, Sparkles } from 'lucide-react'
import { useEffect, useState } from 'react'
import useSWR from 'swr'

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function DailyQuote() {
  const [mounted, setMounted] = useState(false)
  
  // Fetch quote from API, refresh every hour to check for noon update
  const { data, error } = useSWR('/api/daily-quote', fetcher, {
    refreshInterval: 60 * 60 * 1000, // Check every hour
    revalidateOnFocus: false,
  })

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted || !data) return null
  
  const quote = data.quote || "Code is poetry. Coffee is fuel."

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="mb-8"
    >
      <motion.div
        animate={{
          boxShadow: [
            '0 0 20px rgba(0, 255, 255, 0.2)',
            '0 0 30px rgba(255, 0, 255, 0.2)',
            '0 0 20px rgba(0, 255, 255, 0.2)',
          ],
        }}
        transition={{ duration: 4, repeat: Infinity }}
        className="bg-gradient-to-r from-gray-900/60 to-gray-800/60 backdrop-blur-md px-6 py-4 rounded-xl border border-cyan-500/30 max-w-2xl mx-auto"
      >
        <div className="flex items-start gap-3">
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <Quote className="w-6 h-6 text-purple-400 flex-shrink-0 mt-1" />
          </motion.div>
          <div className="flex-1">
            <p className="text-lg md:text-xl text-cyan-100 font-light italic leading-relaxed">
              {quote}
            </p>
            <div className="flex items-center gap-2 mt-2">
              <Sparkles className="w-4 h-4 text-yellow-400" />
              <span className="text-sm text-cyan-400/80 font-mono uppercase tracking-wider">
                Dev Quote of the Day
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

