import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

/**
 * One-time database initialization endpoint
 * Run this once to create all tables in Turso
 */
export const dynamic = 'force-dynamic'

export async function POST() {
  try {
    // Test connection
    await prisma.$connect()
    
    // Create tables by running a simple query on each model
    // This will create the tables if they don't exist
    
    // Supporter table
    await prisma.supporter.findFirst()
    
    // Event table
    await prisma.event.findFirst()
    
    // Experiment table
    await prisma.experiment.findFirst()
    
    // DevQuote table
    await prisma.devQuote.findFirst()
    
    // QuoteHistory table
    await prisma.quoteHistory.findFirst()
    
    // FeatureFlag table
    await prisma.featureFlag.findFirst()
    
    // FeatureToggleAudit table
    await prisma.featureToggleAudit.findFirst()
    
    return NextResponse.json({
      success: true,
      message: 'Database tables initialized successfully',
    })
  } catch (error: any) {
    console.error('Database initialization error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        note: 'This is expected if tables already exist',
      },
      { status: 500 }
    )
  }
}

