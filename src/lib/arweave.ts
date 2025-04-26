// src/lib/arweave.ts
import Arweave from 'arweave'

// Always load from WALLET_JSON (no file fallback)
function loadKey(): any {
  const raw = process.env.WALLET_JSON
  if (!raw) {
    throw new Error('WALLET_JSON env var is missing!')
  }

  // DEBUG: log length and first/last chars
  console.log('🔑 WALLET_JSON length:', raw.length)
  console.log('🔑 First 10 chars:', raw.slice(0,10))
  console.log('🔑 Last 10 chars:', raw.slice(-10))

  // Trim whitespace/newlines before parsing
  const trimmed = raw.trim()
  return JSON.parse(trimmed)
}

const arweave = Arweave.init({
  host: 'arweave.net',
  port: 443,
  protocol: 'https',
})

export async function uploadJSON(obj: unknown): Promise<string> {
  const key = loadKey()
  const tx = await arweave.createTransaction({ data: JSON.stringify(obj) }, key)
  tx.addTag('Content-Type', 'application/json')
  await arweave.transactions.sign(tx, key)
  const result = await arweave.transactions.post(tx)
  if (result.status !== 200) {
    throw new Error(`Arweave upload failed: ${result.status}`)
  }
  return tx.id
}

