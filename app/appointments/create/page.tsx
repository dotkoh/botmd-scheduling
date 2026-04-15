'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/lib/store';
import { CALENDARS, CONTACT_PROPERTIES, ADMIN_USERS, ALERT_TRIGGERS } from '@/lib/constants';
import {
  SchedulingRule, FieldConfig, BookingMethod,
  IneligibleAction, ReschedulePolicy, CancelPolicy,
  NoSlotsAction, NoSuitableAction, DirectBookingConfig,
} from '@/lib/types';
import Button from '@/components/ui/Button';
import Checkbox from '@/components/ui/Checkbox';
import TagInput from '@/components/ui/TagInput';

function SectionNumber({ n }: { n: number }) {
  return (
    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-sm font-semibold flex-shrink-0">
      {n}
    </div>
  );
}

function StyledSelect({ value, onChange, children, className = '' }: {
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`relative inline-block ${className}`}>
      <select
        value={value}
        onChange={onChange}
        className="appearance-none pl-3 pr-8 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {children}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2.5">
        <svg className="h-4 w-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </div>
    </div>
  );
}

export default function CreatePage() {
  const router = useRouter();
  const { addRule } = useStore();

  // 1: Details
  const [calendarId, setCalendarId] = useState('');
  const [appointmentTypes, setAppointmentTypes] = useState<string[]>([]);
  // 2: Description
  const [description, setDescription] = useState('');
  const [isRewriting, setIsRewriting] = useState(false);
  // 3: Eligibility
  const [eligibility, setEligibility] = useState<'anyone' | 'criteria'>('anyone');
  const [eligibilityCriteria, setEligibilityCriteria] = useState<string[]>([]);
  const [newCriterion, setNewCriterion] = useState('');
  const [ineligibleAction, setIneligibleAction] = useState<IneligibleAction>('handover');
  const [ineligibleCallNumber, setIneligibleCallNumber] = useState('');
  // 4: Booking method
  const [bookingMethod, setBookingMethod] = useState<BookingMethod>('direct');
  const [directConfig, setDirectConfig] = useState<DirectBookingConfig>({
    slotsToOffer: 3, advanceAmount: 2, advanceUnit: 'weeks',
    noSlotsAction: 'handover', noSuitableAction: 'offer_next', maxRetries: 3,
  });
  const [preferredSlotsCount, setPreferredSlotsCount] = useState(3);
  // 5: Fields
  const [selectedFields, setSelectedFields] = useState<FieldConfig[]>([]);
  // 6: Reschedule
  const [reschedulePolicy, setReschedulePolicy] = useState<ReschedulePolicy>('yes');
  const [rescheduleAmount, setRescheduleAmount] = useState(24);
  const [rescheduleUnit, setRescheduleUnit] = useState<'hours' | 'days' | 'weeks' | 'months'>('hours');
  const [rescheduleCallNumber, setRescheduleCallNumber] = useState('');
  // 7: Cancel
  const [cancelPolicy, setCancelPolicy] = useState<CancelPolicy>('yes');
  const [cancelAmount, setCancelAmount] = useState(24);
  const [cancelUnit, setCancelUnit] = useState<'hours' | 'days' | 'weeks' | 'months'>('hours');
  const [cancelCallNumber, setCancelCallNumber] = useState('');
  // 8: Alerts
  const [alertEnabled, setAlertEnabled] = useState(true);
  const [alertUsers, setAlertUsers] = useState<string[]>([]);
  const [alertTriggers, setAlertTriggers] = useState<string[]>(['new_booking', 'cancel_reschedule']);

  const selectedCalendar = CALENDARS.find(c => c.id === calendarId);

  const propertyOptions = CONTACT_PROPERTIES.map(p => ({
    value: p.id,
    label: p.label,
    group: p.isDefault ? 'DEFAULT PROPERTIES' : 'CUSTOM PROPERTIES',
  }));

  function handlePropertyChange(selected: string[]) {
    const newFields: FieldConfig[] = selected.map(id => {
      const existing = selectedFields.find(f => f.propertyId === id);
      if (existing) return existing;
      const prop = CONTACT_PROPERTIES.find(p => p.id === id);
      return { propertyId: id, label: prop?.label || id, required: false };
    });
    setSelectedFields(newFields);
  }

  function toggleRequired(propertyId: string) {
    setSelectedFields(prev =>
      prev.map(f => (f.propertyId === propertyId ? { ...f, required: !f.required } : f))
    );
  }

  function handleRewrite() {
    if (!description.trim()) return;
    setIsRewriting(true);
    setTimeout(() => {
      const sentences = description.split(/[.!]\s*/g).filter(Boolean);
      const rewritten = sentences.map(s => s.charAt(0).toUpperCase() + s.slice(1).trim()).join('. ') + '.';
      setDescription(rewritten);
      setIsRewriting(false);
    }, 1200);
  }

  function toggleAlertTrigger(triggerId: string) {
    setAlertTriggers(prev =>
      prev.includes(triggerId) ? prev.filter(t => t !== triggerId) : [...prev, triggerId]
    );
  }

  function getSubheader() {
    const cal = selectedCalendar?.name || '';
    const types = appointmentTypes.length > 0
      ? appointmentTypes.map(t => t.includes('__all__') ? 'All Appointments' : t).join(', ')
      : 'All Appointments';
    return `${cal} | ${types}`;
  }

  function handleSave() {
    const id = `rule_${Date.now()}`;
    const now = new Date().toISOString();
    const rule: SchedulingRule = {
      id,
      status: 'active',
      createdAt: now,
      updatedAt: now,
      calendarId,
      calendarName: selectedCalendar?.name || '',
      appointmentTypes,
      description,
      eligibility,
      eligibilityCriteria: eligibility === 'criteria' ? eligibilityCriteria : [],
      ineligibleAction: eligibility === 'criteria' ? ineligibleAction : 'handover',
      ineligibleCallNumber: ineligibleAction === 'inform_call' ? ineligibleCallNumber : '',
      bookingMethod,
      directConfig,
      preferredSlotsCount,
      fields: selectedFields,
      reschedulePolicy,
      rescheduleAmount: reschedulePolicy === 'yes' ? rescheduleAmount : 0,
      rescheduleUnit,
      rescheduleCallNumber: reschedulePolicy === 'no_call' ? rescheduleCallNumber : '',
      cancelPolicy,
      cancelAmount: cancelPolicy === 'yes' ? cancelAmount : 0,
      cancelUnit,
      cancelCallNumber: cancelPolicy === 'no_call' ? cancelCallNumber : '',
      alerts: {
        enabled: alertEnabled,
        alertUsers: alertEnabled ? alertUsers : [],
        triggers: alertEnabled ? alertTriggers : [],
      },
    };
    addRule(rule);
    router.push('/');
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-8">
      <div className="mb-8">
        <button
          onClick={() => router.push('/')}
          className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4"
        >
          <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          Back
        </button>
        <h1 className="text-xl font-bold text-gray-900">Configure Scheduling Rules</h1>
      </div>

      <div className="space-y-8">

        {/* ── 1. Details ── */}
        <section className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-start gap-3 mb-4">
            <SectionNumber n={1} />
            <h2 className="text-base font-semibold text-gray-900">Details</h2>
          </div>
          <div className="ml-11 space-y-5">
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700">Select Calendar Account</label>
              <StyledSelect
                value={calendarId}
                onChange={e => { setCalendarId(e.target.value); setAppointmentTypes([]); }}
                className="w-full"
              >
                <option value="" disabled>Choose a calendar account</option>
                {CALENDARS.map(cal => (
                  <option key={cal.id} value={cal.id}>{cal.name}</option>
                ))}
              </StyledSelect>
            </div>
            {calendarId && (
              <TagInput
                label="Which appointment types will this apply to?"
                options={[
                  { value: '__all__', label: 'All Appointments' },
                  ...(selectedCalendar?.appointmentTypes.map(t => ({ value: t, label: t })) || []),
                ]}
                selected={appointmentTypes}
                onChange={setAppointmentTypes}
                placeholder="All Appointments"
              />
            )}
          </div>
        </section>

        {/* ── 2. Describe ── */}
        {calendarId && (
          <section className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-start gap-3 mb-1">
              <SectionNumber n={2} />
              <div>
                <h2 className="text-base font-semibold text-gray-900">Describe this appointment</h2>
                <p className="text-sm text-gray-500 mt-0.5">Helps the AI understand context and handle patient questions</p>
              </div>
            </div>
            <div className="ml-11 mt-4">
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="e.g. This MRI/CT scan appointment is for patients who have been referred by their doctor. Patients must submit their referral letter in chat to book their appointment. Patients without a referral letter will be handed over to a human agent."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-y min-h-[100px]"
              />
              <div className="flex items-center justify-between mt-1.5">
                <p className="text-xs text-gray-400 flex items-center gap-1">
                  <span>{'\u{1F4A1}'}</span> Write like you&apos;re briefing a new receptionist
                </p>
                <button
                  onClick={handleRewrite}
                  disabled={!description.trim() || isRewriting}
                  className="flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:text-blue-700 disabled:text-gray-300 disabled:cursor-not-allowed"
                >
                  {isRewriting ? (
                    <>
                      <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Rewriting...
                    </>
                  ) : (
                    <>
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                      </svg>
                      Rewrite with AI
                    </>
                  )}
                </button>
              </div>
            </div>
          </section>
        )}

        {/* ── 3. Who can book ── */}
        {calendarId && (
          <section className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-start gap-3 mb-1">
              <SectionNumber n={3} />
              <h2 className="text-base font-semibold text-gray-900">Who can book this appointment?</h2>
            </div>
            <div className="ml-11 mt-4 space-y-3">
              <label className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${eligibility === 'anyone' ? 'border-blue-500 bg-blue-50/50' : 'border-gray-200 hover:border-gray-300'}`}>
                <input type="radio" name="eligibility" checked={eligibility === 'anyone'} onChange={() => setEligibility('anyone')} className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500" />
                <span className="text-sm text-gray-700">Anyone</span>
              </label>
              <label className={`flex items-start gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${eligibility === 'criteria' ? 'border-blue-500 bg-blue-50/50' : 'border-gray-200 hover:border-gray-300'}`}>
                <input type="radio" name="eligibility" checked={eligibility === 'criteria'} onChange={() => setEligibility('criteria')} className="mt-0.5 w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500" />
                <span className="text-sm text-gray-700">Patients who meet these criteria:</span>
              </label>

              {eligibility === 'criteria' && (
                <div className="space-y-4 pl-2">
                  <p className="text-xs text-gray-500">AI will check if patient meets this criteria during the conversation to determine if they are eligible to book</p>
                  {eligibilityCriteria.map((criterion, index) => (
                    <div key={index} className="flex items-center gap-2 p-2.5 bg-gray-50 rounded-lg">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0" />
                      <span className="text-sm text-gray-700 flex-1">{criterion}</span>
                      <button onClick={() => setEligibilityCriteria(prev => prev.filter((_, i) => i !== index))} className="text-gray-400 hover:text-red-500 flex-shrink-0">
                        <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                      </button>
                    </div>
                  ))}
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={newCriterion}
                      onChange={e => setNewCriterion(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter' && newCriterion.trim()) { e.preventDefault(); setEligibilityCriteria(prev => [...prev, newCriterion.trim()]); setNewCriterion(''); } }}
                      placeholder="e.g. Patient must have a doctor referral"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <Button size="sm" disabled={!newCriterion.trim()} onClick={() => { if (newCriterion.trim()) { setEligibilityCriteria(prev => [...prev, newCriterion.trim()]); setNewCriterion(''); } }}>Add</Button>
                  </div>

                  {/* What happens if not eligible */}
                  <div className="border-t border-gray-100 pt-4 space-y-3">
                    <p className="text-sm font-medium text-gray-700">What happens if the patient does not meet the criteria?</p>
                    <label className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${ineligibleAction === 'handover' ? 'border-blue-500 bg-blue-50/50' : 'border-gray-200 hover:border-gray-300'}`}>
                      <input type="radio" name="ineligible" checked={ineligibleAction === 'handover'} onChange={() => setIneligibleAction('handover')} className="w-4 h-4 text-blue-600 border-gray-300" />
                      <span className="text-sm text-gray-700">Handover to human immediately</span>
                    </label>
                    <label className={`flex items-start gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${ineligibleAction === 'inform_call' ? 'border-blue-500 bg-blue-50/50' : 'border-gray-200 hover:border-gray-300'}`}>
                      <input type="radio" name="ineligible" checked={ineligibleAction === 'inform_call'} onChange={() => setIneligibleAction('inform_call')} className="mt-0.5 w-4 h-4 text-blue-600 border-gray-300" />
                      <span className="text-sm text-gray-700">Inform patient they are not eligible and end the conversation with option to call</span>
                    </label>
                    {ineligibleAction === 'inform_call' && (
                      <div className="pl-7">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone number to call</label>
                        <input type="tel" value={ineligibleCallNumber} onChange={e => setIneligibleCallNumber(e.target.value)} placeholder="+65 6123 4567" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {/* ── 4. How to book ── */}
        {calendarId && (
          <section className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-start gap-3 mb-1">
              <SectionNumber n={4} />
              <div>
                <h2 className="text-base font-semibold text-gray-900">How would you like patients to book?</h2>
                <p className="text-sm text-gray-500 mt-0.5">{getSubheader()}</p>
              </div>
            </div>
            <div className="ml-11 space-y-3 mt-4">
              {/* Direct */}
              <label className={`flex items-start gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${bookingMethod === 'direct' ? 'border-blue-500 bg-blue-50/50' : 'border-gray-200 hover:border-gray-300'}`}>
                <input type="radio" name="bookingMethod" checked={bookingMethod === 'direct'} onChange={() => setBookingMethod('direct')} className="mt-0.5 w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500" />
                <div>
                  <span className="text-sm font-medium text-gray-900">Scheduling AI to book directly</span>
                  <p className="text-xs text-gray-500 mt-0.5">AI offers patient slots to choose from &rarr; Patient can select their preferred slot &rarr; Appointment is confirmed immediately</p>
                </div>
              </label>

              {bookingMethod === 'direct' && (
                <div className="ml-7 p-4 bg-gray-50 rounded-lg space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">How many slots to offer patient?</label>
                    <StyledSelect value={directConfig.slotsToOffer} onChange={e => setDirectConfig(prev => ({ ...prev, slotsToOffer: Number(e.target.value) }))}>
                      {[1, 2, 3, 4, 5].map(n => (
                        <option key={n} value={n}>{n} appointment slot{n > 1 ? 's' : ''}</option>
                      ))}
                    </StyledSelect>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">How far in advance can patient book?</label>
                    <div className="flex items-center gap-2">
                      <input type="number" min={1} value={directConfig.advanceAmount} onChange={e => setDirectConfig(prev => ({ ...prev, advanceAmount: Number(e.target.value) }))} className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                      <StyledSelect value={directConfig.advanceUnit} onChange={e => setDirectConfig(prev => ({ ...prev, advanceUnit: e.target.value as DirectBookingConfig['advanceUnit'] }))}>
                        <option value="days">Days</option>
                        <option value="weeks">Weeks</option>
                        <option value="months">Months</option>
                      </StyledSelect>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-700">If no slots are available within the selected window, what should the AI do?</p>
                    <label className={`flex items-center gap-3 p-2.5 border rounded-lg cursor-pointer transition-colors ${directConfig.noSlotsAction === 'handover' ? 'border-blue-500 bg-blue-50/50' : 'border-gray-200 hover:border-gray-300'}`}>
                      <input type="radio" name="noSlots" checked={directConfig.noSlotsAction === 'handover'} onChange={() => setDirectConfig(prev => ({ ...prev, noSlotsAction: 'handover' as NoSlotsAction }))} className="w-4 h-4 text-blue-600 border-gray-300" />
                      <span className="text-sm text-gray-700">Handover to human</span>
                    </label>
                    <label className={`flex items-center gap-3 p-2.5 border rounded-lg cursor-pointer transition-colors ${directConfig.noSlotsAction === 'inform' ? 'border-blue-500 bg-blue-50/50' : 'border-gray-200 hover:border-gray-300'}`}>
                      <input type="radio" name="noSlots" checked={directConfig.noSlotsAction === 'inform'} onChange={() => setDirectConfig(prev => ({ ...prev, noSlotsAction: 'inform' as NoSlotsAction }))} className="w-4 h-4 text-blue-600 border-gray-300" />
                      <span className="text-sm text-gray-700">Inform patient no slots are available</span>
                    </label>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-700">If patient indicates that none of the slots are suitable, what should the AI do?</p>
                    <label className={`flex items-start gap-3 p-2.5 border rounded-lg cursor-pointer transition-colors ${directConfig.noSuitableAction === 'offer_next' ? 'border-blue-500 bg-blue-50/50' : 'border-gray-200 hover:border-gray-300'}`}>
                      <input type="radio" name="noSuitable" checked={directConfig.noSuitableAction === 'offer_next'} onChange={() => setDirectConfig(prev => ({ ...prev, noSuitableAction: 'offer_next' as NoSuitableAction }))} className="mt-0.5 w-4 h-4 text-blue-600 border-gray-300" />
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm text-gray-700">Offer the next set of appointment slots within the appointment window. Maximum tries</span>
                        <input type="number" min={1} max={10} value={directConfig.maxRetries} onChange={e => setDirectConfig(prev => ({ ...prev, maxRetries: Number(e.target.value) }))} className="w-16 px-2 py-1 border border-gray-300 rounded text-sm text-center focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        <span className="text-sm text-gray-700">times after which handover to human</span>
                      </div>
                    </label>
                    <label className={`flex items-center gap-3 p-2.5 border rounded-lg cursor-pointer transition-colors ${directConfig.noSuitableAction === 'handover' ? 'border-blue-500 bg-blue-50/50' : 'border-gray-200 hover:border-gray-300'}`}>
                      <input type="radio" name="noSuitable" checked={directConfig.noSuitableAction === 'handover'} onChange={() => setDirectConfig(prev => ({ ...prev, noSuitableAction: 'handover' as NoSuitableAction }))} className="w-4 h-4 text-blue-600 border-gray-300" />
                      <span className="text-sm text-gray-700">Handover to human immediately</span>
                    </label>
                  </div>
                </div>
              )}

              {/* Link */}
              <label className={`flex items-start gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${bookingMethod === 'link' ? 'border-blue-500 bg-blue-50/50' : 'border-gray-200 hover:border-gray-300'}`}>
                <input type="radio" name="bookingMethod" checked={bookingMethod === 'link'} onChange={() => setBookingMethod('link')} className="mt-0.5 w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500" />
                <div>
                  <span className="text-sm font-medium text-gray-900">Send scheduling link</span>
                  <p className="text-xs text-gray-500 mt-0.5">AI returns scheduling link to booking portal</p>
                </div>
              </label>

              {bookingMethod === 'link' && (
                <div className="ml-7 p-4 bg-gray-50 rounded-lg">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Scheduling link URL</label>
                  <input
                    type="text"
                    value="Will be generated by backend"
                    disabled
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-400 bg-gray-100 cursor-not-allowed"
                  />
                  <p className="text-xs text-gray-400 mt-1">This link will be automatically generated</p>
                </div>
              )}

              {/* Request */}
              <label className={`flex items-start gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${bookingMethod === 'request' ? 'border-blue-500 bg-blue-50/50' : 'border-gray-200 hover:border-gray-300'}`}>
                <input type="radio" name="bookingMethod" checked={bookingMethod === 'request'} onChange={() => setBookingMethod('request')} className="mt-0.5 w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500" />
                <div>
                  <span className="text-sm font-medium text-gray-900">Request preferred date and time</span>
                  <p className="text-xs text-gray-500 mt-0.5">e.g. Preferred Date, Preferred Time: AM/PM</p>
                </div>
              </label>

              {bookingMethod === 'request' && (
                <div className="ml-7 p-4 bg-gray-50 rounded-lg">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">How many preferred date &amp; time options to collect?</label>
                  <StyledSelect value={preferredSlotsCount} onChange={e => setPreferredSlotsCount(Number(e.target.value))}>
                    {[1, 2, 3, 4, 5].map(n => (
                      <option key={n} value={n}>{n}</option>
                    ))}
                  </StyledSelect>
                </div>
              )}
            </div>
          </section>
        )}

        {/* ── 5. Information to collect ── */}
        {calendarId && (
          <section className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-start gap-3 mb-1">
              <SectionNumber n={5} />
              <h2 className="text-base font-semibold text-gray-900">What information do we need to collect from the patient?</h2>
            </div>
            <div className="ml-11 mt-4 space-y-4">
              <TagInput
                options={propertyOptions}
                selected={selectedFields.map(f => f.propertyId)}
                onChange={handlePropertyChange}
                placeholder="Select properties..."
                hint="Select from your Contact Properties"
              />
              {selectedFields.length > 0 && (
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <div className="grid grid-cols-[1fr,80px] gap-2 px-4 py-2 bg-gray-50 border-b border-gray-200">
                    <span className="text-xs font-medium text-gray-500">Information</span>
                    <span className="text-xs font-medium text-gray-500 text-center">Required</span>
                  </div>
                  {selectedFields.map(field => (
                    <div key={field.propertyId} className="grid grid-cols-[1fr,80px] gap-2 px-4 py-2.5 border-b border-gray-100 last:border-0">
                      <span className="text-sm text-gray-700">{field.label}</span>
                      <div className="flex justify-center">
                        <input type="checkbox" checked={field.required} onChange={() => toggleRequired(field.propertyId)} className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <p className="text-xs text-gray-500">
                You can set up patient properties in{' '}
                <a href="https://dashboard.botmd.io/contacts" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 font-medium">
                  Contacts
                </a>{' '}
                module
              </p>
            </div>
          </section>
        )}

        {/* ── 6. Reschedule ── */}
        {calendarId && (
          <section className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-start gap-3 mb-1">
              <SectionNumber n={6} />
              <h2 className="text-base font-semibold text-gray-900">Allow patient to reschedule appointment?</h2>
            </div>
            <div className="ml-11 mt-4 space-y-3">
              <label className={`flex items-start gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${reschedulePolicy === 'yes' ? 'border-blue-500 bg-blue-50/50' : 'border-gray-200 hover:border-gray-300'}`}>
                <input type="radio" name="reschedule" checked={reschedulePolicy === 'yes'} onChange={() => setReschedulePolicy('yes')} className="mt-0.5 w-4 h-4 text-blue-600 border-gray-300" />
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm text-gray-700">Yes, rescheduling is permitted up to</span>
                  <input type="number" min={1} value={rescheduleAmount} onChange={e => setRescheduleAmount(Number(e.target.value))} className="w-16 px-2 py-1 border border-gray-300 rounded text-sm text-center focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  <StyledSelect value={rescheduleUnit} onChange={e => setRescheduleUnit(e.target.value as typeof rescheduleUnit)}>
                    <option value="hours">Hours</option>
                    <option value="days">Days</option>
                    <option value="weeks">Weeks</option>
                    <option value="months">Months</option>
                  </StyledSelect>
                  <span className="text-sm text-gray-700">before appointment date</span>
                </div>
              </label>
              <label className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${reschedulePolicy === 'no_handover' ? 'border-blue-500 bg-blue-50/50' : 'border-gray-200 hover:border-gray-300'}`}>
                <input type="radio" name="reschedule" checked={reschedulePolicy === 'no_handover'} onChange={() => setReschedulePolicy('no_handover')} className="w-4 h-4 text-blue-600 border-gray-300" />
                <span className="text-sm text-gray-700">No, rescheduling is not permitted, handover to human</span>
              </label>
              <label className={`flex items-start gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${reschedulePolicy === 'no_call' ? 'border-blue-500 bg-blue-50/50' : 'border-gray-200 hover:border-gray-300'}`}>
                <input type="radio" name="reschedule" checked={reschedulePolicy === 'no_call'} onChange={() => setReschedulePolicy('no_call')} className="mt-0.5 w-4 h-4 text-blue-600 border-gray-300" />
                <span className="text-sm text-gray-700">No, rescheduling is not permitted, ask patient to call to reschedule</span>
              </label>
              {reschedulePolicy === 'no_call' && (
                <div className="pl-7">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Number to call</label>
                  <input type="tel" value={rescheduleCallNumber} onChange={e => setRescheduleCallNumber(e.target.value)} placeholder="+65 6123 4567" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              )}
            </div>
          </section>
        )}

        {/* ── 7. Cancel ── */}
        {calendarId && (
          <section className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-start gap-3 mb-1">
              <SectionNumber n={7} />
              <h2 className="text-base font-semibold text-gray-900">Allow patient to cancel appointment?</h2>
            </div>
            <div className="ml-11 mt-4 space-y-3">
              <label className={`flex items-start gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${cancelPolicy === 'yes' ? 'border-blue-500 bg-blue-50/50' : 'border-gray-200 hover:border-gray-300'}`}>
                <input type="radio" name="cancel" checked={cancelPolicy === 'yes'} onChange={() => setCancelPolicy('yes')} className="mt-0.5 w-4 h-4 text-blue-600 border-gray-300" />
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm text-gray-700">Yes, cancellation is permitted up to</span>
                  <input type="number" min={1} value={cancelAmount} onChange={e => setCancelAmount(Number(e.target.value))} className="w-16 px-2 py-1 border border-gray-300 rounded text-sm text-center focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  <StyledSelect value={cancelUnit} onChange={e => setCancelUnit(e.target.value as typeof cancelUnit)}>
                    <option value="hours">Hours</option>
                    <option value="days">Days</option>
                    <option value="weeks">Weeks</option>
                    <option value="months">Months</option>
                  </StyledSelect>
                  <span className="text-sm text-gray-700">before appointment date</span>
                </div>
              </label>
              <label className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${cancelPolicy === 'no_handover' ? 'border-blue-500 bg-blue-50/50' : 'border-gray-200 hover:border-gray-300'}`}>
                <input type="radio" name="cancel" checked={cancelPolicy === 'no_handover'} onChange={() => setCancelPolicy('no_handover')} className="w-4 h-4 text-blue-600 border-gray-300" />
                <span className="text-sm text-gray-700">Cancellation is NOT permitted, handover to human</span>
              </label>
              <label className={`flex items-start gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${cancelPolicy === 'no_call' ? 'border-blue-500 bg-blue-50/50' : 'border-gray-200 hover:border-gray-300'}`}>
                <input type="radio" name="cancel" checked={cancelPolicy === 'no_call'} onChange={() => setCancelPolicy('no_call')} className="mt-0.5 w-4 h-4 text-blue-600 border-gray-300" />
                <span className="text-sm text-gray-700">Cancellation is NOT permitted, ask patient to call to cancel</span>
              </label>
              {cancelPolicy === 'no_call' && (
                <div className="pl-7">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Number to call</label>
                  <input type="tel" value={cancelCallNumber} onChange={e => setCancelCallNumber(e.target.value)} placeholder="+65 6123 4567" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              )}
            </div>
          </section>
        )}

        {/* ── 8. Alerts ── */}
        {calendarId && (
          <section className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-start gap-3 mb-1">
              <SectionNumber n={8} />
              <h2 className="text-base font-semibold text-gray-900">Do we need to alert anyone for patient scheduling/rescheduling/cancellation?</h2>
            </div>
            <div className="ml-11 mt-4 space-y-3">
              <label className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${!alertEnabled ? 'border-blue-500 bg-blue-50/50' : 'border-gray-200 hover:border-gray-300'}`}>
                <input type="radio" name="alerts" checked={!alertEnabled} onChange={() => setAlertEnabled(false)} className="w-4 h-4 text-blue-600 border-gray-300" />
                <span className="text-sm text-gray-700">No alerts needed</span>
              </label>
              <label className={`flex items-start gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${alertEnabled ? 'border-blue-500 bg-blue-50/50' : 'border-gray-200 hover:border-gray-300'}`}>
                <input type="radio" name="alerts" checked={alertEnabled} onChange={() => setAlertEnabled(true)} className="mt-0.5 w-4 h-4 text-blue-600 border-gray-300" />
                <span className="text-sm text-gray-700">Alert</span>
              </label>

              {alertEnabled && (
                <div className="space-y-4 pl-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Who to alert</label>
                    <TagInput
                      options={ADMIN_USERS.map(u => ({ value: u.id, label: u.name }))}
                      selected={alertUsers}
                      onChange={setAlertUsers}
                      placeholder="Select users..."
                    />
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-700">When should we send alerts?</p>
                    {ALERT_TRIGGERS.map(trigger => (
                      <Checkbox key={trigger.id} label={trigger.label} checked={alertTriggers.includes(trigger.id)} onChange={() => toggleAlertTrigger(trigger.id)} />
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <span>{'\u{1F4A1}'}</span> Patient handover requests will always alert users
                  </p>
                </div>
              )}
            </div>
          </section>
        )}

        {/* ── Save ── */}
        {calendarId && (
          <div className="flex items-center justify-end pb-8">
            <Button onClick={handleSave} disabled={!calendarId}>
              Save Setting
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
