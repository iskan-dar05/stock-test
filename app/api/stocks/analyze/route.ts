import { NextRequest, NextResponse } from 'next/server'

interface StockAnalysisResult {
  symbol: string
  price: number
  change: number
  changePercent: number
  trend: 'up' | 'down' | 'neutral'
  aiInsight: string
}

/**
 * POST /api/stocks/analyze
 * 
 * Analyzes stock symbols and returns price data with AI insights.
 * 
 * Request body:
 * {
 *   symbols: string - Comma-separated stock symbols (e.g., "AAPL,MSFT,GOOGL")
 * }
 * 
 * Returns:
 * {
 *   results: StockAnalysisResult[]
 * }
 */
export async function POST(request: NextRequest) {
  try {
    // 1. Parse request body
    let body: { symbols?: string }
    try {
      body = await request.json()
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      )
    }

    // 2. Validate symbols
    if (!body.symbols || typeof body.symbols !== 'string') {
      return NextResponse.json(
        { error: 'symbols is required and must be a string' },
        { status: 400 }
      )
    }

    // 3. Parse and clean symbols
    const symbols = body.symbols
      .split(',')
      .map((s) => s.trim().toUpperCase())
      .filter((s) => s.length > 0)

    if (symbols.length === 0) {
      return NextResponse.json(
        { error: 'At least one valid symbol is required' },
        { status: 400 }
      )
    }

    if (symbols.length > 10) {
      return NextResponse.json(
        { error: 'Maximum 10 symbols allowed per request' },
        { status: 400 }
      )
    }

    // 4. Simulate stock data fetch (replace with actual API call)
    // In production, you would call a real stock API like Alpha Vantage, Yahoo Finance, etc.
    const results: StockAnalysisResult[] = await Promise.all(
      symbols.map(async (symbol) => {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 200))

        // Generate mock data (replace with real API call)
        const basePrice = 100 + Math.random() * 200
        const change = (Math.random() - 0.5) * 20
        const changePercent = (change / basePrice) * 100
        const trend: 'up' | 'down' | 'neutral' =
          changePercent > 1 ? 'up' : changePercent < -1 ? 'down' : 'neutral'

        // Generate AI insight based on trend
        const aiInsight = generateAIInsight(symbol, changePercent, trend)

        return {
          symbol,
          price: Number(basePrice.toFixed(2)),
          change: Number(change.toFixed(2)),
          changePercent: Number(changePercent.toFixed(2)),
          trend,
          aiInsight,
        }
      })
    )

    // 5. Return results
    return NextResponse.json(
      {
        results,
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    )
  } catch (error: any) {
    console.error('Error in /api/stocks/analyze:', error)
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined,
      },
      { status: 500 }
    )
  }
}

/**
 * Generate AI insight based on stock data
 * In production, this would call an AI service like OpenAI
 */
function generateAIInsight(
  symbol: string,
  changePercent: number,
  trend: 'up' | 'down' | 'neutral'
): string {
  const insights = {
    up: [
      `${symbol} is showing strong upward momentum with a ${changePercent.toFixed(2)}% gain. Consider monitoring for potential continuation patterns.`,
      `Positive price action for ${symbol}. The ${changePercent.toFixed(2)}% increase suggests bullish sentiment. Watch for resistance levels.`,
      `${symbol} is trending higher with solid gains. The current momentum may indicate sustained buying interest.`,
    ],
    down: [
      `${symbol} is experiencing selling pressure with a ${Math.abs(changePercent).toFixed(2)}% decline. Monitor support levels closely.`,
      `Bearish movement detected for ${symbol}. The ${Math.abs(changePercent).toFixed(2)}% drop suggests potential weakness. Exercise caution.`,
      `${symbol} is showing downward momentum. Consider waiting for stabilization before entering new positions.`,
    ],
    neutral: [
      `${symbol} is trading in a tight range with minimal movement. Current price action suggests consolidation.`,
      `Sideways trading pattern for ${symbol}. The stock appears to be finding equilibrium between buyers and sellers.`,
      `${symbol} is showing neutral momentum. Wait for a clear directional breakout before making trading decisions.`,
    ],
  }

  const trendInsights = insights[trend]
  return trendInsights[Math.floor(Math.random() * trendInsights.length)]
}

