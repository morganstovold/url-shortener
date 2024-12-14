import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("urls")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) throw error

    return NextResponse.json(data)
  } catch (err) {
    console.error('Error fetching URLs:', err)
    return NextResponse.json({ error: 'Failed to fetch URLs' }, { status: 500 })
  }
} 