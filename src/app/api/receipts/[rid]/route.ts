// src/app/api/receipts/[rid]/route.ts
import { NextResponse } from 'next/server'
import { sbAdmin } from '../../../../lib/supabase'

export async function GET(
  request: Request,
  context: { params: Promise<{ rid: string }> }  // note: params is a Promise
) {
  // **Await** the params promise before using it:
  const { rid } = await context.params

  // Now do your lookup as before:
  const { data, error } = await sbAdmin
    .from('receipts')
    .select('*')
    .eq('rid', rid)
    .single()

  if (error || !data) {
    return NextResponse.json({ error: 'Receipt not found' }, { status: 404 })
  }
  return NextResponse.json(data)
}

