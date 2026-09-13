import { EmailThread } from './types';

export const mockThreads: EmailThread[] = [
  {
    id: 't-101',
    subject: 'Action Required: Review Q3 Marketing Deliverables',
    origin: 'gmail',
    isUnread: true,
    folder: 'imbox',
    workspaceId: 'primary',
    aiActions: [
      {
        type: 'calendar',
        description: 'Meeting requested: "Discuss Q3 Deliverables" on Oct 14 at 2:00 PM PST',
        confidence: 0.98,
      },
    ],
    messages: [
      {
        id: 'm-101',
        sender: {
          name: 'Sarah Jenkins',
          email: 'sarah.j@acmefund.com',
          isTrusted: false,
        },
        recipient: { name: 'You', email: 'user@usafe.in' },
        timestamp: '10:42 AM',
        bodyHtml: `
          <div class="space-y-4">
            <p>Hi team,</p>
            <p>Following up on the Q3 metrics we discussed last week. I've compiled the initial drafts and need everyone to take a look before we finalize the investor presentation.</p>
            <p><strong>Action Item:</strong> Please review the attached slide deck and let me know if we need to adjust the projections for Q4.</p>
            <p>Can we meet on <strong>Thursday, Oct 14 at 2:00 PM PST</strong> to discuss?</p>
            <p>Best,<br/>Sarah</p>
          </div>
        `,
        strippedTrackers: 2,
      },
    ],
  },
  {
    id: 't-102',
    subject: 'System Alert: OpenClaw Mesh Verification Successful',
    origin: 'sovereign',
    isUnread: false,
    folder: 'imbox',
    workspaceId: 'primary',
    messages: [
      {
        id: 'm-102',
        sender: {
          name: 'uSafe Core System',
          email: 'admin@usafe.in',
          isTrusted: true,
        },
        recipient: { name: 'You', email: 'user@usafe.in' },
        timestamp: 'Yesterday',
        bodyHtml: `
          <div class="space-y-4">
            <p>Your local hardware keys have successfully authenticated with the OpenClaw Mesh.</p>
            <p><strong>Status:</strong> Active & Encrypted.<br/><strong>Protocol:</strong> AES-GCM-256 (Local) / TLS 1.3 (Transport)</p>
            <p>All inbound emails from external bridges are currently being scanned and quarantined if necessary.</p>
          </div>
        `,
        strippedTrackers: 0,
      },
    ],
  },
  {
    id: 't-103',
    subject: 'Re: Project Alpha Architecture Specs',
    origin: 'outlook',
    isUnread: true,
    folder: 'imbox',
    workspaceId: 'social',
    messages: [
      {
        id: 'm-103-1',
        sender: {
          name: 'David Chen',
          email: 'david.chen@megacorp.com',
          isTrusted: false,
        },
        recipient: { name: 'You', email: 'user@usafe.in' },
        timestamp: 'Oct 10, 09:15 AM',
        bodyHtml: `<p>Hey, just checking if you had a chance to look at the specs?</p>`,
        strippedTrackers: 1,
      },
      {
        id: 'm-103-2',
        sender: {
          name: 'You',
          email: 'user@usafe.in',
          isTrusted: true,
        },
        recipient: { name: 'David Chen', email: 'david.chen@megacorp.com' },
        timestamp: 'Oct 10, 11:30 AM',
        bodyHtml: `<p>Yes, reviewing them today. Will send over notes by EOD.</p>`,
        strippedTrackers: 0,
      },
      {
        id: 'm-103-3',
        sender: {
          name: 'David Chen',
          email: 'david.chen@megacorp.com',
          isTrusted: false,
        },
        recipient: { name: 'You', email: 'user@usafe.in' },
        timestamp: 'Oct 11, 08:45 AM',
        bodyHtml: `
          <div class="space-y-4">
            <p>Thanks! We also need to decide on the database structure.</p>
            <p>Do you think we should stick to PostgreSQL or look into a NoSQL solution given the new payload requirements?</p>
            <p>Cheers,<br/>David</p>
          </div>
        `,
        strippedTrackers: 4,
      },
    ],
  },
  {
    id: 't-104',
    subject: 'Stripe Receipt [#1942-1200]',
    origin: 'gmail',
    isUnread: false,
    folder: 'paper-trail',
    workspaceId: 'promotions',
    messages: [
      {
        id: 'm-104',
        sender: {
          name: 'Stripe Receipts',
          email: 'receipts@stripe.com',
          isTrusted: false,
        },
        recipient: { name: 'You', email: 'user@usafe.in' },
        timestamp: 'Oct 09',
        bodyHtml: `<p>Your payment of $12.00 for GitHub Pro has been processed.</p>`,
        strippedTrackers: 6,
      },
    ],
  }
];
