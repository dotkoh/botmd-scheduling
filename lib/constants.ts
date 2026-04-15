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

export const ADMIN_USERS = [
  { id: 'all', name: 'All Users' },
  { id: 'admin_1', name: 'Dr. Smith' },
  { id: 'admin_2', name: 'Nurse Ana' },
  { id: 'admin_3', name: 'Reception Desk' },
  { id: 'admin_4', name: 'Radiology Team' },
  { id: 'admin_5', name: 'Wellness Team' },
];

export const ALERT_TRIGGERS = [
  { id: 'new_booking', label: 'New booking request received' },
  { id: 'cancel_reschedule', label: 'Patient cancels or reschedules' },
];
