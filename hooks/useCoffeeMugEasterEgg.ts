/**
 * Coffee Mug Easter Egg Hook
 * 
 * Triggers flying coffee mugs when user clicks on coffee icons
 */

import { useState, useEffect } from 'react'

export function useCoffeeMugEasterEgg() {
  const [isTriggered, setIsTriggered] = useState(false)
  const [clickCount, setClickCount] = useState(0)

  useEffect(() => {
    const handleCoffeeClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      
      // Check multiple ways to detect coffee icon
      const svgElement = target.closest('svg')
      const buttonElement = target.closest('button, a')
      
      // Check if it's a coffee icon or contains coffee text/emoji
      const isCoffeeIcon = 
        // Lucide Coffee icon (check for the svg path/class structure)
        (svgElement && (
          svgElement.innerHTML.includes('M18 8h1a4 4 4') || // Coffee icon path
          svgElement.innerHTML.includes('M6 2') ||
          Array.from(svgElement.classList).some(c => c.toLowerCase().includes('coffee'))
        )) ||
        // Button with coffee emoji or text
        (buttonElement && (
          buttonElement.textContent?.includes('☕') ||
          buttonElement.textContent?.toLowerCase().includes('coffee')
        )) ||
        // Direct coffee emoji click
        target.textContent?.includes('☕')
      
      if (isCoffeeIcon) {
        console.log('☕ Coffee mugs launched!')
        setClickCount(prev => prev + 1)
        
        // Trigger the effect - keep component mounted for full animation
        setIsTriggered(true)
        setTimeout(() => {
          setIsTriggered(false)
        }, 5000) // 5 seconds to accommodate longer animations
      }
    }

    document.addEventListener('click', handleCoffeeClick)
    return () => document.removeEventListener('click', handleCoffeeClick)
  }, [])

  return {
    isTriggered,
    clickCount,
  }
}

