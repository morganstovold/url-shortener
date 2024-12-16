import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase'
import crypto from 'crypto'

const generateShortCode = () => {
  return crypto.randomBytes(2).toString("hex")
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    
    const contentType = request.headers.get('content-type');
    if (!contentType?.includes('application/json')) {
      return NextResponse.json(
        { error: 'Content-Type must be application/json' }, 
        { status: 400 }
      );
    }

    let body;
    try {
      body = await request.json();
    } catch (e) {
      return NextResponse.json(
        { error: 'Invalid JSON payload' }, 
        { status: 400 }
      );
    }

    const { url } = body;

    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' }, 
        { status: 400 }
      );
    }

    // Validate URL format
    try {
      new URL(url);
    } catch (e) {
      return NextResponse.json(
        { error: 'Invalid URL format' }, 
        { status: 400 }
      );
    }

    const shortCode = generateShortCode();

    const { data, error } = await supabase
      .from("urls")
      .insert([
        { original_url: url, short_code: shortCode },
      ])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (err) {
    console.error('Error creating short URL:', err);
    return NextResponse.json(
      { error: 'Failed to create short URL' }, 
      { status: 500 }
    );
  }
} 