export type AccountOrigin = 'sovereign' | 'gmail' | 'outlook';

export interface Workspace {
  id: string;
  label: string;
}

export interface EmailSender {
  name: string;
  email: string;
  avatarUrl?: string;
  isTrusted: boolean;
}

export interface EmailMessage {
  id: string;
  sender: EmailSender;
  recipient: { name: string; email: string };
  timestamp: string;
  bodyHtml: string;
  strippedTrackers: number;
}

export interface AiAction {
  type: 'calendar' | 'task' | 'alert';
  description: string;
  confidence: number;
}

export interface EmailThread {
  id: string;
  subject: string;
  origin: AccountOrigin;
  isUnread: boolean;
  folder: 'imbox' | 'screener' | 'paper-trail' | 'the-feed';
  workspaceId: string;
  messages: EmailMessage[];
  aiActions?: AiAction[];
}
