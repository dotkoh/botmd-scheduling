export interface ContactProperty {
  id: string;
  label: string;
  description: string;
  type: 'string' | 'number' | 'date' | 'phone' | 'email' | 'select' | 'boolean';
  isDefault: boolean;
}

export interface FieldConfig {
  propertyId: string;
  label: string;
  required: boolean;
}

export interface CustomField {
  id: string;
  label: string;
  type: 'text' | 'number' | 'yes_no' | 'select';
  required: boolean;
  options?: string[];
}

export type BookingMethod = 'direct' | 'link' | 'request';

export interface HandoverRule {
  id: string;
  condition: string; // "is" | "requires" | "mentions" | "doesnt_know" | "has"
  value: string;
  label: string; // human-readable: "Handover if patient is an HMO patient"
}

export interface AlertRecipient {
  name: string;
  email: string;
  whatsapp: string;
  viber: string;
  sms: string;
}

export interface AlertConfig {
  enabled: boolean;
  recipients: AlertRecipient[];
  triggers: string[];
}

export interface SchedulingRule {
  id: string;
  status: 'active' | 'paused' | 'draft';
  createdAt: string;
  updatedAt: string;

  // Q1: Calendar
  calendarId: string;
  calendarName: string;

  // Q1: Appointment types
  appointmentTypes: string[];

  // Q2: Description
  description: string;

  // Q3: Eligibility
  eligibility: 'anyone' | 'criteria';
  eligibilityCriteria: string[];

  // Q4: Booking method
  bookingMethod: BookingMethod;
  schedulingLink?: string;
  preferredSlotsCount?: number;

  // Q4: Information to collect
  fields: FieldConfig[];
  customFields: CustomField[];

  // Q5: Handover rules
  handoverRules: HandoverRule[];

  // Q6: Alerts
  alerts: AlertConfig;
}

export interface Calendar {
  id: string;
  name: string;
  appointmentTypes: string[];
}
