import * as React from 'npm:react@18.3.1'
import {
  Body, Button, Container, Head, Heading, Hr, Html, Preview, Section, Text,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

const SITE_NAME = 'Build Your Footprint'
const SITE_URL = 'https://www.buildyourfootprint.com'

interface CartItem {
  name: string
  price: string
  quantity: number
  category?: string
}

interface CartRequestCustomerProps {
  customerName?: string
  items?: CartItem[]
}

const CartRequestCustomerEmail = ({
  customerName,
  items = [],
}: CartRequestCustomerProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Your request is in. We will be in touch within 24 hours.</Preview>
    <Body style={main}>
      <Container style={outerFrame}>
        <Container style={container}>
          {/* Brand header */}
          <Section style={header}>
            <Text style={brandKicker}>BUILD YOUR FOOTPRINT</Text>
            <Text style={brandRule}>✦</Text>
          </Section>

          <Heading style={h1}>
            {customerName ? `Thank you, ${customerName}.` : 'Thank you for reaching out.'}
          </Heading>

          <Text style={lede}>
            Your request is in good hands. A member of our team will personally
            review the details and reply <span style={emphasis}>within 24 hours</span>{' '}
            with next steps and confirmed pricing.
          </Text>

          <Heading as="h2" style={h2}>Your selection</Heading>
          <Section style={itemsCard}>
            {items.length === 0 ? (
              <Text style={text}>No items listed.</Text>
            ) : (
              items.map((it, i) => (
                <Section
                  key={i}
                  style={i === items.length - 1 ? itemRowLast : itemRow}
                >
                  <Text style={itemName}>
                    {it.name}
                    {it.category ? <span style={itemCategory}> · {it.category}</span> : null}
                  </Text>
                  <Text style={itemMeta}>
                    {it.price}{it.quantity > 1 ? ` · Qty ${it.quantity}` : ''}
                  </Text>
                </Section>
              ))
            )}
          </Section>

          <Section style={ctaWrap}>
            <Button href={SITE_URL} style={ctaButton}>
              Visit our site
            </Button>
          </Section>

          <Hr style={hr} />

          <Text style={signoff}>
            With care,<br />
            <span style={signoffName}>The {SITE_NAME} team</span>
          </Text>
        </Container>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: CartRequestCustomerEmail,
  subject: `Your request is in. We will be in touch within 24 hours.`,
  displayName: 'Cart request — customer confirmation',
  previewData: {
    customerName: 'Jane',
    items: [
      { name: 'Signature', price: '$1,499', quantity: 1, category: 'Build package' },
      { name: 'Growth Care', price: '$59/mo', quantity: 1, category: 'Care plan' },
    ],
  },
} satisfies TemplateEntry

// Brand palette translated from index.css HSL tokens to hex for email clients.
// background ink: hsl(160 20% 5%) ≈ #0A1410
// card surface: hsl(160 18% 8%) ≈ #111B17
// emerald primary: hsl(158 64% 42%) ≈ #29B07A
// gold accent: hsl(42 78% 60%) ≈ #E5B546
// foreground cream: hsl(40 30% 96%) ≈ #F7F4ED
// muted text: hsl(160 8% 62%) ≈ #99A39F
// border: hsl(160 15% 16%) ≈ #232E2A

const main = {
  backgroundColor: '#ffffff',
  fontFamily: "'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif",
  margin: 0,
  padding: '40px 16px',
}
const outerFrame = {
  maxWidth: '640px',
  margin: '0 auto',
  padding: 0,
  backgroundColor: '#ffffff',
}
const container = {
  maxWidth: '640px',
  margin: '0 auto',
  padding: '56px 44px 48px',
  backgroundColor: '#0A1410',
  backgroundImage:
    'linear-gradient(135deg, rgba(41,176,122,0.08) 0%, rgba(10,20,16,0) 50%, rgba(229,181,70,0.06) 100%)',
  border: '1px solid #232E2A',
  borderRadius: '16px',
}
const header = { marginBottom: '36px', textAlign: 'center' as const }
const brandKicker = {
  fontFamily: "'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif",
  fontSize: '11px',
  fontWeight: 600,
  letterSpacing: '0.32em',
  color: '#E5B546',
  margin: 0,
}
const brandRule = {
  color: '#E5B546',
  fontSize: '14px',
  margin: '10px 0 0',
  letterSpacing: '0.4em',
}
const h1 = {
  fontFamily: "'Fraunces', 'Georgia', 'Times New Roman', serif",
  fontSize: '32px',
  fontWeight: 500,
  lineHeight: '1.2',
  letterSpacing: '-0.02em',
  color: '#F7F4ED',
  margin: '0 0 18px',
  textAlign: 'center' as const,
}
const lede = {
  fontSize: '15px',
  color: '#C8CFCB',
  lineHeight: '1.75',
  margin: '0 0 36px',
  textAlign: 'center' as const,
}
const emphasis = { color: '#E5B546', fontWeight: 600 }
const h2 = {
  fontSize: '11px',
  fontWeight: 700,
  color: '#99A39F',
  margin: '0 0 14px',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.22em',
}
const text = { fontSize: '14px', color: '#C8CFCB', lineHeight: '1.6', margin: '0 0 16px' }
const itemsCard = {
  backgroundColor: '#111B17',
  border: '1px solid #232E2A',
  borderRadius: '12px',
  padding: '6px 22px',
  margin: '0 0 36px',
}
const itemRow = { borderBottom: '1px solid #1C2622', padding: '16px 0' }
const itemRowLast = { padding: '16px 0' }
const itemName = {
  fontFamily: "'Fraunces', 'Georgia', serif",
  fontSize: '17px',
  fontWeight: 500,
  color: '#F7F4ED',
  margin: '0 0 4px',
  letterSpacing: '-0.01em',
}
const itemCategory = {
  fontFamily: "'Inter', sans-serif",
  color: '#99A39F',
  fontWeight: 400,
  fontSize: '13px',
  letterSpacing: '0.02em',
}
const itemMeta = { fontSize: '13px', color: '#E5B546', margin: 0, fontWeight: 500 }
const ctaWrap = { textAlign: 'center' as const, margin: '8px 0 8px' }
const ctaButton = {
  backgroundColor: '#E5B546',
  color: '#0A1410',
  fontSize: '13px',
  fontWeight: 600,
  letterSpacing: '0.14em',
  textTransform: 'uppercase' as const,
  padding: '16px 36px',
  borderRadius: '999px',
  textDecoration: 'none',
  display: 'inline-block',
}
const hr = { borderColor: '#232E2A', margin: '40px 0 28px' }
const signoff = {
  fontSize: '14px',
  color: '#C8CFCB',
  lineHeight: '1.7',
  margin: '20px 0 0',
  textAlign: 'center' as const,
}
const signoffName = {
  fontFamily: "'Fraunces', 'Georgia', 'Times New Roman', serif",
  fontStyle: 'italic' as const,
  color: '#E5B546',
  fontSize: '16px',
}
