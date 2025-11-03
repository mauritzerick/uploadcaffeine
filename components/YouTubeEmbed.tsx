'use client'

import { forwardRef, useImperativeHandle } from 'react'
import { useYouTubePlayer } from '@/hooks/useYouTubePlayer'
import { PlayerState } from '@/lib/youtubeClient'

interface YouTubeEmbedProps {
  videoId: string
  onReady?: () => void
  onStateChange?: (state: number) => void
  onError?: (error: number) => void
  className?: string
}

export interface YouTubeEmbedHandle {
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
  getPlayerState: () => number
  isPlaying: () => boolean
}

/**
 * YouTube IFrame Player Component
 * 
 * Embeds a visible YouTube player using the official IFrame API
 * Complies with YouTube ToS by keeping the player visible
 */
const YouTubeEmbed = forwardRef<YouTubeEmbedHandle, YouTubeEmbedProps>(
  ({ videoId, onReady, onStateChange, onError, className = '' }, ref) => {
    const player = useYouTubePlayer({
      videoId,
      onReady,
      onStateChange,
      onError,
      autoplay: false,
    })

    // Expose player controls via ref
    useImperativeHandle(ref, () => ({
      play: player.play,
      pause: player.pause,
      stop: player.stop,
      loadVideo: player.loadVideo,
      setVolume: player.setVolume,
      getVolume: player.getVolume,
      mute: player.mute,
      unmute: player.unmute,
      isMuted: player.isMuted,
      getCurrentTime: player.getCurrentTime,
      getDuration: player.getDuration,
      getPlayerState: () => player.playerState,
      isPlaying: () => player.playerState === PlayerState.PLAYING,
    }))

    return (
      <div className={`relative w-full ${className}`}>
        {/* YouTube player container - must remain visible per ToS */}
        <div className="relative w-full" style={{ paddingTop: '56.25%' /* 16:9 aspect ratio */ }}>
          <div
            ref={player.playerRef}
            className="absolute inset-0 w-full h-full"
            aria-label="YouTube video player"
          />
        </div>
        
        {/* Loading state */}
        {!player.isReady && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900/80">
            <div className="text-cyan-400 text-sm font-mono animate-pulse">
              Loading player...
            </div>
          </div>
        )}
      </div>
    )
  }
)

YouTubeEmbed.displayName = 'YouTubeEmbed'

export default YouTubeEmbed

