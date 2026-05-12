import * as React from 'npm:react@18.3.1'
import type { TemplateEntry } from './registry.ts'
import { EmailShell, H1, Label, Lede, PrimaryButton, Quote, SITE_URL } from './_layout.tsx'

interface Props {
  clientName?: string
  clientCompany?: string
  approvalTitle?: string
  decision?: 'approved' | 'changes_requested'
}

const ApprovalDecidedEmail = ({
  clientName, clientCompany, approvalTitle, decision,
}: Props) => {
  const approved = decision === 'approved'
  return (
    <EmailShell preview={approved ? 'Client approved a deliverable' : 'Client requested changes'}>
      <H1>{approved ? 'A client just approved.' : 'A client requested changes.'}</H1>
      <Lede>
        <strong>{clientCompany || clientName || 'A client'}</strong>{' '}
        {approved ? 'approved' : 'left feedback on'}{' '}
        <strong>{approvalTitle ?? 'a deliverable'}</strong>.
      </Lede>
      <Label>What to do</Label>
      <Quote>
        {approved
          ? 'Move on to the next milestone in the timeline.'
          : 'Open the portal to read their comments and respond.'}
      </Quote>
      <PrimaryButton href={`${SITE_URL}/admin`}>Open admin console</PrimaryButton>
    </EmailShell>
  )
}

export const template = {
  component: ApprovalDecidedEmail,
  subject: (d: Record<string, any>) => {
    const who = d?.clientCompany || d?.clientName || 'Client'
    return d?.decision === 'approved'
      ? `${who} approved: ${d?.approvalTitle ?? 'a deliverable'}`
      : `${who} requested changes: ${d?.approvalTitle ?? 'a deliverable'}`
  },
  displayName: 'Approval decided (admin)',
  previewData: {
    clientName: 'Porsia',
    clientCompany: 'Atelier Maison',
    approvalTitle: 'Homepage v2 mockup',
    decision: 'approved',
  },
} satisfies TemplateEntry
