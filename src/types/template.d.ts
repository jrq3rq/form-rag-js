export type FormFieldType =
  | 'text'
  | 'email'
  | 'tel'
  | 'number'
  | 'select'
  | 'multi'
  | 'multiselect'
  | 'checkbox'
  | 'textarea'
  | 'section';

export interface FormFieldOption {
  value: string;
  label: string;
}

export interface FormField {
  id: string;
  type: FormFieldType;
  label: string;
  required?: boolean;
  placeholder?: string;
  hint?: string;
  min?: number;
  max?: number;
  step?: number;
  options?: FormFieldOption[];
}

export interface TemplateTheme {
  primary?: string;
  primaryDark?: string;
  surface?: string;
  accent?: string;
}

export type FormDefinition = FormField[] | ((context?: string) => FormField[]);

export type TemplateRule = string | ((value: unknown, formData: Record<string, unknown>) => string | null);

export interface FormRAGTemplate {
  name: string;
  form: FormDefinition;
  prompt: string | ((formData: Record<string, unknown>) => string | Promise<string>);
  rules?: Record<string, TemplateRule>;
  /** Emoji or short symbol shown in header */
  icon?: string;
  tagline?: string;
  description?: string;
  highlights?: string[];
  theme?: TemplateTheme;
  assistantName?: string;
  submitLabel?: string;
  exportLead?: (formData: Record<string, unknown>, messages: ChatMessage[]) => unknown;
  exportFilename?: (formData: Record<string, unknown>) => string;
  initialUserMessage?: (formData: Record<string, unknown>, fields: FormField[]) => string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface CompleteParams {
  messages: { role: 'system' | 'user' | 'assistant'; content: string }[];
  formData?: Record<string, unknown>;
}

export type CompleteFn = (params: CompleteParams) => Promise<string>;

export interface FormRAGProps {
  template: FormRAGTemplate;
  complete?: CompleteFn;
  /** @deprecated Use `complete` with createXaiComplete from your backend */
  apiKey?: string;
  model?: string;
  temperature?: number;
  variant?: 'page' | 'embed';
  onLead?: (lead: unknown, formData: Record<string, unknown>) => void;
  onError?: (error: Error) => void;
  autoDownloadLead?: boolean;
}
