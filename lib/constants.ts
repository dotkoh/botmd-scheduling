import { ContactProperty, Calendar } from './types';

export const CONTACT_PROPERTIES: ContactProperty[] = [
  { id: 'full_name', label: 'Full Name', description: 'The complete name of the user/patient.', type: 'string', isDefault: true },
  { id: 'mobile_number', label: 'Phone Number', description: 'The mobile phone number of the patient.', type: 'phone', isDefault: true },
  { id: 'email', label: 'Email Address', description: 'The email address of the user.', type: 'email', isDefault: true },
  { id: 'date_of_birth', label: 'Date of Birth', description: 'The date of birth of the patient.', type: 'date', isDefault: true },
  { id: 'gender', label: 'Gender', description: 'The gender or sex of the user.', type: 'string', isDefault: true },
  { id: 'age', label: 'Age', description: 'The age of the user in years.', type: 'number', isDefault: true },
  { id: 'address', label: 'Address', description: 'The residential address of the user.', type: 'string', isDefault: true },
  { id: 'patient_id', label: 'Patient ID', description: 'The unique patient identifier in the hospital system.', type: 'string', isDefault: true },
  { id: 'nric_id', label: 'NRIC/ID', description: 'National ID or registration number.', type: 'string', isDefault: true },
  { id: 'whatsapp_name', label: 'WhatsApp Name', description: 'The display name on WhatsApp.', type: 'string', isDefault: true },
  { id: 'messenger_name', label: 'Messenger Name', description: 'The display name on Messenger.', type: 'string', isDefault: true },
  { id: 'social_media_id', label: 'Social Media ID', description: 'The social media identifier of the user.', type: 'string', isDefault: true },
  { id: 'reason_for_visit', label: 'Reason for Visit', description: 'The reason or purpose of the appointment.', type: 'string', isDefault: false },
  { id: 'insurance_provider', label: 'Insurance Provider', description: 'The insurance provider of the patient.', type: 'string', isDefault: false },
  { id: 'hmo_type', label: 'HMO / Insurance Type', description: 'The type of HMO or insurance coverage.', type: 'string', isDefault: false },
  { id: 'referring_doctor', label: 'Referring Doctor', description: 'The doctor who referred the patient.', type: 'string', isDefault: false },
  { id: 'medical_record_number', label: 'Medical Record Number', description: 'The medical record number in the hospital system.', type: 'string', isDefault: false },
];

export const CALENDARS: Calendar[] = [
  {
    id: 'radiology',
    name: 'Radiology Department',
    appointmentTypes: ['MRI Exam', 'CT Scan', 'X-Ray', 'Ultrasound', 'Mammogram'],
  },
  {
    id: 'wellness',
    name: 'Wellness Center',
    appointmentTypes: ['Health Screening', 'Executive Checkup', 'Pre-Employment Medical', 'Annual Physical'],
  },
  {
    id: 'dr_smith',
    name: 'Dr. Smith - Cardiology',
    appointmentTypes: ['Consultation', 'Follow-up', 'ECG Test', 'Stress Test', 'Echocardiogram'],
  },
  {
    id: 'dr_lee',
    name: 'Dr. Lee - General Practice',
    appointmentTypes: ['Consultation', 'Follow-up', 'Vaccination', 'Medical Certificate'],
  },
  {
    id: 'lab',
    name: 'Lab Services',
    appointmentTypes: ['Blood Test', 'Urinalysis', 'COVID Test', 'Allergy Test'],
  },
];

export const BOOKING_METHODS = [
  {
    value: 'direct' as const,
    label: 'Direct booking with AI',
    description: 'Patient selects a slot \u2192 confirmed immediately',
  },
  {
    value: 'link' as const,
    label: 'Send scheduling link',
    description: 'AI sends a link (Calendly, etc.) \u2192 patient books there',
  },
  {
    value: 'request' as const,
    label: 'Request preferred date and time',
    description: 'Patient submits preferences \u2192 admin confirms',
  },
];

export const HANDOVER_CONDITIONS = [
  { value: 'is', label: 'is an' },
  { value: 'requires', label: 'requires' },
  { value: 'mentions', label: 'mentions' },
  { value: 'doesnt_know', label: "doesn't know" },
  { value: 'has', label: 'has' },
];

export const HANDOVER_VALUES: Record<string, { value: string; label: string }[]> = {
  is: [
    { value: 'hmo_patient', label: 'HMO patient' },
    { value: 'private_patient', label: 'private patient' },
    { value: 'new_patient', label: 'new patient' },
    { value: 'existing_patient', label: 'existing patient' },
  ],
  requires: [
    { value: 'additional_tests', label: 'additional tests' },
    { value: 'contrast', label: 'contrast' },
    { value: 'sedation', label: 'sedation' },
    { value: 'special_preparation', label: 'special preparation' },
  ],
  mentions: [
    { value: 'emergency', label: 'emergency' },
    { value: 'urgent', label: 'urgent' },
    { value: 'pain', label: 'pain' },
    { value: 'bleeding', label: 'bleeding' },
  ],
  doesnt_know: [
    { value: 'exam_type', label: 'exam type' },
    { value: 'date_preference', label: 'date preference' },
    { value: 'insurance_details', label: 'insurance details' },
  ],
  has: [
    { value: 'allergy', label: 'allergy' },
    { value: 'pacemaker', label: 'pacemaker' },
    { value: 'implant', label: 'implant' },
  ],
};

export const ALERT_TRIGGERS = [
  { id: 'new_booking', label: 'New booking request received' },
  { id: 'handover', label: 'Patient handed over to human' },
  { id: 'cancel_reschedule', label: 'Patient cancels or reschedules' },
  { id: 'daily_summary', label: 'Daily summary' },
];
