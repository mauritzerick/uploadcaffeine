'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Shield, Lock, Check, X, Plus, Search, History, RefreshCw } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'

interface FeatureFlag {
  key: string
  name: string
  description?: string
  enabled: boolean
  updatedAt: string
  jsonConfig?: Record<string, any>
}

export default function WebAdminPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [tokenInput, setTokenInput] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  
  const [flags, setFlags] = useState<FeatureFlag[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newFlag, setNewFlag] = useState({ key: '', name: '', description: '', enabled: true })
  const [expandedFlag, setExpandedFlag] = useState<string | null>(null)

  // Check authentication on mount
  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      // If token in URL, try to authenticate
      if (token) {
        const response = await fetch('/api/admin/auth', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token }),
        })

        if (response.ok) {
          setIsAuthenticated(true)
          // Remove token from URL
          router.replace('/web-admin')
          loadFlags()
        } else {
          setError('Invalid token')
        }
      } else {
        // Check if already authenticated via cookie
        const response = await fetch('/api/admin/check')
        if (response.ok) {
          setIsAuthenticated(true)
          loadFlags()
        }
      }
    } catch (err) {
      console.error('Auth check failed:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleTokenSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    try {
      const response = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: tokenInput }),
      })

      if (response.ok) {
        setIsAuthenticated(true)
        loadFlags()
      } else {
        setError('Invalid token')
      }
    } catch (err) {
      setError('Authentication failed')
    }
  }

  const loadFlags = async () => {
    try {
      const response = await fetch('/api/flags')
      if (response.ok) {
        const data = await response.json()
        setFlags(data.flags || [])
      }
    } catch (err) {
      console.error('Failed to load flags:', err)
    }
  }

  const toggleFlag = async (key: string, currentState: boolean) => {
    try {
      const response = await fetch(`/api/flags/${key}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled: !currentState }),
      })

      if (response.ok) {
        // Optimistic update
        setFlags((prev) =>
          prev.map((f) => (f.key === key ? { ...f, enabled: !currentState } : f))
        )
      } else {
        alert('Failed to toggle flag')
      }
    } catch (err) {
      console.error('Failed to toggle flag:', err)
      alert('Failed to toggle flag')
    }
  }

  const createFlag = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!newFlag.key || !newFlag.name) {
      alert('Key and name are required')
      return
    }

    try {
      const response = await fetch('/api/flags', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newFlag),
      })

      if (response.ok) {
        const data = await response.json()
        setFlags((prev) => [...prev, data.flag])
        setNewFlag({ key: '', name: '', description: '', enabled: true })
        setShowCreateForm(false)
      } else {
        const data = await response.json()
        alert(data.error || 'Failed to create flag')
      }
    } catch (err) {
      console.error('Failed to create flag:', err)
      alert('Failed to create flag')
    }
  }

  const updateFlagConfig = async (key: string, jsonConfig: Record<string, any>) => {
    try {
      const response = await fetch(`/api/flags/${key}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jsonConfig }),
      })

      if (response.ok) {
        // Optimistic update
        setFlags((prev) =>
          prev.map((f) => (f.key === key ? { ...f, jsonConfig } : f))
        )
      } else {
        alert('Failed to update configuration')
      }
    } catch (err) {
      console.error('Failed to update config:', err)
      alert('Failed to update configuration')
    }
  }

  const filteredFlags = flags.filter(
    (flag) =>
      flag.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
      flag.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0a0a14] via-[#120a1f] to-[#0a0a14]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-12 h-12 border-4 border-cyan-400 border-t-transparent rounded-full"
        />
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0a0a14] via-[#120a1f] to-[#0a0a14] px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-gradient-to-br from-gray-900 to-gray-800 p-8 rounded-2xl border-2 border-cyan-500/30 shadow-2xl"
          style={{ boxShadow: '0 0 40px rgba(0, 255, 255, 0.3)' }}
        >
          <div className="text-center mb-6">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
              className="inline-block w-16 h-16 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-full flex items-center justify-center mb-4"
              style={{ boxShadow: '0 0 30px rgba(0, 255, 255, 0.6)' }}
            >
              <Shield className="w-8 h-8 text-white" />
            </motion.div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent mb-2">
              Web Admin
            </h1>
            <p className="text-gray-400 text-sm">Feature Flags Management</p>
          </div>

          <form onSubmit={handleTokenSubmit} className="space-y-4">
            <div>
              <label className="block text-cyan-400 text-sm font-mono mb-2">
                Access Token
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-cyan-400/50" />
                <input
                  type="password"
                  value={tokenInput}
                  onChange={(e) => setTokenInput(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-900 border border-cyan-500/30 rounded-lg text-cyan-100 focus:outline-none focus:border-cyan-500 transition-colors"
                  placeholder="Enter admin token"
                  required
                />
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-500/20 border border-red-500 rounded-lg p-3 text-red-400 text-sm"
              >
                {error}
              </motion.div>
            )}

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold py-3 rounded-lg hover:opacity-90 transition-opacity uppercase tracking-wider"
            >
              Authenticate
            </button>
          </form>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a14] via-[#120a1f] to-[#0a0a14] px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-full flex items-center justify-center"
                style={{ boxShadow: '0 0 20px rgba(0, 255, 255, 0.6)' }}
              >
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                  Feature Flags Admin
                </h1>
                <p className="text-gray-400 text-sm">
                  Manage runtime feature toggles
                </p>
              </div>
            </div>
            
            <button
              onClick={loadFlags}
              className="p-3 bg-gray-800 border border-cyan-500/30 rounded-lg hover:border-cyan-500/50 transition-colors"
              title="Refresh"
            >
              <RefreshCw className="w-5 h-5 text-cyan-400" />
            </button>
          </div>
        </motion.div>

        {/* Search & Create */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex gap-4 mb-6"
        >
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-cyan-400/50" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-900 border border-cyan-500/30 rounded-lg text-cyan-100 focus:outline-none focus:border-cyan-500 transition-colors"
              placeholder="Search flags..."
            />
          </div>
          
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Create Flag
          </button>
        </motion.div>

        {/* Create Form */}
        <AnimatePresence>
          {showCreateForm && (
            <motion.form
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              onSubmit={createFlag}
              className="bg-gray-900 border border-cyan-500/30 rounded-lg p-6 mb-6"
            >
              <h3 className="text-cyan-400 font-bold mb-4">Create New Flag</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-cyan-400 text-sm font-mono mb-2">
                    Key *
                  </label>
                  <input
                    type="text"
                    value={newFlag.key}
                    onChange={(e) => setNewFlag({ ...newFlag, key: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-800 border border-cyan-500/30 rounded-lg text-cyan-100 focus:outline-none focus:border-cyan-500"
                    placeholder="e.g., new_feature"
                    required
                  />
                </div>
                <div>
                  <label className="block text-cyan-400 text-sm font-mono mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    value={newFlag.name}
                    onChange={(e) => setNewFlag({ ...newFlag, name: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-800 border border-cyan-500/30 rounded-lg text-cyan-100 focus:outline-none focus:border-cyan-500"
                    placeholder="e.g., New Feature"
                    required
                  />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-cyan-400 text-sm font-mono mb-2">
                  Description
                </label>
                <textarea
                  value={newFlag.description}
                  onChange={(e) => setNewFlag({ ...newFlag, description: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-800 border border-cyan-500/30 rounded-lg text-cyan-100 focus:outline-none focus:border-cyan-500"
                  placeholder="Describe the feature..."
                  rows={2}
                />
              </div>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newFlag.enabled}
                    onChange={(e) => setNewFlag({ ...newFlag, enabled: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <span className="text-cyan-100">Enabled by default</span>
                </label>
                
                <div className="flex-1" />
                
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="px-4 py-2 bg-gray-800 text-gray-400 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold rounded-lg hover:opacity-90 transition-opacity"
                >
                  Create
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>

        {/* Flags Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-900 border border-cyan-500/30 rounded-lg overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-cyan-500/30 bg-gray-800">
                  <th className="px-6 py-3 text-left text-cyan-400 font-mono text-sm">Key</th>
                  <th className="px-6 py-3 text-left text-cyan-400 font-mono text-sm">Name</th>
                  <th className="px-6 py-3 text-left text-cyan-400 font-mono text-sm">Description</th>
                  <th className="px-6 py-3 text-center text-cyan-400 font-mono text-sm">Status</th>
                  <th className="px-6 py-3 text-center text-cyan-400 font-mono text-sm">Updated</th>
                </tr>
              </thead>
              <tbody>
                {filteredFlags.map((flag, index) => (
                  <>
                    <motion.tr
                      key={flag.key}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b border-cyan-500/10 hover:bg-gray-800/50 transition-colors"
                    >
                      <td className="px-6 py-4 text-cyan-300 font-mono text-sm">
                        <div className="flex items-center gap-2">
                          {flag.key === 'neon_radio' && (
                            <button
                              onClick={() => setExpandedFlag(expandedFlag === flag.key ? null : flag.key)}
                              className="text-cyan-400 hover:text-cyan-300 transition-colors"
                              title="Configure"
                            >
                              {expandedFlag === flag.key ? '▼' : '▶'}
                            </button>
                          )}
                          {flag.key}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-200">{flag.name}</td>
                      <td className="px-6 py-4 text-gray-400 text-sm">{flag.description || '-'}</td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => toggleFlag(flag.key, flag.enabled)}
                          className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors focus:outline-none ${
                            flag.enabled ? 'bg-green-500' : 'bg-gray-600'
                          }`}
                        >
                          <span
                            className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                              flag.enabled ? 'translate-x-8' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </td>
                      <td className="px-6 py-4 text-gray-400 text-sm text-center">
                        {new Date(flag.updatedAt).toLocaleDateString()}
                      </td>
                    </motion.tr>
                    
                    {/* Neon Radio Configuration Panel */}
                    {flag.key === 'neon_radio' && expandedFlag === flag.key && (
                      <motion.tr
                        key={`${flag.key}-config`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <td colSpan={5} className="px-6 py-4 bg-gray-800/50">
                          <div className="max-w-2xl">
                            <h4 className="text-cyan-400 font-bold mb-4 text-sm uppercase tracking-wider">
                              Neon Radio Configuration
                            </h4>
                            
                            <div className="space-y-4">
                              {/* Default Playlist */}
                              <div>
                                <label className="block text-cyan-400 text-sm font-mono mb-2">
                                  Default Playlist
                                </label>
                                <select
                                  value={flag.jsonConfig?.neon_radio_default_playlist || 'synthwave'}
                                  onChange={(e) => {
                                    updateFlagConfig(flag.key, {
                                      ...flag.jsonConfig,
                                      neon_radio_default_playlist: e.target.value,
                                    })
                                  }}
                                  className="w-full px-4 py-2 bg-gray-900 border border-cyan-500/30 rounded-lg text-cyan-100 focus:outline-none focus:border-cyan-500"
                                >
                                  <option value="synthwave">Neon Synthwave</option>
                                  <option value="lofi">Cyber Lo-Fi</option>
                                  <option value="ambient">Quantum Ambient</option>
                                </select>
                                <p className="text-gray-500 text-xs mt-1">
                                  The playlist that will load by default when users open the radio
                                </p>
                              </div>

                              {/* Autoplay */}
                              <div>
                                <label className="flex items-center gap-2 cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={flag.jsonConfig?.neon_radio_autoplay || false}
                                    onChange={(e) => {
                                      updateFlagConfig(flag.key, {
                                        ...flag.jsonConfig,
                                        neon_radio_autoplay: e.target.checked,
                                      })
                                    }}
                                    className="w-4 h-4"
                                  />
                                  <span className="text-cyan-100 text-sm">Enable Autoplay (muted on open)</span>
                                </label>
                                <p className="text-gray-500 text-xs mt-1 ml-6">
                                  Start playing music automatically when user opens the radio (respects browser policies - starts muted)
                                </p>
                              </div>

                              {/* Current Config Display */}
                              <div className="mt-4 p-3 bg-gray-900/80 border border-cyan-500/20 rounded">
                                <div className="text-xs text-gray-400 font-mono">
                                  <div className="text-cyan-400 mb-1">Current JSON Config:</div>
                                  <pre className="text-gray-500 overflow-x-auto">
                                    {JSON.stringify(flag.jsonConfig || {}, null, 2)}
                                  </pre>
                                </div>
                              </div>
                            </div>
                          </div>
                        </td>
                      </motion.tr>
                    )}
                  </>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredFlags.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              No flags found
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}


