/// <reference types="npm:@types/react@18.3.1" />

import * as React from 'npm:react@18.3.1'

import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from 'npm:@react-email/components@0.0.22'

interface RecoveryEmailProps {
  siteName: string
  confirmationUrl: string
}

export const RecoveryEmail = ({
  siteName,
  confirmationUrl,
}: RecoveryEmailProps) => (
  <Html lang="en" dir="ltr">
    <Head>
      <link
        href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600&family=Inter:wght@400;500;600&display=swap"
        rel="stylesheet"
      />
    </Head>
    <Preview>Reset your {siteName} password</Preview>
    <Body style={main}>
      <Container style={outerContainer}>
        <Section style={brandRow}>
          <Text style={brandMark}>Build Your Footprint</Text>
        </Section>

        <Container style={card}>
          <Heading style={h1}>Reset your password.</Heading>

          <Text style={text}>
            We received a request to reset the password on your {siteName} client portal. Click the button below to choose a new password.
          </Text>

          <Section style={buttonWrapper}>
            <Button style={button} href={confirmationUrl}>
              Reset password
            </Button>
          </Section>

          <Text style={smallNote}>
            Or copy and paste this link into your browser:
            <br />
            <Link href={confirmationUrl} style={inlineLink}>
              {confirmationUrl}
            </Link>
          </Text>

          <Text style={footer}>
            If you didn't request a password reset, you can safely ignore this email. Your password will not be changed.
          </Text>
        </Container>

        <Text style={signOff}>
          Build Your Footprint Web Services
          <br />
          <Link href="https://buildyourfootprint.com" style={signOffLink}>
            buildyourfootprint.com
          </Link>
        </Text>
      </Container>
    </Body>
  </Html>
)

export default RecoveryEmail

const main = {
  backgroundColor: '#ffffff',
  fontFamily: "'Inter', Arial, sans-serif",
  margin: 0,
  padding: 0,
  WebkitFontSmoothing: 'antialiased',
}

const outerContainer = {
  maxWidth: '560px',
  margin: '0 auto',
  padding: '40px 20px',
}

const brandRow = {
  textAlign: 'center' as const,
  marginBottom: '20px',
}

const brandMark = {
  fontFamily: "'Fraunces', Georgia, serif",
  fontSize: '13px',
  fontWeight: 500 as const,
  letterSpacing: '0.18em',
  textTransform: 'uppercase' as const,
  color: '#0a1410',
  margin: 0,
}

const card = {
  backgroundColor: '#0f1d18',
  borderRadius: '14px',
  padding: '40px 36px',
  border: '1px solid #1a2e26',
}

const h1 = {
  fontFamily: "'Fraunces', Georgia, serif",
  fontSize: '28px',
  fontWeight: 600 as const,
  letterSpacing: '-0.02em',
  lineHeight: '1.25',
  color: '#f5efe2',
  margin: '0 0 18px',
}

const text = {
  fontFamily: "'Inter', Arial, sans-serif",
  fontSize: '15px',
  lineHeight: '1.65',
  color: '#c8d3ce',
  margin: '0 0 26px',
}

const buttonWrapper = {
  textAlign: 'center' as const,
  margin: '8px 0 28px',
}

const button = {
  backgroundColor: '#1ea672',
  color: '#0a1410',
  fontFamily: "'Inter', Arial, sans-serif",
  fontSize: '15px',
  fontWeight: 600 as const,
  letterSpacing: '0.01em',
  borderRadius: '10px',
  padding: '15px 32px',
  textDecoration: 'none',
  display: 'inline-block',
}

const smallNote = {
  fontFamily: "'Inter', Arial, sans-serif",
  fontSize: '12px',
  lineHeight: '1.6',
  color: '#7d8a85',
  margin: '0 0 24px',
  wordBreak: 'break-all' as const,
}

const inlineLink = {
  color: '#e8c878',
  textDecoration: 'none',
}

const footer = {
  fontFamily: "'Inter', Arial, sans-serif",
  fontSize: '12px',
  lineHeight: '1.55',
  color: '#7d8a85',
  margin: '24px 0 0',
  paddingTop: '20px',
  borderTop: '1px solid #1a2e26',
}

const signOff = {
  fontFamily: "'Inter', Arial, sans-serif",
  fontSize: '11px',
  lineHeight: '1.6',
  color: '#5f6c67',
  textAlign: 'center' as const,
  margin: '24px 0 0',
}

const signOffLink = {
  color: '#7d8a85',
  textDecoration: 'none',
}
