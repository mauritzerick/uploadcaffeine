'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Radio, 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack, 
  Volume2, 
  VolumeX,
  Power,
  Music2,
} from 'lucide-react'
import YouTubeEmbed, { YouTubeEmbedHandle } from './YouTubeEmbed'
import VisualizerBars from './VisualizerBars'
import { useFeatureFlagsContext } from '@/providers/FeatureFlagsProvider'
import { defaultPlaylists, Playlist, Track, PlayerState } from '@/lib/youtubeClient'
import { trackEvent } from '@/lib/analytics'

const STORAGE_KEY = 'neon_radio_state'

interface SavedState {
  lastPlaylistKey: string
  lastTrackIndex: number
  volume: number
}

export default function NeonRadio() {
  const { isEnabled, getFlag } = useFeatureFlagsContext()
  const [isOpen, setIsOpen] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(true) // Start muted per browser policies
  const [volume, setVolume] = useState(70)
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0)
  const [activePlaylistKey, setActivePlaylistKey] = useState('synthwave')
  const [playerState, setPlayerState] = useState(PlayerState.UNSTARTED)
  
  const playerRef = useRef<YouTubeEmbedHandle>(null)

  // Get default playlist from feature flags
  const flagConfig = getFlag('neon_radio')
  let parsedConfig: any = {}
  try {
    if (flagConfig?.jsonConfig) {
      parsedConfig = typeof flagConfig.jsonConfig === 'string' 
        ? JSON.parse(flagConfig.jsonConfig) 
        : flagConfig.jsonConfig
    }
  } catch (e) {
    console.warn('Failed to parse neon_radio config:', e)
  }
  const defaultPlaylistFromFlag = parsedConfig?.neon_radio_default_playlist || 'synthwave'

  // Load saved state from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const state: SavedState = JSON.parse(saved)
        setActivePlaylistKey(state.lastPlaylistKey || defaultPlaylistFromFlag)
        setCurrentTrackIndex(state.lastTrackIndex || 0)
        setVolume(state.volume || 70)
      } else {
        setActivePlaylistKey(defaultPlaylistFromFlag)
      }
    } catch (e) {
      console.warn('Failed to load saved radio state:', e)
    }
  }, [defaultPlaylistFromFlag])

  // Save state to localStorage
  useEffect(() => {
    try {
      const state: SavedState = {
        lastPlaylistKey: activePlaylistKey,
        lastTrackIndex: currentTrackIndex,
        volume,
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch (e) {
      console.warn('Failed to save radio state:', e)
    }
  }, [activePlaylistKey, currentTrackIndex, volume])

  // Get current playlist and track
  const currentPlaylist = defaultPlaylists.find(p => p.key === activePlaylistKey) || defaultPlaylists[0]
  const currentTrack = currentPlaylist.tracks[currentTrackIndex]

  // Handle toggle open/close
  const handleToggle = () => {
    const newState = !isOpen
    setIsOpen(newState)
    trackEvent(newState ? 'radio_open' : 'radio_close', {})
  }

  // Handle play/pause
  const handlePlayPause = () => {
    if (!playerRef.current) return

    if (isPlaying) {
      playerRef.current.pause()
      trackEvent('radio_pause', { track: currentTrack.title })
    } else {
      // Unmute on first play
      if (isMuted) {
        playerRef.current.unmute()
        setIsMuted(false)
      }
      playerRef.current.play()
      trackEvent('radio_play', { track: currentTrack.title })
    }
  }

  // Handle next track
  const handleNext = () => {
    const nextIndex = (currentTrackIndex + 1) % currentPlaylist.tracks.length
    setCurrentTrackIndex(nextIndex)
    const nextTrack = currentPlaylist.tracks[nextIndex]
    playerRef.current?.loadVideo(nextTrack.id)
    trackEvent('radio_next', { track: nextTrack.title })
  }

  // Handle previous track
  const handlePrev = () => {
    const prevIndex = currentTrackIndex === 0 
      ? currentPlaylist.tracks.length - 1 
      : currentTrackIndex - 1
    setCurrentTrackIndex(prevIndex)
    const prevTrack = currentPlaylist.tracks[prevIndex]
    playerRef.current?.loadVideo(prevTrack.id)
    trackEvent('radio_prev', { track: prevTrack.title })
  }

  // Handle volume change
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseInt(e.target.value)
    setVolume(newVolume)
    playerRef.current?.setVolume(newVolume)
    trackEvent('radio_volume_change', { volume: newVolume })
  }

  // Handle mute toggle
  const handleMuteToggle = () => {
    if (!playerRef.current) return
    
    if (isMuted) {
      playerRef.current.unmute()
    } else {
      playerRef.current.mute()
    }
    setIsMuted(!isMuted)
  }

  // Handle track selection
  const handleTrackSelect = (index: number) => {
    setCurrentTrackIndex(index)
    const track = currentPlaylist.tracks[index]
    playerRef.current?.loadVideo(track.id)
    
    // Auto-play the new track if currently playing
    if (isPlaying) {
      setTimeout(() => playerRef.current?.play(), 100)
    }
  }

  // Handle playlist change
  const handlePlaylistChange = (playlistKey: string) => {
    setActivePlaylistKey(playlistKey)
    setCurrentTrackIndex(0)
    const newPlaylist = defaultPlaylists.find(p => p.key === playlistKey)
    if (newPlaylist) {
      playerRef.current?.loadVideo(newPlaylist.tracks[0].id)
      trackEvent('radio_playlist_change', { playlist: playlistKey })
    }
  }

  // Handle player state changes
  const handleStateChange = (state: number) => {
    setPlayerState(state)
    setIsPlaying(state === PlayerState.PLAYING)
    
    // Auto-play next track when current ends
    if (state === PlayerState.ENDED) {
      handleNext()
    }
  }

  // Check for reduced motion
  const prefersReducedMotion = typeof window !== 'undefined'
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false

  // Check if feature is enabled - must be after all hooks
  if (!isEnabled('neon_radio')) {
    return null
  }

  return (
    <div className="w-full">
      {/* Vibe Mode Toggle Button */}
      <motion.button
        onClick={handleToggle}
        className="w-full mt-4 py-3 px-4 bg-gradient-to-r from-cyan-900/30 to-purple-900/30 border border-cyan-500/50 rounded-lg hover:border-cyan-400 transition-all group relative overflow-hidden"
        whileHover={{ scale: prefersReducedMotion ? 1 : 1.02 }}
        whileTap={{ scale: prefersReducedMotion ? 1 : 0.98 }}
        aria-expanded={isOpen}
        aria-label="Toggle Vibe Mode music player"
      >
        {/* Scanline effect */}
        {!prefersReducedMotion && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/10 to-transparent"
            animate={{ y: ['-100%', '200%'] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          />
        )}
        
        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div
              animate={!prefersReducedMotion && isOpen && isPlaying ? { rotate: 360 } : {}}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            >
              <Radio className="w-5 h-5 text-cyan-400" />
            </motion.div>
            <div className="text-left">
              <div className="text-sm font-bold text-cyan-400 uppercase tracking-wider">
                Vibe Mode
              </div>
              <div className="text-xs text-cyan-600 font-mono">
                {isOpen && isPlaying ? `Now Playing: ${currentTrack.title}` : 'Cyberpunk Radio'}
              </div>
            </div>
          </div>
          <Power 
            className={`w-5 h-5 transition-all ${isOpen ? 'text-cyan-400 rotate-180' : 'text-cyan-600'}`}
          />
        </div>
      </motion.button>

      {/* Collapsible Radio Player */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.3 }}
            className="overflow-hidden"
          >
            <div className="mt-4 p-4 bg-gradient-to-br from-gray-900 via-cyan-950/20 to-purple-950/20 border-2 border-cyan-500/50 rounded-xl shadow-2xl relative">
              {/* Glow effect */}
              {!prefersReducedMotion && (
                <motion.div
                  className="absolute inset-0 rounded-xl opacity-50"
                  animate={{
                    boxShadow: [
                      '0 0 20px rgba(0, 255, 255, 0.3)',
                      '0 0 40px rgba(0, 255, 255, 0.5)',
                      '0 0 20px rgba(0, 255, 255, 0.3)',
                    ],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              )}

              <div className="relative z-10">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Music2 className="w-5 h-5 text-cyan-400" />
                    <h3 className="text-lg font-bold text-cyan-400 uppercase tracking-wider">
                      {currentPlaylist.title}
                    </h3>
                  </div>
                  
                  {/* Playlist selector */}
                  <select
                    value={activePlaylistKey}
                    onChange={(e) => handlePlaylistChange(e.target.value)}
                    className="px-3 py-1 bg-gray-900 border border-cyan-500/50 rounded text-cyan-400 text-sm font-mono focus:outline-none focus:border-cyan-400"
                    aria-label="Select playlist"
                  >
                    {defaultPlaylists.map(playlist => (
                      <option key={playlist.key} value={playlist.key}>
                        {playlist.title}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Player Card */}
                <div className="grid md:grid-cols-2 gap-4">
                  {/* YouTube Player */}
                  <div className="relative">
                    <div className="rounded-lg overflow-hidden border-2 border-cyan-500/30">
                      <YouTubeEmbed
                        ref={playerRef}
                        videoId={currentTrack.id}
                        onStateChange={handleStateChange}
                        className="w-full"
                      />
                    </div>
                    
                    {/* Current track info overlay */}
                    <div className="mt-2 p-2 bg-gray-900/80 border border-cyan-500/30 rounded">
                      <div className="text-sm font-bold text-cyan-400">{currentTrack.title}</div>
                      <div className="text-xs text-cyan-600">{currentTrack.channel}</div>
                    </div>
                  </div>

                  {/* Controls & Track List */}
                  <div className="flex flex-col gap-4">
                    {/* Transport Controls */}
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center justify-center gap-4">
                        <motion.button
                          onClick={handlePrev}
                          className="p-2 bg-cyan-900/30 border border-cyan-500/50 rounded-lg hover:bg-cyan-900/50 hover:border-cyan-400 transition-all"
                          whileHover={{ scale: prefersReducedMotion ? 1 : 1.1 }}
                          whileTap={{ scale: prefersReducedMotion ? 1 : 0.9 }}
                          aria-label="Previous track"
                        >
                          <SkipBack className="w-5 h-5 text-cyan-400" />
                        </motion.button>

                        <motion.button
                          onClick={handlePlayPause}
                          className="p-4 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-full hover:shadow-lg hover:shadow-cyan-500/50 transition-all"
                          whileHover={{ scale: prefersReducedMotion ? 1 : 1.1 }}
                          whileTap={{ scale: prefersReducedMotion ? 1 : 0.9 }}
                          aria-label={isPlaying ? 'Pause' : 'Play'}
                        >
                          {isPlaying ? (
                            <Pause className="w-6 h-6 text-white" />
                          ) : (
                            <Play className="w-6 h-6 text-white ml-0.5" />
                          )}
                        </motion.button>

                        <motion.button
                          onClick={handleNext}
                          className="p-2 bg-cyan-900/30 border border-cyan-500/50 rounded-lg hover:bg-cyan-900/50 hover:border-cyan-400 transition-all"
                          whileHover={{ scale: prefersReducedMotion ? 1 : 1.1 }}
                          whileTap={{ scale: prefersReducedMotion ? 1 : 0.9 }}
                          aria-label="Next track"
                        >
                          <SkipForward className="w-5 h-5 text-cyan-400" />
                        </motion.button>
                      </div>

                      {/* Volume Control */}
                      <div className="flex items-center gap-3 px-2">
                        <button
                          onClick={handleMuteToggle}
                          className="text-cyan-400 hover:text-cyan-300 transition-colors"
                          aria-label={isMuted ? 'Unmute' : 'Mute'}
                        >
                          {isMuted ? (
                            <VolumeX className="w-5 h-5" />
                          ) : (
                            <Volume2 className="w-5 h-5" />
                          )}
                        </button>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={volume}
                          onChange={handleVolumeChange}
                          className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                          aria-label="Volume"
                        />
                        <span className="text-xs text-cyan-400 font-mono w-10 text-right">
                          {volume}%
                        </span>
                      </div>
                    </div>

                    {/* Visualizer */}
                    <div className="bg-gray-900/50 border border-cyan-500/30 rounded-lg p-3">
                      <VisualizerBars isPlaying={isPlaying} barCount={20} />
                    </div>

                    {/* Track List */}
                    <div className="flex-1 bg-gray-900/50 border border-cyan-500/30 rounded-lg p-3 max-h-48 overflow-y-auto custom-scrollbar">
                      <div className="space-y-1">
                        {currentPlaylist.tracks.map((track, index) => (
                          <motion.button
                            key={track.id}
                            onClick={() => handleTrackSelect(index)}
                            className={`w-full text-left p-2 rounded transition-all ${
                              index === currentTrackIndex
                                ? 'bg-cyan-900/50 border border-cyan-500/50'
                                : 'hover:bg-gray-800/50'
                            }`}
                            whileHover={{ x: prefersReducedMotion ? 0 : 4 }}
                            aria-current={index === currentTrackIndex}
                          >
                            <div className="flex items-center gap-2">
                              {index === currentTrackIndex && isPlaying && (
                                <motion.div
                                  className="w-2 h-2 bg-cyan-400 rounded-full"
                                  animate={!prefersReducedMotion ? { scale: [1, 1.5, 1] } : {}}
                                  transition={{ duration: 1, repeat: Infinity }}
                                />
                              )}
                              <div className="flex-1 min-w-0">
                                <div className={`text-sm font-medium truncate ${
                                  index === currentTrackIndex ? 'text-cyan-400' : 'text-cyan-600'
                                }`}>
                                  {track.title}
                                </div>
                                <div className="text-xs text-cyan-800 truncate">
                                  {track.channel}
                                </div>
                              </div>
                            </div>
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Custom scrollbar styles */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.3);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(0, 255, 255, 0.5);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(0, 255, 255, 0.7);
        }
      `}</style>
    </div>
  )
}

