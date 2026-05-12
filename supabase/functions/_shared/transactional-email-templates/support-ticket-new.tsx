import * as React from 'npm:react@18.3.1'
import type { TemplateEntry } from './registry.ts'
import { EmailShell, H1, Label, Lede, PrimaryButton, Quote, SITE_URL } from './_layout.tsx'

interface Props {
  name?: string
  email?: string
  subject?: string
  message?: string
  attachmentCount?: number
  ticketId?: string
}

const SupportTicketNewEmail = ({
  name, email, subject, message, attachmentCount, ticketId,
}: Props) => (
  <EmailShell preview={`New support ticket: ${subject ?? 'request'}`}>
    <H1>New support ticket received.</H1>
    <Lede>
      <strong>{name ?? 'A user'}</strong>
      {email ? ` (${email})` : ''} just submitted a support request.
      {attachmentCount ? ` They attached ${attachmentCount} screenshot${attachmentCount === 1 ? '' : 's'}.` : ''}
    </Lede>
    {subject ? (
      <>
        <Label>Subject</Label>
        <Quote>{subject}</Quote>
      </>
    ) : null}
    {message ? (
      <>
        <Label>Message</Label>
        <Quote>{message}</Quote>
      </>
    ) : null}
    <PrimaryButton href={`${SITE_URL}/admin`}>Open admin console</PrimaryButton>
  </EmailShell>
)

export const template = {
  component: SupportTicketNewEmail,
  subject: (d: Record<string, any>) =>
    `New support ticket${d?.subject ? `: ${d.subject}` : ''}`,
  displayName: 'Support: ticket new (admin)',
  previewData: {
    name: 'Porsia',
    email: 'porsia@example.com',
    subject: 'Cannot access my files',
    message: 'I am trying to log in and the dashboard never loads.',
    attachmentCount: 2,
    ticketId: 'b8f2c0e1',
  },
} satisfies TemplateEntry
