import * as React from 'npm:react@18.3.1'
import type { TemplateEntry } from './registry.ts'
import { EmailShell, H1, Label, Lede, PrimaryButton, Quote, SITE_URL } from './_layout.tsx'

interface Props {
  clientName?: string
  approvalTitle?: string
  approvalDescription?: string
  previewUrl?: string
}

const ApprovalRequestedEmail = ({
  clientName, approvalTitle, approvalDescription, previewUrl,
}: Props) => (
  <EmailShell preview={`Approval needed: ${approvalTitle ?? 'review request'}`}>
    <H1>Your review is requested.</H1>
    <Lede>
      {clientName ? `Hi ${clientName}, ` : 'Hi, '}
      we just sent something for your approval:
      {' '}<strong>{approvalTitle ?? 'a deliverable'}</strong>.
      Open your portal to review it and either approve or request changes.
    </Lede>
    {approvalDescription ? (
      <>
        <Label>What to look at</Label>
        <Quote>{approvalDescription}</Quote>
      </>
    ) : null}
    <PrimaryButton href={`${SITE_URL}/portal`}>Review in portal</PrimaryButton>
    {previewUrl ? (
      <Lede>
        Direct preview link:{' '}
        <a href={previewUrl} style={{ color: '#2B5B4B', textDecoration: 'underline' }}>
          {previewUrl}
        </a>
      </Lede>
    ) : null}
  </EmailShell>
)

export const template = {
  component: ApprovalRequestedEmail,
  subject: (d: Record<string, any>) =>
    `Approval needed${d?.approvalTitle ? `: ${d.approvalTitle}` : ''}`,
  displayName: 'Approval requested',
  previewData: {
    clientName: 'Porsia',
    approvalTitle: 'Homepage v2 mockup',
    approvalDescription: 'Look out for typography balance and CTA placement.',
    previewUrl: 'https://figma.com/file/example',
  },
} satisfies TemplateEntry
