/**
 * YouTube IFrame Player API Client
 * 
 * Utilities for loading and managing the YouTube IFrame API
 * Documentation: https://developers.google.com/youtube/iframe_api_reference
 */

// Global types for YouTube IFrame API
declare global {
  interface Window {
    YT: typeof YT
    onYouTubeIframeAPIReady?: () => void
  }
}

export interface YTPlayer {
  playVideo: () => void
  pauseVideo: () => void
  stopVideo: () => void
  loadVideoById: (videoId: string, startSeconds?: number) => void
  cueVideoById: (videoId: string, startSeconds?: number) => void
  setVolume: (volume: number) => void
  getVolume: () => number
  mute: () => void
  unMute: () => void
  isMuted: () => boolean
  getPlayerState: () => number
  getCurrentTime: () => number
  getDuration: () => number
  destroy: () => void
}

export enum PlayerState {
  UNSTARTED = -1,
  ENDED = 0,
  PLAYING = 1,
  PAUSED = 2,
  BUFFERING = 3,
  CUED = 5,
}

export interface PlayerVars {
  autoplay?: 0 | 1
  controls?: 0 | 1
  modestbranding?: 0 | 1
  rel?: 0 | 1
  playsinline?: 0 | 1
  fs?: 0 | 1
  iv_load_policy?: 1 | 3
  origin?: string
}

export interface YouTubePlayerConfig {
  videoId: string
  playerVars?: PlayerVars
  onReady?: (player: YTPlayer) => void
  onStateChange?: (state: number) => void
  onError?: (error: number) => void
}

/**
 * Load YouTube IFrame API script
 * Returns a promise that resolves when the API is ready
 */
export function loadYouTubeAPI(): Promise<void> {
  return new Promise((resolve, reject) => {
    // Check if already loaded
    if (window.YT && window.YT.Player) {
      resolve()
      return
    }

    // Check if script is already being loaded
    const existingScript = document.querySelector('script[src*="youtube.com/iframe_api"]')
    if (existingScript) {
      // Wait for the API to be ready
      const checkInterval = setInterval(() => {
        if (window.YT && window.YT.Player) {
          clearInterval(checkInterval)
          resolve()
        }
      }, 100)
      
      // Timeout after 10 seconds
      setTimeout(() => {
        clearInterval(checkInterval)
        reject(new Error('YouTube API load timeout'))
      }, 10000)
      return
    }

    // Set up callback for when API is ready
    window.onYouTubeIframeAPIReady = () => {
      resolve()
    }

    // Load the script
    const tag = document.createElement('script')
    tag.src = 'https://www.youtube.com/iframe_api'
    tag.onerror = () => reject(new Error('Failed to load YouTube API'))
    const firstScriptTag = document.getElementsByTagName('script')[0]
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag)
  })
}

/**
 * Get recommended player vars for audio-focused playback
 */
export function getDefaultPlayerVars(): PlayerVars {
  return {
    autoplay: 0, // Don't autoplay initially
    controls: 1, // Show controls to comply with ToS
    modestbranding: 1, // Minimal branding
    rel: 0, // Don't show related videos
    playsinline: 1, // Play inline on mobile
    fs: 0, // Disable fullscreen
    iv_load_policy: 3, // Hide annotations
    origin: typeof window !== 'undefined' ? window.location.origin : undefined,
  }
}

/**
 * Format duration in seconds to MM:SS
 */
export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

/**
 * Playlist and track data structures
 */
export interface Track {
  id: string // YouTube video ID
  title: string
  channel: string
}

export interface Playlist {
  key: string
  title: string
  tracks: Track[]
}

/**
 * Default playlists - can be overridden by feature flags
 */
export const defaultPlaylists: Playlist[] = [
  {
    key: 'synthwave',
    title: 'Neon Synthwave',
    tracks: [
      { id: 'MV_3Dpw-BRY', title: 'Night Drive', channel: 'Synthwave Goose' },
      { id: '4xDzrJKXOOY', title: 'Neon Tokyo', channel: 'NewRetroWave' },
      { id: 'DuDGOWH0TB0', title: 'Chromatic City', channel: 'The Midnight' },
      { id: 'Zi_XLOBDo_Y', title: 'Sunset Cruise', channel: 'FM-84' },
    ],
  },
  {
    key: 'lofi',
    title: 'Cyber Lo-Fi',
    tracks: [
      { id: 'jfKfPfyJRdk', title: 'Pixel Rain', channel: 'Lofi Girl' },
      { id: '5qap5aO4i9A', title: 'Late Night Terminal', channel: 'ChilledCow' },
      { id: 'lTRiuFIWV54', title: 'Code & Chill', channel: 'Chillhop Music' },
      { id: 'DWcJFNfaw9c', title: 'Study Bytes', channel: 'Lofi Girl' },
    ],
  },
  {
    key: 'ambient',
    title: 'Quantum Ambient',
    tracks: [
      { id: 'UfcAVejslrU', title: 'Cryo Chamber', channel: 'Cryo Chamber' },
      { id: 'wOMwO5T3yT4', title: 'Ion Drift', channel: 'Ambient Worlds' },
      { id: 'kP70EEo8W5s', title: 'Deep Space', channel: 'Soothing Relaxation' },
      { id: 'maIc4G5sFq0', title: 'Nebula Dreams', channel: 'Ambient' },
    ],
  },
]

/**
 * Get playlist by key
 */
export function getPlaylistByKey(key: string): Playlist | undefined {
  return defaultPlaylists.find(p => p.key === key)
}

/**
 * Get default playlist (fallback to synthwave)
 */
export function getDefaultPlaylist(): Playlist {
  return defaultPlaylists[0]
}

