import Arweave from 'arweave'
import fs from 'fs'
import path from 'path'

// Load your JWK keyfile (must be at project root as wallet.json)
const keyPath = path.resolve(process.cwd(), 'wallet.json')
const key = JSON.parse(fs.readFileSync(keyPath, 'utf8'))

// Connect to Arweave
export const arweave = Arweave.init({
  host: 'arweave.net',
  port: 443,
  protocol: 'https',
})

// Upload JSON -> returns txid
export async function uploadJSON(obj: any): Promise<string> {
  const tx = await arweave.createTransaction({ data: JSON.stringify(obj) }, key)
  tx.addTag('Content-Type', 'application/json')
  await arweave.transactions.sign(tx, key)
  const result = await arweave.transactions.post(tx)
  if (result.status !== 200) {
    throw new Error(`Arweave upload failed: ${result.status}`)
  }
  return tx.id
}
