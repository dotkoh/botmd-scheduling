import { SchedulingRule } from './types';

export const MOCK_RULES: SchedulingRule[] = [
  {
    id: 'radiology_mri_ct',
    status: 'active',
    createdAt: '2026-04-01T08:00:00Z',
    updatedAt: '2026-04-10T14:30:00Z',
    calendarId: 'radiology',
    calendarName: 'Radiology Department',
    appointmentTypes: ['MRI Exam', 'CT Scan'],
    bookingMethod: 'request',
    preferredSlotsCount: 3,
    fields: [
      { propertyId: 'full_name', label: 'Full Name', required: true },
      { propertyId: 'mobile_number', label: 'Phone Number', required: true },
      { propertyId: 'date_of_birth', label: 'Date of Birth', required: true },
      { propertyId: 'email', label: 'Email Address', required: false },
    ],
    customFields: [
      { id: 'exam_type', label: 'Type of exam', type: 'select', required: false, options: ['MRI Brain', 'MRI Spine', 'CT Chest', 'CT Abdomen'] },
    ],
    handoverRules: [
      { id: 'r1', condition: 'is', value: 'hmo_patient', label: 'Handover if patient is an HMO patient' },
      { id: 'r2', condition: 'requires', value: 'additional_tests', label: 'Handover if patient requires additional tests' },
      { id: 'r3', condition: 'mentions', value: 'emergency', label: 'Handover if patient mentions emergency' },
    ],
    alerts: {
      enabled: true,
      recipients: [
        { name: 'Radiology Reception', email: 'radiology@clinic.com', whatsapp: '+65 9123 4567', viber: '', sms: '' },
      ],
      triggers: ['new_booking', 'handover'],
    },
  },
  {
    id: 'wellness_screening',
    status: 'active',
    createdAt: '2026-03-15T10:00:00Z',
    updatedAt: '2026-04-08T09:00:00Z',
    calendarId: 'wellness',
    calendarName: 'Wellness Center',
    appointmentTypes: ['Health Screening', 'Executive Checkup'],
    bookingMethod: 'direct',
    fields: [
      { propertyId: 'full_name', label: 'Full Name', required: true },
      { propertyId: 'mobile_number', label: 'Phone Number', required: true },
      { propertyId: 'email', label: 'Email Address', required: true },
      { propertyId: 'date_of_birth', label: 'Date of Birth', required: true },
    ],
    customFields: [],
    handoverRules: [
      { id: 'w1', condition: 'requires', value: 'additional_tests', label: 'Handover if patient requires additional tests' },
      { id: 'w2', condition: 'doesnt_know', value: 'exam_type', label: "Handover if patient doesn't know exam type" },
    ],
    alerts: {
      enabled: true,
      recipients: [
        { name: 'Wellness Team', email: 'wellness@clinic.com', whatsapp: '', viber: '', sms: '' },
      ],
      triggers: ['new_booking', 'handover'],
    },
  },
  {
    id: 'dr_smith_consult',
    status: 'draft',
    createdAt: '2026-02-20T12:00:00Z',
    updatedAt: '2026-04-05T16:00:00Z',
    calendarId: 'dr_smith',
    calendarName: 'Dr. Smith - Cardiology',
    appointmentTypes: ['Consultation'],
    bookingMethod: 'link',
    schedulingLink: 'https://clinic.calendly.com/dr-smith',
    fields: [
      { propertyId: 'full_name', label: 'Full Name', required: true },
      { propertyId: 'mobile_number', label: 'Phone Number', required: true },
      { propertyId: 'reason_for_visit', label: 'Reason for Visit', required: false },
    ],
    customFields: [],
    handoverRules: [],
    alerts: {
      enabled: false,
      recipients: [],
      triggers: [],
    },
  },
];
