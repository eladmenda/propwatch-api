// src/lib/arweave.ts
import Arweave from 'arweave'

async function loadKey(): Promise<any> {
  if (process.env.WALLET_JSON) {
    return JSON.parse(process.env.WALLET_JSON)
  } else {
    const fs = await import('fs')
    const path = await import('path')
    const raw = fs.readFileSync(
      path.resolve(process.cwd(), 'wallet.json'),
      'utf8'
    )
    return JSON.parse(raw)
  }
}

const arweave = Arweave.init({
  host: 'arweave.net',
  port: 443,
  protocol: 'https',
})

export async function uploadJSON(obj: unknown): Promise<string> {
  const key = await loadKey()
  const tx = await arweave.createTransaction({ data: JSON.stringify(obj) }, key)
  tx.addTag('Content-Type', 'application/json')
  await arweave.transactions.sign(tx, key)
  const result = await arweave.transactions.post(tx)
  if (result.status !== 200) {
    throw new Error(`Arweave upload failed: ${result.status}`)
  }
  return tx.id
}

