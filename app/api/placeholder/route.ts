import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    message: 'This is a placeholder API route',
    timestamp: new Date().toISOString(),
    data: {
      example: 'You can replace this with your actual API logic',
    },
  })
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    return NextResponse.json({
      message: 'POST request received',
      receivedData: body,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid JSON in request body' },
      { status: 400 }
    )
  }
}

