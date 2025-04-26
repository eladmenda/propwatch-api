import { z } from 'zod'

export const ReceiptSchema = z.object({
  trader:     z.string().min(1),
  firm:       z.string().min(1),
  amount_usd: z.number().positive(),
  asset:      z.enum(['USD','BTC','ETH','SOL']),
})
export type ReceiptInput = z.infer<typeof ReceiptSchema>
