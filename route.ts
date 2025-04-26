// app/api/receipts/[rid]/route.ts
import { NextResponse } from 'next/server'
import { sbAdmin } from '@/lib/supabase'

export async function GET(
  request: Request,
  { params }: { params: { rid: string } }
) {
  const { rid } = params
  const { data, error } = await sbAdmin
    .from('receipts')
    .select('*')
    .eq('rid', rid)
    .single()

  if (error || !data) {
    return NextResponse.json(
      { error: 'Receipt not found' },
      { status: 404 }
    )
  }

  return NextResponse.json(data)
}

