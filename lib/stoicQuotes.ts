/**
 * Stoic Quotes Data
 * 
 * A collection of wisdom from ancient Stoic philosophers including:
 * - Marcus Aurelius (Roman Emperor and philosopher)
 * - Seneca (Roman Stoic philosopher)
 * - Epictetus (Greek Stoic philosopher)
 * 
 * These quotes are used by the StoicAgent component to provide
 * philosophical wisdom and inspiration to users.
 */

export interface StoicQuote {
  text: string
  author: 'Marcus Aurelius' | 'Seneca' | 'Epictetus'
  emoji: string
}

export const stoicQuotesData: StoicQuote[] = [
  // Marcus Aurelius - Meditations
  {
    text: "You have power over your mind - not outside events. Realize this, and you will find strength.",
    author: "Marcus Aurelius",
    emoji: "🏛️"
  },
  {
    text: "The happiness of your life depends upon the quality of your thoughts.",
    author: "Marcus Aurelius",
    emoji: "🌅"
  },
  {
    text: "The impediment to action advances action. What stands in the way becomes the way.",
    author: "Marcus Aurelius",
    emoji: "🎯"
  },
  {
    text: "Waste no more time arguing about what a good person should be. Be one.",
    author: "Marcus Aurelius",
    emoji: "⚡"
  },
  {
    text: "Very little is needed to make a happy life; it is all within yourself, in your way of thinking.",
    author: "Marcus Aurelius",
    emoji: "💭"
  },
  {
    text: "The soul becomes dyed with the color of its thoughts.",
    author: "Marcus Aurelius",
    emoji: "🎨"
  },
  {
    text: "If it is not right, do not do it; if it is not true, do not say it.",
    author: "Marcus Aurelius",
    emoji: "⚖️"
  },
  {
    text: "The best revenge is to be unlike him who performed the injury.",
    author: "Marcus Aurelius",
    emoji: "🛡️"
  },
  
  // Seneca - Letters and Essays
  {
    text: "We suffer more often in imagination than in reality.",
    author: "Seneca",
    emoji: "🌊"
  },
  {
    text: "Luck is what happens when preparation meets opportunity.",
    author: "Seneca",
    emoji: "🎲"
  },
  {
    text: "It is not the man who has too little, but the man who craves more, that is poor.",
    author: "Seneca",
    emoji: "💎"
  },
  {
    text: "Difficulties strengthen the mind, as labor does the body.",
    author: "Seneca",
    emoji: "💪"
  },
  {
    text: "As is a tale, so is life: not how long it is, but how good it is, is what matters.",
    author: "Seneca",
    emoji: "📖"
  },
  {
    text: "True happiness is to enjoy the present, without anxious dependence upon the future.",
    author: "Seneca",
    emoji: "🌟"
  },
  {
    text: "Begin at once to live, and count each separate day as a separate life.",
    author: "Seneca",
    emoji: "⏳"
  },
  {
    text: "A gem cannot be polished without friction, nor a person perfected without trials.",
    author: "Seneca",
    emoji: "💍"
  },
  
  // Epictetus - Discourses and Enchiridion
  {
    text: "It's not what happens to you, but how you react to it that matters.",
    author: "Epictetus",
    emoji: "🎭"
  },
  {
    text: "First say to yourself what you would be; and then do what you have to do.",
    author: "Epictetus",
    emoji: "🗺️"
  },
  {
    text: "No person is free who is not master of themselves.",
    author: "Epictetus",
    emoji: "🔓"
  },
  {
    text: "He who laughs at himself never runs out of things to laugh at.",
    author: "Epictetus",
    emoji: "😊"
  },
  {
    text: "Wealth consists not in having great possessions, but in having few wants.",
    author: "Epictetus",
    emoji: "🏺"
  },
  {
    text: "Don't explain your philosophy. Embody it.",
    author: "Epictetus",
    emoji: "🌱"
  },
  {
    text: "If you want to improve, be content to be thought foolish and stupid.",
    author: "Epictetus",
    emoji: "🎓"
  },
  {
    text: "Any person capable of angering you becomes your master.",
    author: "Epictetus",
    emoji: "🧘"
  }
]

/**
 * Get a random stoic quote
 */
export function getRandomStoicQuote(): StoicQuote {
  const randomIndex = Math.floor(Math.random() * stoicQuotesData.length)
  return stoicQuotesData[randomIndex]
}

/**
 * Get a formatted quote string for display
 */
export function formatStoicQuote(quote: StoicQuote): string {
  return `${quote.emoji} "${quote.text}" - ${quote.author}`
}

/**
 * Get multiple random quotes (non-repeating)
 */
export function getRandomStoicQuotes(count: number): StoicQuote[] {
  const shuffled = [...stoicQuotesData].sort(() => 0.5 - Math.random())
  return shuffled.slice(0, Math.min(count, stoicQuotesData.length))
}

/**
 * Get quotes by specific philosopher
 */
export function getQuotesByAuthor(author: 'Marcus Aurelius' | 'Seneca' | 'Epictetus'): StoicQuote[] {
  return stoicQuotesData.filter(quote => quote.author === author)
}

