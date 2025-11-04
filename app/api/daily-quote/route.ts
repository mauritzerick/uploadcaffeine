import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Force dynamic rendering to prevent build-time Prisma connection
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

// AEST timezone offset (UTC+10 for standard time, UTC+11 for daylight saving)
// We'll use UTC+10 as base (AEST)
function getAESTDate(): string {
  const now = new Date()
  
  // Convert to AEST (UTC+10)
  const aestTime = new Date(now.getTime() + (10 * 60 * 60 * 1000))
  
  // Format as YYYY-MM-DD
  const year = aestTime.getUTCFullYear()
  const month = String(aestTime.getUTCMonth() + 1).padStart(2, '0')
  const day = String(aestTime.getUTCDate()).padStart(2, '0')
  
  return `${year}-${month}-${day}`
}

function getAESTHour(): number {
  const now = new Date()
  const aestTime = new Date(now.getTime() + (10 * 60 * 60 * 1000))
  return aestTime.getUTCHours()
}

export async function GET() {
  try {
    const todayAEST = getAESTDate()
    const currentHour = getAESTHour()
    
    // Check if it's past 12:00 AEST (noon)
    const isPastNoon = currentHour >= 12
    
    // Check if we already have a quote for today
    const existingQuote = await prisma.quoteHistory.findFirst({
      where: { shownDate: todayAEST },
      orderBy: { shownAt: 'desc' },
    })
    
    // If we have a quote for today and it's past noon, return it
    if (existingQuote) {
      return NextResponse.json({
        quote: existingQuote.quote,
        date: todayAEST,
        isNew: false,
      })
    }
    
    // If it's before noon and we don't have a quote yet, get yesterday's quote if available
    if (!isPastNoon) {
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      const yesterdayAEST = getAESTDate()
      
      const yesterdayQuote = await prisma.quoteHistory.findFirst({
        where: { shownDate: yesterdayAEST },
        orderBy: { shownAt: 'desc' },
      })
      
      if (yesterdayQuote) {
        return NextResponse.json({
          quote: yesterdayQuote.quote,
          date: yesterdayAEST,
          isNew: false,
          note: 'Quote changes at 12:00 PM AEST',
        })
      }
    }
    
    // Get all active quotes
    const allQuotes = await prisma.devQuote.findMany({
      where: { isActive: true },
    })
    
    if (allQuotes.length === 0) {
      return NextResponse.json({
        quote: "Code is poetry. Coffee is fuel.",
        date: todayAEST,
        isNew: false,
        error: 'No quotes in database. Run: npm run db:seed',
      })
    }
    
    // Get recently shown quotes to avoid repetition
    const recentQuotes = await prisma.quoteHistory.findMany({
      take: Math.min(10, allQuotes.length - 1),
      orderBy: { shownAt: 'desc' },
    })
    
    const recentQuoteIds = new Set(recentQuotes.map(q => q.quoteId))
    
    // Filter out recently shown quotes
    const availableQuotes = allQuotes.filter(q => !recentQuoteIds.has(q.id))
    
    // If all quotes were recently shown, use all quotes
    const quotesToChooseFrom = availableQuotes.length > 0 ? availableQuotes : allQuotes
    
    // Pick a random quote
    const randomQuote = quotesToChooseFrom[Math.floor(Math.random() * quotesToChooseFrom.length)]
    
    // Save to history
    await prisma.quoteHistory.create({
      data: {
        quoteId: randomQuote.id,
        quote: randomQuote.quote,
        shownDate: todayAEST,
      },
    })
    
    return NextResponse.json({
      quote: randomQuote.quote,
      date: todayAEST,
      isNew: true,
      nextChangeAt: '12:00 PM AEST',
    })
    
  } catch (error) {
    console.error('Error fetching daily quote:', error)
    return NextResponse.json(
      {
        quote: "Code is poetry. Coffee is fuel.",
        error: 'Failed to fetch quote from database',
      },
      { status: 500 }
    )
  }
}


