/**
 * useYouTubePlayer Hook
 * 
 * Manages YouTube IFrame Player instance lifecycle and state
 */

import { useEffect, useRef, useState, useCallback } from 'react'
import { loadYouTubeAPI, YTPlayer, PlayerState, getDefaultPlayerVars } from '@/lib/youtubeClient'

interface UseYouTubePlayerOptions {
  videoId: string
  onReady?: () => void
  onStateChange?: (state: number) => void
  onError?: (error: number) => void
  autoplay?: boolean
}

interface UseYouTubePlayerReturn {
  playerRef: React.RefObject<HTMLDivElement>
  isReady: boolean
  playerState: number
  play: () => void
  pause: () => void
  stop: () => void
  loadVideo: (videoId: string) => void
  setVolume: (volume: number) => void
  getVolume: () => number
  mute: () => void
  unmute: () => void
  isMuted: () => boolean
  getCurrentTime: () => number
  getDuration: () => number
}

export function useYouTubePlayer(options: UseYouTubePlayerOptions): UseYouTubePlayerReturn {
  const { videoId, onReady, onStateChange, onError, autoplay = false } = options
  
  const playerRef = useRef<HTMLDivElement>(null)
  const playerInstanceRef = useRef<YTPlayer | null>(null)
  const [isReady, setIsReady] = useState(false)
  const [playerState, setPlayerState] = useState(PlayerState.UNSTARTED)

  // Initialize player
  useEffect(() => {
    let mounted = true
    let player: YTPlayer | null = null

    async function initPlayer() {
      try {
        // Load YouTube API
        await loadYouTubeAPI()

        if (!mounted || !playerRef.current) return

        // Create player instance
        player = new window.YT.Player(playerRef.current, {
          videoId,
          playerVars: {
            ...getDefaultPlayerVars(),
            autoplay: autoplay ? 1 : 0,
          },
          events: {
            onReady: (event: any) => {
              if (!mounted) return
              setIsReady(true)
              playerInstanceRef.current = event.target
              
              // Start muted to comply with autoplay policies
              if (autoplay) {
                event.target.mute()
              }
              
              onReady?.()
            },
            onStateChange: (event: any) => {
              if (!mounted) return
              setPlayerState(event.data)
              onStateChange?.(event.data)
            },
            onError: (event: any) => {
              if (!mounted) return
              console.error('YouTube player error:', event.data)
              onError?.(event.data)
            },
          },
        })
      } catch (error) {
        console.error('Failed to initialize YouTube player:', error)
      }
    }

    initPlayer()

    return () => {
      mounted = false
      if (player && typeof player.destroy === 'function') {
        try {
          player.destroy()
        } catch (e) {
          console.warn('Error destroying player:', e)
        }
      }
      playerInstanceRef.current = null
    }
  }, []) // Only run once on mount

  // Control methods
  const play = useCallback(() => {
    playerInstanceRef.current?.playVideo()
  }, [])

  const pause = useCallback(() => {
    playerInstanceRef.current?.pauseVideo()
  }, [])

  const stop = useCallback(() => {
    playerInstanceRef.current?.stopVideo()
  }, [])

  const loadVideo = useCallback((newVideoId: string) => {
    playerInstanceRef.current?.loadVideoById(newVideoId)
  }, [])

  const setVolume = useCallback((volume: number) => {
    playerInstanceRef.current?.setVolume(Math.max(0, Math.min(100, volume)))
  }, [])

  const getVolume = useCallback((): number => {
    return playerInstanceRef.current?.getVolume() ?? 0
  }, [])

  const mute = useCallback(() => {
    playerInstanceRef.current?.mute()
  }, [])

  const unmute = useCallback(() => {
    playerInstanceRef.current?.unMute()
  }, [])

  const isMuted = useCallback((): boolean => {
    return playerInstanceRef.current?.isMuted() ?? false
  }, [])

  const getCurrentTime = useCallback((): number => {
    return playerInstanceRef.current?.getCurrentTime() ?? 0
  }, [])

  const getDuration = useCallback((): number => {
    return playerInstanceRef.current?.getDuration() ?? 0
  }, [])

  return {
    playerRef,
    isReady,
    playerState,
    play,
    pause,
    stop,
    loadVideo,
    setVolume,
    getVolume,
    mute,
    unmute,
    isMuted,
    getCurrentTime,
    getDuration,
  }
}

