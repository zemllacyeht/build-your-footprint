import * as React from 'npm:react@18.3.1'
import type { TemplateEntry } from './registry.ts'
import { EmailShell, H1, Label, Lede, PrimaryButton, Quote, SITE_URL } from './_layout.tsx'

interface Props {
  clientName?: string
  planName?: string
  amount?: string
  invoiceNumber?: string
  periodEnd?: string
}

const PaymentReceiptEmail = ({ clientName, planName, amount, invoiceNumber, periodEnd }: Props) => (
  <EmailShell preview="Payment received, thank you">
    <H1>{clientName ? `Thank you, ${clientName}.` : 'Thank you.'}</H1>
    <Lede>
      We received your payment for <strong>{planName ?? 'your subscription'}</strong>
      {amount ? `: ${amount}` : ''}. Your services continue without interruption
      {periodEnd ? ` through ${periodEnd}` : ''}.
    </Lede>
    {invoiceNumber ? (
      <>
        <Label>Invoice</Label>
        <Quote>#{invoiceNumber}</Quote>
      </>
    ) : null}
    <PrimaryButton href={`${SITE_URL}/portal`}>View billing</PrimaryButton>
  </EmailShell>
)

export const template = {
  component: PaymentReceiptEmail,
  subject: 'Payment received, thank you',
  displayName: 'Payment receipt',
  previewData: {
    clientName: 'Porsia',
    planName: 'Hosting (monthly)',
    amount: '$29.00',
    invoiceNumber: 'in_1ABCdef',
    periodEnd: 'June 12, 2026',
  },
} satisfies TemplateEntry
