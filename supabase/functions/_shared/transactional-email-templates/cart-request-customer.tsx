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
    <Head>
      <meta name="x-apple-disable-message-reformatting" />
      <meta httpEquiv="Content-Type" content="text/html; charset=UTF-8" />
    </Head>
    <Preview>Your request is in. We will be in touch within 24 hours.</Preview>
    <Body style={main}>
      <Container style={outerWrap}>
        <Container style={card}>
          {/* Header */}
          <Section style={headerSection}>
            <Text style={brandKicker}>BUILD YOUR FOOTPRINT</Text>
            <Text style={brandOrnament}>✦</Text>
          </Section>

          <Section style={dividerWrap}>
            <Hr style={topDivider} />
            <Section style={goldAccentBar} />
          </Section>

          {/* Greeting */}
          <Section style={bodySection}>
            <Heading style={h1}>
              {customerName ? `Thank you, ${customerName}.` : 'Thank you for reaching out.'}
            </Heading>
            <Text style={lede}>
              Your request is in good hands. A member of our team will personally
              review the details and reply <span style={emphasis}>within 24 hours</span>{' '}
              with next steps and confirmed pricing.
            </Text>
          </Section>

          {/* Selection card */}
          <Section style={selectionWrap}>
            <Section style={selectionCard}>
              <Text style={selectionLabel}>YOUR SELECTION</Text>
              {items.length === 0 ? (
                <Text style={selectionEmpty}>No items listed.</Text>
              ) : (
                items.map((it, i) => (
                  <Section key={i} style={i === 0 ? selectionItemFirst : selectionItem}>
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
          </Section>

          {/* CTA */}
          <Section style={ctaWrap}>
            <Button href={SITE_URL} style={ctaButton}>
              Visit Our Site
            </Button>
          </Section>

          {/* Signature */}
          <Section style={signatureWrap}>
            <Hr style={bottomDivider} />
            <Text style={signoffLine}>With care,</Text>
            <Text style={signoffName}>The {SITE_NAME} team</Text>
          </Section>
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
    customerName: 'Porsia',
    items: [
      { name: 'Signature', price: '$1,499 one-time', quantity: 1, category: 'Build Package' },
      { name: 'Growth Care', price: '$59/mo', quantity: 1, category: 'Care plan' },
    ],
  },
} satisfies TemplateEntry

// Light premium palette
// outer bg: #F3F2EF (warm off-white)
// card: #FFFFFF
// forest green accent: #2B5B4B
// ink: #2D2A26
// body text: #5B5752
// muted: #A5A29A / #9D9B96
// subtle bg: #F9F8F6
// hairline: #E8E6E1

const main = {
  backgroundColor: '#ffffff',
  fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
  margin: 0,
  padding: '40px 20px',
}
const outerWrap = {
  backgroundColor: '#F3F2EF',
  padding: '40px 20px',
  maxWidth: '100%',
  width: '100%',
  margin: 0,
}
const card = {
  maxWidth: '600px',
  margin: '0 auto',
  backgroundColor: '#FFFFFF',
  borderRadius: '8px',
  padding: 0,
  boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
}
const headerSection = {
  padding: '40px 40px 30px 40px',
  textAlign: 'center' as const,
}
const brandKicker = {
  margin: 0,
  fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
  fontSize: '16px',
  fontWeight: 400,
  letterSpacing: '3px',
  color: '#A5A29A',
  textTransform: 'uppercase' as const,
}
const dividerWrap = { padding: '0 40px' }
const topDivider = {
  border: 0,
  borderTop: '1px solid #E8E6E1',
  margin: 0,
}
const bodySection = { padding: '35px 40px 25px 40px' }
const h1 = {
  margin: '0 0 16px',
  fontFamily: "'Georgia', 'Times New Roman', serif",
  fontSize: '28px',
  fontWeight: 400,
  color: '#2D2A26',
  lineHeight: '1.2',
}
const lede = {
  margin: '0 0 20px',
  fontSize: '16px',
  lineHeight: '1.7',
  color: '#5B5752',
}
const emphasis = { color: '#2D2A26', fontWeight: 700 }

const selectionWrap = { padding: '0 40px 30px' }
const selectionCard = {
  backgroundColor: '#F9F8F6',
  borderLeft: '4px solid #2B5B4B',
  borderRadius: '0 6px 6px 0',
  padding: '20px 24px',
}
const selectionLabel = {
  margin: '0 0 10px',
  fontSize: '13px',
  fontWeight: 600,
  letterSpacing: '1px',
  color: '#A5A29A',
  textTransform: 'uppercase' as const,
}
const selectionEmpty = {
  margin: 0,
  fontSize: '15px',
  color: '#5B5752',
}
const selectionItemFirst = { padding: '4px 0 0' }
const selectionItem = {
  padding: '14px 0 0',
  borderTop: '1px solid #E8E6E1',
  marginTop: '14px',
}
const itemName = {
  margin: 0,
  fontSize: '18px',
  fontWeight: 700,
  color: '#2D2A26',
  lineHeight: '1.4',
}
const itemCategory = {
  fontWeight: 400,
  color: '#A5A29A',
  fontSize: '14px',
}
const itemMeta = {
  margin: '4px 0 0',
  fontSize: '16px',
  color: '#5B5752',
}

const ctaWrap = {
  padding: '0 40px 35px',
  textAlign: 'center' as const,
}
const ctaButton = {
  display: 'inline-block',
  backgroundColor: '#2B5B4B',
  color: '#ffffff',
  fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
  fontSize: '16px',
  fontWeight: 600,
  letterSpacing: '0.5px',
  textDecoration: 'none',
  padding: '16px 34px',
  borderRadius: '6px',
  border: '2px solid #2B5B4B',
}

const signatureWrap = { padding: '0 40px 40px' }
const bottomDivider = {
  border: 0,
  borderTop: '1px solid #E8E6E1',
  margin: '0 0 20px',
}
const signoffLine = {
  margin: 0,
  fontFamily: "'Georgia', serif",
  fontStyle: 'italic' as const,
  fontSize: '18px',
  color: '#2D2A26',
}
const signoffName = {
  margin: '8px 0 0',
  fontSize: '16px',
  fontWeight: 600,
  color: '#2D2A26',
}
