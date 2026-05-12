import * as React from 'npm:react@18.3.1'
import type { TemplateEntry } from './registry.ts'
import { EmailShell, H1, Lede, PrimaryButton, Quote, SITE_NAME, SITE_URL } from './_layout.tsx'

interface Props {
  recipientName?: string
  referrerName?: string
  referrerCompany?: string
  message?: string
}

const ReferralInvitationEmail = ({ recipientName, referrerName, referrerCompany, message }: Props) => {
  const who = referrerCompany || referrerName || 'A friend'
  return (
    <EmailShell preview={`${who} thinks ${SITE_NAME} could help your business`}>
      <H1>{recipientName ? `${recipientName}, an introduction.` : 'An introduction.'}</H1>
      <Lede>
        <strong>{who}</strong> works with {SITE_NAME} on their website and thought
        we might be the right partner for you, too. We design and build distinctive
        digital experiences for ambitious brands.
      </Lede>
      {message ? <Quote>{message}</Quote> : null}
      <PrimaryButton href={`${SITE_URL}/contact`}>Start a conversation</PrimaryButton>
      <Lede>
        Or browse our work and pricing first at{' '}
        <a href={SITE_URL} style={{ color: '#2B5B4B', textDecoration: 'underline' }}>
          {SITE_URL.replace(/^https?:\/\//, '')}
        </a>.
      </Lede>
    </EmailShell>
  )
}

export const template = {
  component: ReferralInvitationEmail,
  subject: (d: Record<string, any>) => {
    const who = d?.referrerCompany || d?.referrerName || 'A friend'
    return `${who} invited you to ${SITE_NAME}`
  },
  displayName: 'Referral invitation',
  previewData: {
    recipientName: 'Marie',
    referrerName: 'Porsia',
    referrerCompany: 'Atelier Maison',
    message: 'They transformed our brand presence. You would love working with them.',
  },
} satisfies TemplateEntry
