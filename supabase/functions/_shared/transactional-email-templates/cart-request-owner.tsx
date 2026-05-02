import * as React from 'npm:react@18.3.1'
import {
  Body, Container, Head, Heading, Hr, Html, Preview, Section, Text,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

const SITE_NAME = 'Build Your Footprint'

interface CartItem {
  name: string
  price: string
  quantity: number
  category?: string
}

interface CartRequestOwnerProps {
  customerName?: string
  customerEmail?: string
  customerPhone?: string
  customerCompany?: string
  notes?: string
  items?: CartItem[]
  submittedAt?: string
}

const CartRequestOwnerEmail = ({
  customerName = 'A potential client',
  customerEmail = '',
  customerPhone = '',
  customerCompany = '',
  notes = '',
  items = [],
  submittedAt = '',
}: CartRequestOwnerProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>New cart request from {customerName}, {items.length} item(s)</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>New cart request</Heading>
        <Text style={text}>
          {customerName} just submitted a request through the {SITE_NAME} site.
        </Text>

        <Section style={card}>
          <Text style={label}>Contact</Text>
          <Text style={value}>{customerName}</Text>
          {customerEmail ? <Text style={value}>{customerEmail}</Text> : null}
          {customerPhone ? <Text style={value}>{customerPhone}</Text> : null}
          {customerCompany ? <Text style={value}>{customerCompany}</Text> : null}
          {submittedAt ? <Text style={meta}>Submitted: {submittedAt}</Text> : null}
        </Section>

        <Heading as="h2" style={h2}>Requested items</Heading>
        {items.length === 0 ? (
          <Text style={text}>No items listed.</Text>
        ) : (
          items.map((it, i) => (
            <Section key={i} style={itemRow}>
              <Text style={itemName}>
                {it.name}{it.category ? ` · ${it.category}` : ''}
              </Text>
              <Text style={itemMeta}>
                {it.price}{it.quantity > 1 ? ` · Qty ${it.quantity}` : ''}
              </Text>
            </Section>
          ))
        )}

        {notes ? (
          <>
            <Hr style={hr} />
            <Text style={label}>Notes from customer</Text>
            <Text style={text}>{notes}</Text>
          </>
        ) : null}

        <Hr style={hr} />
        <Text style={footer}>
          Reply directly to {customerEmail || 'the customer'} to follow up.
        </Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: CartRequestOwnerEmail,
  subject: (data: Record<string, any>) =>
    `New cart request${data?.customerName ? ` from ${data.customerName}` : ''}`,
  to: 'hello@buildyourfootprint.com',
  displayName: 'Cart request — owner notification',
  previewData: {
    customerName: 'Jane Doe',
    customerEmail: 'jane@example.com',
    customerCompany: 'Acme Co.',
    notes: 'Looking to launch in Q2.',
    items: [
      { name: 'Signature', price: '$1,499', quantity: 1, category: 'Build package' },
      { name: 'Growth Care', price: '$59/mo', quantity: 1, category: 'Care plan' },
    ],
    submittedAt: 'May 1, 2026',
  },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'Helvetica, Arial, sans-serif' }
const container = { padding: '32px 28px', maxWidth: '600px' }
const h1 = { fontSize: '24px', fontWeight: 600, color: '#0a0a0a', margin: '0 0 12px' }
const h2 = { fontSize: '16px', fontWeight: 600, color: '#0a0a0a', margin: '28px 0 12px', textTransform: 'uppercase' as const, letterSpacing: '0.08em' }
const text = { fontSize: '14px', color: '#404040', lineHeight: '1.6', margin: '0 0 16px' }
const label = { fontSize: '11px', color: '#737373', textTransform: 'uppercase' as const, letterSpacing: '0.12em', margin: '0 0 6px' }
const value = { fontSize: '14px', color: '#0a0a0a', margin: '0 0 4px' }
const meta = { fontSize: '12px', color: '#737373', margin: '8px 0 0' }
const card = { backgroundColor: '#fafafa', border: '1px solid #e5e5e5', borderRadius: '8px', padding: '16px', margin: '16px 0' }
const itemRow = { borderBottom: '1px solid #e5e5e5', padding: '12px 0' }
const itemName = { fontSize: '14px', fontWeight: 500, color: '#0a0a0a', margin: '0 0 2px' }
const itemMeta = { fontSize: '13px', color: '#737373', margin: '0' }
const hr = { borderColor: '#e5e5e5', margin: '24px 0' }
const footer = { fontSize: '12px', color: '#737373', margin: '0' }
