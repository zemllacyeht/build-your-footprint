import * as React from 'npm:react@18.3.1'
import type { TemplateEntry } from './registry.ts'
import { EmailShell, H1, Label, Lede, PrimaryButton, Quote, SITE_URL } from './_layout.tsx'

interface Props {
  name?: string
  subject?: string
  message?: string
  ticketId?: string
}

const SupportTicketReceivedEmail = ({ name, subject, message, ticketId }: Props) => (
  <EmailShell preview="We received your support request">
    <H1>{name ? `Thanks ${name}, we got your request.` : 'We got your request.'}</H1>
    <Lede>
      Our team will review your message and get back to you within one business day.
      {ticketId ? ` Your reference is #${ticketId.slice(0, 8)}.` : ''}
    </Lede>
    {subject ? (
      <>
        <Label>Subject</Label>
        <Quote>{subject}</Quote>
      </>
    ) : null}
    {message ? (
      <>
        <Label>Your message</Label>
        <Quote>{message}</Quote>
      </>
    ) : null}
    <PrimaryButton href={`${SITE_URL}/portal`}>Open your portal</PrimaryButton>
  </EmailShell>
)

export const template = {
  component: SupportTicketReceivedEmail,
  subject: 'We received your support request',
  displayName: 'Support: ticket received',
  previewData: {
    name: 'Porsia',
    subject: 'Cannot access my files',
    message: 'I am trying to log in and the dashboard never loads.',
    ticketId: 'b8f2c0e1-7a4d-4f9e-9b7c-1a2b3c4d5e6f',
  },
} satisfies TemplateEntry
