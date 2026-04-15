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

export type BookingMethod = 'direct' | 'link' | 'request';

export type IneligibleAction = 'handover' | 'inform_call';
export type ReschedulePolicy = 'yes' | 'no_handover' | 'no_call';
export type CancelPolicy = 'yes' | 'no_handover' | 'no_call';
export type NoSlotsAction = 'handover' | 'inform';
export type NoSuitableAction = 'offer_next' | 'handover';

export interface DirectBookingConfig {
  slotsToOffer: number;
  advanceAmount: number;
  advanceUnit: 'days' | 'weeks' | 'months';
  noSlotsAction: NoSlotsAction;
  noSuitableAction: NoSuitableAction;
  maxRetries: number;
}

export interface AlertConfig {
  enabled: boolean;
  alertUsers: string[];
  triggers: string[];
}

export interface SchedulingRule {
  id: string;
  status: 'active' | 'draft';
  createdAt: string;
  updatedAt: string;

  // 1: Details
  calendarId: string;
  calendarName: string;
  appointmentTypes: string[];

  // 2: Description
  description: string;

  // 3: Eligibility
  eligibility: 'anyone' | 'criteria';
  eligibilityCriteria: string[];
  ineligibleAction: IneligibleAction;
  ineligibleCallNumber: string;

  // 4: Booking method
  bookingMethod: BookingMethod;
  directConfig: DirectBookingConfig;
  preferredSlotsCount: number;

  // 5: Information to collect
  fields: FieldConfig[];

  // 6: Reschedule policy
  reschedulePolicy: ReschedulePolicy;
  rescheduleAmount: number;
  rescheduleUnit: 'hours' | 'days' | 'weeks' | 'months';
  rescheduleCallNumber: string;

  // 7: Cancel policy
  cancelPolicy: CancelPolicy;
  cancelAmount: number;
  cancelUnit: 'hours' | 'days' | 'weeks' | 'months';
  cancelCallNumber: string;

  // 8: Alerts
  alerts: AlertConfig;
}

export interface Calendar {
  id: string;
  name: string;
  appointmentTypes: string[];
}
