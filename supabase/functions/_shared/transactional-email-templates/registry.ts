/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1'

export interface TemplateEntry {
  component: React.ComponentType<any>
  subject: string | ((data: Record<string, any>) => string)
  to?: string
  displayName?: string
  previewData?: Record<string, any>
}

import { template as cartRequestOwner } from './cart-request-owner.tsx'
import { template as cartRequestCustomer } from './cart-request-customer.tsx'
import { template as contactMessageCustomer } from './contact-message-customer.tsx'
import { template as milestoneUpdate } from './milestone-update.tsx'
import { template as approvalRequested } from './approval-requested.tsx'
import { template as approvalDecided } from './approval-decided.tsx'
import { template as approvalComment } from './approval-comment.tsx'
import { template as referralInvitation } from './referral-invitation.tsx'
import { template as supportTicketReceived } from './support-ticket-received.tsx'
import { template as supportTicketNew } from './support-ticket-new.tsx'
import { template as paymentReceipt } from './payment-receipt.tsx'

export const TEMPLATES: Record<string, TemplateEntry> = {
  'cart-request-owner': cartRequestOwner,
  'cart-request-customer': cartRequestCustomer,
  'contact-message-customer': contactMessageCustomer,
  'milestone-update': milestoneUpdate,
  'approval-requested': approvalRequested,
  'approval-decided': approvalDecided,
  'approval-comment': approvalComment,
  'referral-invitation': referralInvitation,
  'support-ticket-received': supportTicketReceived,
  'support-ticket-new': supportTicketNew,
  'payment-receipt': paymentReceipt,
}
