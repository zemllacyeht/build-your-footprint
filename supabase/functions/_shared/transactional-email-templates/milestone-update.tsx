import * as React from 'npm:react@18.3.1'
import type { TemplateEntry } from './registry.ts'
import { EmailShell, H1, Label, Lede, PrimaryButton, Quote, SITE_URL } from './_layout.tsx'

interface Props {
  clientName?: string
  milestoneTitle?: string
  milestoneDescription?: string
  status?: string
  dueDate?: string
  event?: 'created' | 'updated' | 'completed'
}

const verb = (event?: Props['event']) => {
  if (event === 'completed') return 'completed'
  if (event === 'created') return 'added'
  return 'updated'
}

const MilestoneUpdateEmail = ({
  clientName, milestoneTitle, milestoneDescription, status, dueDate, event,
}: Props) => (
  <EmailShell preview={`Milestone ${verb(event)}: ${milestoneTitle ?? 'project update'}`}>
    <H1>
      {event === 'completed' ? 'A milestone is complete.' : `Your project just moved forward.`}
    </H1>
    <Lede>
      {clientName ? `Hi ${clientName}, ` : 'Hi, '}
      we have {verb(event)} a milestone on your build:
      {' '}<strong>{milestoneTitle ?? 'a milestone'}</strong>.
      {status ? ` It is now marked as ${status.replace('_', ' ')}.` : ''}
      {dueDate ? ` Target date: ${dueDate}.` : ''}
    </Lede>
    {milestoneDescription ? (
      <>
        <Label>Details</Label>
        <Quote>{milestoneDescription}</Quote>
      </>
    ) : null}
    <PrimaryButton href={`${SITE_URL}/portal`}>Open your portal</PrimaryButton>
  </EmailShell>
)

export const template = {
  component: MilestoneUpdateEmail,
  subject: (d: Record<string, any>) => {
    const v = verb(d?.event)
    const t = d?.milestoneTitle ? `: ${d.milestoneTitle}` : ''
    return `Milestone ${v}${t}`
  },
  displayName: 'Milestone update',
  previewData: {
    clientName: 'Porsia',
    milestoneTitle: 'Design',
    milestoneDescription: 'Visual direction and key page mockups approved.',
    status: 'complete',
    dueDate: '2026-05-30',
    event: 'completed',
  },
} satisfies TemplateEntry
