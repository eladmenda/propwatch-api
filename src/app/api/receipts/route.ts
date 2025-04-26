// src/app/api/receipts/route.ts

import { NextResponse } from 'next/server'
import crypto from 'crypto'
import { sbAdmin }       from '../../../lib/supabase'
import { uploadJSON }    from '../../../lib/arweave'
import { ReceiptSchema } from '../../../lib/receipt'

export async function POST(request: Request) {
  // 1) parse & validate
  let data
  try {
    data = ReceiptSchema.parse(await request.json())
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 })
  }

  // 2) compute unique ID
  const rid = crypto
    .createHash('sha256')
    .update(`${data.trader}|${data.firm}|${data.amount_usd}|${Date.now()}`)
    .digest('hex')

  // 3) insert into Supabase with debug logging
  const { data: inserted, error: insertErr } = await sbAdmin
    .from('receipts')
    .insert({ rid, ...data })
  if (insertErr) {
    console.error('🛑 Supabase insert error:', insertErr)
    return NextResponse.json(
      { error: 'Database insert failed', details: insertErr },
      { status: 500 }
    )
  }

  // 4) backup to Arweave
  let arweave_txid: string
  try {
    arweave_txid = await uploadJSON({ rid, ...data })
  } catch (err: any) {
    console.error('🛑 Arweave upload error:', err)
    return NextResponse.json(
      { error: 'Backup to Arweave failed', details: err.message },
      { status: 502 }
    )
  }

  // 5) update the record with the txid
  const { error: updateErr } = await sbAdmin
    .from('receipts')
    .update({ arweave_txid })
    .eq('rid', rid)
  if (updateErr) {
    console.warn('⚠️ Supabase update error:', updateErr)
    // Not fatal—continue to respond with success
  }

  // 6) return the result
  return NextResponse.json({ rid, arweave_txid }, { status: 200 })
}

