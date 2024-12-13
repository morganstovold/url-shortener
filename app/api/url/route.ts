import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import crypto from 'crypto'

const generateShortCode = () => {
  return crypto.randomBytes(2).toString("hex")
}

export async function POST(request: Request) {
  try {
    const { url } = await request.json()

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 })
    }

    const shortCode = generateShortCode()

    const { data, error } = await supabase
      .from("urls")
      .insert([
        { original_url: url, short_code: shortCode },
      ])
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create short URL' }, { status: 500 })
  }
} 