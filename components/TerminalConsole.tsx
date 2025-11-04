'use client'

import { useState, useEffect, useRef, KeyboardEvent } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Minus, Terminal as TerminalIcon } from 'lucide-react'
import { trackEvent } from '@/lib/analytics'
import { useFeatureFlagsContext } from '@/providers/FeatureFlagsProvider'

interface TerminalLine {
  id: string
  type: 'input' | 'output' | 'error' | 'success'
  content: string
}

const COMMANDS = {
  help: 'List all available commands',
  brew: 'Simulate fueling the reactor (args: espresso|latte|matcha|nitro)',
  status: 'Show system metrics',
  glitch: 'Trigger a glitch effect',
  matrix: 'Toggle Matrix rain mode',
  clear: 'Clear console output',
  flags: 'List all feature flags',
}

export default function TerminalConsole() {
  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState('')
  const [lines, setLines] = useState<TerminalLine[]>([
    { id: '0', type: 'output', content: '🚀 CYBERTERM v2.0 initialized. Type "help" for commands.' },
  ])
  const [history, setHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [size, setSize] = useState(() => {
    // Responsive initial size
    if (typeof window !== 'undefined') {
      const isMobile = window.innerWidth < 768
      return {
        width: isMobile ? Math.min(window.innerWidth - 32, 400) : 600,
        height: isMobile ? Math.min(window.innerHeight - 100, 350) : 400,
      }
    }
    return { width: 600, height: 400 }
  })
  
  const inputRef = useRef<HTMLInputElement>(null)
  const outputRef = useRef<HTMLDivElement>(null)
  const { flags, isEnabled } = useFeatureFlagsContext()

  // Load console state from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('terminal_state')
    if (saved) {
      try {
        const state = JSON.parse(saved)
        if (state.size) {
          // Ensure size fits current screen
          if (typeof window !== 'undefined') {
            const maxWidth = window.innerWidth - 32
            const maxHeight = window.innerHeight - 100
            setSize({
              width: Math.min(state.size.width, maxWidth),
              height: Math.min(state.size.height, maxHeight),
            })
          } else {
            setSize(state.size)
          }
        }
      } catch (e) {
        console.error('Failed to load terminal state:', e)
      }
    }
  }, [])

  // Save state to localStorage
  useEffect(() => {
    localStorage.setItem('terminal_state', JSON.stringify({ size, isOpen }))
  }, [size, isOpen])

  // Auto-scroll to bottom on new lines
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight
    }
  }, [lines])

  // Listen for backtick key to toggle terminal
  useEffect(() => {
    const handleKeyDown = (e: globalThis.KeyboardEvent) => {
      if (e.key === '`' && !e.ctrlKey && !e.metaKey && !e.altKey) {
        // Only toggle if not typing in an input field
        const target = e.target as HTMLElement
        if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA') {
          e.preventDefault()
          setIsOpen((prev) => {
            const newState = !prev
            trackEvent(newState ? 'terminal_open' : 'terminal_close', {})
            return newState
          })
        }
      }
      
      // Escape to close
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false)
        trackEvent('terminal_close', {})
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen])

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  const addLine = (type: TerminalLine['type'], content: string) => {
    setLines((prev) => [...prev, { id: Date.now().toString(), type, content }])
  }

  const executeCommand = (cmd: string) => {
    const [command, ...args] = cmd.trim().toLowerCase().split(/\s+/)
    
    trackEvent('terminal_cmd_invoke', { command, args })

    switch (command) {
      case 'help':
        addLine('output', '📋 Available commands:')
        Object.entries(COMMANDS).forEach(([cmd, desc]) => {
          addLine('output', `  ${cmd.padEnd(10)} - ${desc}`)
        })
        break

      case 'brew':
        const brewType = args[0] || 'espresso'
        const validBrews = ['espresso', 'latte', 'matcha', 'nitro']
        if (validBrews.includes(brewType)) {
          addLine('success', `☕ Brewing ${brewType}... Reactor fuel +${Math.floor(Math.random() * 30 + 20)}%`)
          // Trigger particle effect
          window.dispatchEvent(new CustomEvent('trigger-particle-burst'))
          // Show toast notification
          addLine('output', '⚡ Energy surge detected! System performance optimized.')
        } else {
          addLine('error', `❌ Unknown brew type. Options: ${validBrews.join(', ')}`)
        }
        break

      case 'status':
        addLine('output', '⚙️  System Status Report:')
        addLine('output', `  ☕ Caffeine Core: ${Math.floor(Math.random() * 30 + 70)}%`)
        addLine('output', `  💻 Productivity: ${Math.floor(Math.random() * 20 + 80)}%`)
        addLine('output', `  ⏱️  Uptime: ${Math.floor(Math.random() * 100 + 50)}h`)
        addLine('output', `  🧠 Creativity Matrix: ${['OPTIMAL', 'OVERCLOCKED', 'LEGENDARY'][Math.floor(Math.random() * 3)]}`)
        break

      case 'glitch':
        addLine('success', '⚡ Initiating glitch effect...')
        document.documentElement.classList.add('glitch-effect')
        setTimeout(() => {
          document.documentElement.classList.remove('glitch-effect')
        }, 800)
        break

      case 'matrix':
        if (isEnabled('matrix_rain')) {
          addLine('success', '🎮 Toggling Matrix rain mode...')
          window.dispatchEvent(new CustomEvent('toggle-matrix-mode'))
        } else {
          addLine('error', '❌ Matrix rain feature is disabled')
        }
        break

      case 'clear':
        setLines([
          { id: Date.now().toString(), type: 'output', content: 'Console cleared.' },
        ])
        break

      case 'flags':
        addLine('output', '🚩 Feature Flags:')
        flags.forEach((flag) => {
          const status = flag.enabled ? '✅' : '❌'
          addLine('output', `  ${status} ${flag.key} - ${flag.name}`)
        })
        break

      case '':
        // Empty command, do nothing
        break

      default:
        addLine('error', `❌ Unknown command: ${command}. Type "help" for available commands.`)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    // Add input to display
    addLine('input', `$ ${input}`)
    
    // Add to history
    setHistory((prev) => [...prev, input])
    setHistoryIndex(-1)

    // Execute command
    executeCommand(input)

    // Clear input
    setInput('')
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (history.length === 0) return
      const newIndex = historyIndex === -1 ? history.length - 1 : Math.max(0, historyIndex - 1)
      setHistoryIndex(newIndex)
      setInput(history[newIndex] || '')
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (historyIndex === -1) return
      const newIndex = historyIndex + 1
      if (newIndex >= history.length) {
        setHistoryIndex(-1)
        setInput('')
      } else {
        setHistoryIndex(newIndex)
        setInput(history[newIndex])
      }
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        drag
        dragMomentum={false}
        dragConstraints={{
          top: 0,
          left: 0,
          right: typeof window !== 'undefined' ? window.innerWidth - size.width : 1000,
          bottom: typeof window !== 'undefined' ? window.innerHeight - size.height : 800,
        }}
        className="fixed bottom-2 right-2 md:bottom-4 md:right-4 z-[100] bg-gray-900 border-2 border-cyan-500 rounded-lg shadow-2xl overflow-hidden"
        style={{
          width: size.width,
          height: size.height,
          boxShadow: '0 0 30px rgba(0, 255, 255, 0.5)',
          maxWidth: 'calc(100vw - 1rem)',
          maxHeight: 'calc(100vh - 5rem)',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between bg-gray-800 border-b border-cyan-500 px-2 md:px-4 py-2 cursor-move">
          <div className="flex items-center gap-2">
            <TerminalIcon className="w-3 h-3 md:w-4 md:h-4 text-cyan-400" />
            <span className="text-cyan-400 font-mono text-xs md:text-sm uppercase tracking-wider">
              CyberTerm
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-gray-700 rounded transition-colors"
              title="Close (Esc)"
            >
              <X className="w-3 h-3 md:w-4 md:h-4 text-cyan-400" />
            </button>
          </div>
        </div>

        {/* Output Area */}
        <div
          ref={outputRef}
          className="flex-1 overflow-y-auto p-2 md:p-4 font-mono text-xs md:text-sm space-y-1"
          style={{ height: size.height - 100 }}
        >
          {lines.map((line) => (
            <div
              key={line.id}
              className={`break-words ${
                line.type === 'input'
                  ? 'text-cyan-300'
                  : line.type === 'error'
                  ? 'text-red-400'
                  : line.type === 'success'
                  ? 'text-green-400'
                  : 'text-gray-300'
              }`}
            >
              {line.content}
            </div>
          ))}
        </div>

        {/* Input Area */}
        <form onSubmit={handleSubmit} className="border-t border-cyan-500 bg-gray-800 p-2">
          <div className="flex items-center gap-2">
            <span className="text-cyan-400 font-mono text-xs md:text-sm">$</span>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-transparent text-cyan-300 font-mono text-xs md:text-sm outline-none placeholder-gray-600"
              placeholder="Type a command..."
              autoComplete="off"
            />
          </div>
        </form>

        {/* Hint */}
        <div className="absolute bottom-2 right-2 text-[10px] md:text-xs text-gray-600 font-mono hidden md:block">
          Press ` to toggle
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

