import * as React from 'npm:react@18.3.1'
import type { TemplateEntry } from './registry.ts'
import { EmailShell, H1, Lede, PrimaryButton, Quote, SITE_URL } from './_layout.tsx'

interface Props {
  recipientName?: string
  authorName?: string
  approvalTitle?: string
  comment?: string
  audience?: 'admin' | 'client'
}

const ApprovalCommentEmail = ({
  recipientName, authorName, approvalTitle, comment, audience,
}: Props) => (
  <EmailShell preview={`New comment on ${approvalTitle ?? 'an approval'}`}>
    <H1>New comment in your conversation.</H1>
    <Lede>
      {recipientName ? `Hi ${recipientName}, ` : 'Hi, '}
      <strong>{authorName ?? 'Someone'}</strong> left a comment on{' '}
      <strong>{approvalTitle ?? 'an approval'}</strong>.
    </Lede>
    {comment ? <Quote>{comment}</Quote> : null}
    <PrimaryButton href={audience === 'admin' ? `${SITE_URL}/admin` : `${SITE_URL}/portal`}>
      Reply in portal
    </PrimaryButton>
  </EmailShell>
)

export const template = {
  component: ApprovalCommentEmail,
  subject: (d: Record<string, any>) =>
    `New comment${d?.approvalTitle ? ` on ${d.approvalTitle}` : ''}`,
  displayName: 'Approval comment',
  previewData: {
    recipientName: 'Team',
    authorName: 'Porsia',
    approvalTitle: 'Homepage v2 mockup',
    comment: 'Love the headline. Can we try a slightly larger CTA?',
    audience: 'admin',
  },
} satisfies TemplateEntry
