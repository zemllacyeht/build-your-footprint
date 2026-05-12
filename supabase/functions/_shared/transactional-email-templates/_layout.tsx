import * as React from 'npm:react@18.3.1'
import {
  Body, Button, Container, Head, Heading, Hr, Html, Preview, Section, Text,
} from 'npm:@react-email/components@0.0.22'

export const SITE_NAME = 'Build Your Footprint'
export const SITE_URL = 'https://www.buildyourfootprint.com'

export const SERIF_STACK =
  "Georgia, 'Times New Roman', Times, 'Hoefler Text', Garamond, serif"
export const SANS_STACK =
  "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Helvetica, Arial, sans-serif"

export const GOLD = '#E5B546'
export const GREEN = '#2B5B4B'
export const INK = '#2D2A26'
export const MUTED = '#5B5752'

interface ShellProps {
  preview: string
  children: React.ReactNode
}

export const EmailShell = ({ preview, children }: ShellProps) => (
  <Html lang="en" dir="ltr">
    <Head>
      <meta name="x-apple-disable-message-reformatting" />
      <meta httpEquiv="Content-Type" content="text/html; charset=UTF-8" />
    </Head>
    <Preview>{preview}</Preview>
    <Body style={shellMain}>
      <Container style={shellOuter}>
        <Container style={shellCard}>
          <Section style={shellHeader}>
            <Text style={shellKicker}>BUILD YOUR FOOTPRINT</Text>
            <Text style={shellOrnament}>✦</Text>
          </Section>
          <Section style={shellDividerWrap}>
            <Hr style={shellTopDivider} />
            <Section style={shellGoldBar} />
          </Section>
          <Section style={shellBody}>{children}</Section>
          <Section style={shellSignature}>
            <Hr style={shellBottomDivider} />
            <Text style={shellSignoffLine}>With care,</Text>
            <Text style={shellSignoffName}>The {SITE_NAME} team</Text>
          </Section>
        </Container>
      </Container>
    </Body>
  </Html>
)

export const H1 = ({ children }: { children: React.ReactNode }) => (
  <Heading style={h1}>{children}</Heading>
)
export const Lede = ({ children }: { children: React.ReactNode }) => (
  <Text style={lede}>{children}</Text>
)
export const Label = ({ children }: { children: React.ReactNode }) => (
  <Text style={label}>{children}</Text>
)
export const Quote = ({ children }: { children: React.ReactNode }) => (
  <Section style={quoteCard}>
    <Text style={quoteText}>{children}</Text>
  </Section>
)
export const PrimaryButton = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <Section style={ctaWrap}>
    <Button href={href} style={ctaButton}>{children}</Button>
  </Section>
)

const shellMain = {
  backgroundColor: '#ffffff',
  fontFamily: SANS_STACK,
  margin: 0,
  padding: '40px 20px',
}
const shellOuter = {
  backgroundColor: '#F3F2EF',
  padding: '40px 20px',
  maxWidth: '100%',
  width: '100%',
  margin: 0,
}
const shellCard = {
  maxWidth: '600px',
  margin: '0 auto',
  backgroundColor: '#FFFFFF',
  borderRadius: '8px',
  padding: 0,
  boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
  borderTop: `3px solid ${GOLD}`,
}
const shellHeader = { padding: '40px 40px 20px', textAlign: 'center' as const }
const shellKicker = {
  margin: 0, fontSize: '12px', fontWeight: 600, letterSpacing: '4px',
  color: GOLD, textTransform: 'uppercase' as const,
}
const shellOrnament = {
  margin: '12px 0 0', color: GOLD, fontSize: '14px',
  letterSpacing: '0.4em', fontFamily: SERIF_STACK,
}
const shellDividerWrap = { padding: '0 40px' }
const shellTopDivider = { border: 0, borderTop: '1px solid #E8E6E1', margin: 0 }
const shellGoldBar = { width: '48px', height: '2px', backgroundColor: GOLD, margin: '18px auto 0' }
const shellBody = { padding: '28px 40px 24px' }
const shellSignature = { padding: '0 40px 40px' }
const shellBottomDivider = { border: 0, borderTop: '1px solid #E8E6E1', margin: '0 0 20px' }
const shellSignoffLine = { margin: 0, fontFamily: SERIF_STACK, fontStyle: 'italic' as const, fontSize: '18px', color: INK }
const shellSignoffName = {
  margin: '8px 0 0', fontFamily: SERIF_STACK, fontSize: '17px',
  fontStyle: 'italic' as const, fontWeight: 500, color: GOLD,
}

const h1 = {
  margin: '0 0 16px', fontFamily: SERIF_STACK, fontSize: '26px',
  fontWeight: 400, color: INK, lineHeight: '1.25', letterSpacing: '-0.01em',
}
const lede = { margin: '0 0 16px', fontSize: '15px', lineHeight: '1.7', color: MUTED }
const label = {
  margin: '16px 0 8px', fontSize: '11px', fontWeight: 700,
  letterSpacing: '2px', color: GOLD, textTransform: 'uppercase' as const,
}
const quoteCard = {
  backgroundColor: '#F9F8F6', borderLeft: `4px solid ${GREEN}`,
  borderRadius: '0 6px 6px 0', padding: '16px 20px', margin: '4px 0 16px',
}
const quoteText = {
  margin: 0, fontFamily: SERIF_STACK, fontStyle: 'italic' as const,
  fontSize: '15px', lineHeight: '1.6', color: INK,
}
const ctaWrap = { padding: '8px 0 4px', textAlign: 'center' as const }
const ctaButton = {
  display: 'inline-block', backgroundColor: GREEN, color: '#ffffff',
  fontSize: '13px', fontWeight: 600, letterSpacing: '2px',
  textTransform: 'uppercase' as const, textDecoration: 'none',
  padding: '14px 32px', borderRadius: '6px', border: `2px solid ${GREEN}`,
}
