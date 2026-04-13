'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/lib/store';
import { CALENDARS, CONTACT_PROPERTIES, BOOKING_METHODS, HANDOVER_CONDITIONS, HANDOVER_VALUES, ALERT_TRIGGERS } from '@/lib/constants';
import { SchedulingRule, FieldConfig, CustomField, HandoverRule, BookingMethod, AlertRecipient } from '@/lib/types';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Checkbox from '@/components/ui/Checkbox';
import TagInput from '@/components/ui/TagInput';

function SectionNumber({ n }: { n: number }) {
  return (
    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-sm font-semibold flex-shrink-0">
      {n}
    </div>
  );
}

export default function CreatePage() {
  const router = useRouter();
  const { addRule } = useStore();

  // Q1
  const [calendarId, setCalendarId] = useState('');
  const [appointmentTypes, setAppointmentTypes] = useState<string[]>([]);
  // Q2: Description
  const [description, setDescription] = useState('');
  // Q3: Eligibility
  const [eligibility, setEligibility] = useState<'anyone' | 'criteria'>('anyone');
  const [eligibilityCriteria, setEligibilityCriteria] = useState<string[]>([]);
  const [newCriterion, setNewCriterion] = useState('');
  // Q4
  const [bookingMethod, setBookingMethod] = useState<BookingMethod>('request');
  const [schedulingLink, setSchedulingLink] = useState('');
  const [preferredSlotsCount, setPreferredSlotsCount] = useState(3);
  // Q4
  const [selectedFields, setSelectedFields] = useState<FieldConfig[]>([]);
  const [customFields, setCustomFields] = useState<CustomField[]>([]);
  const [showCustomField, setShowCustomField] = useState(false);
  const [cfName, setCfName] = useState('');
  const [cfType, setCfType] = useState<CustomField['type']>('text');
  const [cfRequired, setCfRequired] = useState(false);
  // Q5
  const [handoverEnabled, setHandoverEnabled] = useState(true);
  const [handoverRules, setHandoverRules] = useState<HandoverRule[]>([]);
  // Q6
  const [alertEnabled, setAlertEnabled] = useState(true);
  const [alertRecipients, setAlertRecipients] = useState<AlertRecipient[]>([
    { name: '', email: '', whatsapp: '', viber: '', sms: '' },
  ]);
  const [alertTriggers, setAlertTriggers] = useState<string[]>(['new_booking', 'handover']);

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

  function addCustomField() {
    if (!cfName.trim()) return;
    const id = cfName.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
    setCustomFields(prev => [...prev, { id, label: cfName.trim(), type: cfType, required: cfRequired }]);
    setCfName('');
    setCfType('text');
    setCfRequired(false);
    setShowCustomField(false);
  }

  function addHandoverRule() {
    setHandoverRules(prev => [
      ...prev,
      { id: `hr_${Date.now()}`, condition: 'is', value: 'hmo_patient', label: '' },
    ]);
  }

  function updateHandoverRule(id: string, updates: Partial<HandoverRule>) {
    setHandoverRules(prev => prev.map(r => {
      if (r.id !== id) return r;
      const updated = { ...r, ...updates };
      const condLabel = HANDOVER_CONDITIONS.find(c => c.value === updated.condition)?.label || updated.condition;
      const valLabel = HANDOVER_VALUES[updated.condition]?.find(v => v.value === updated.value)?.label || updated.value;
      updated.label = `Handover if patient ${condLabel} ${valLabel}`;
      return updated;
    }));
  }

  function removeHandoverRule(id: string) {
    setHandoverRules(prev => prev.filter(r => r.id !== id));
  }

  function updateRecipient(index: number, updates: Partial<AlertRecipient>) {
    setAlertRecipients(prev => prev.map((r, i) => (i === index ? { ...r, ...updates } : r)));
  }

  function toggleAlertTrigger(triggerId: string) {
    setAlertTriggers(prev =>
      prev.includes(triggerId) ? prev.filter(t => t !== triggerId) : [...prev, triggerId]
    );
  }

  function handleSave(status: 'active' | 'draft') {
    const id = `rule_${Date.now()}`;
    const now = new Date().toISOString();
    const rule: SchedulingRule = {
      id,
      status,
      createdAt: now,
      updatedAt: now,
      calendarId,
      calendarName: selectedCalendar?.name || '',
      appointmentTypes,
      description,
      eligibility,
      eligibilityCriteria: eligibility === 'criteria' ? eligibilityCriteria : [],
      bookingMethod,
      schedulingLink: bookingMethod === 'link' ? schedulingLink : undefined,
      preferredSlotsCount: bookingMethod === 'request' ? preferredSlotsCount : undefined,
      fields: selectedFields,
      customFields,
      handoverRules: handoverEnabled ? handoverRules : [],
      alerts: {
        enabled: alertEnabled,
        recipients: alertEnabled ? alertRecipients : [],
        triggers: alertEnabled ? alertTriggers : [],
      },
    };
    addRule(rule);
    router.push('/');
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-8">
      {/* Header */}
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
        {/* Q1: Select Calendar + Q2: Appointment Types */}
        <section className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-start gap-3 mb-4">
            <SectionNumber n={1} />
            <div>
              <h2 className="text-base font-semibold text-gray-900">Details</h2>
            </div>
          </div>
          <div className="ml-11 space-y-5">
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700">Select Calendar Account</label>
              <div className="relative">
                <select
                  value={calendarId}
                  onChange={e => { setCalendarId(e.target.value); setAppointmentTypes([]); }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="" disabled>Choose a calendar account</option>
                  {CALENDARS.map(cal => (
                    <option key={cal.id} value={cal.id}>{cal.name}</option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                  <svg className="h-4 w-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>

            {calendarId && (
              <TagInput
                label="Which appointment types will this apply to?"
                options={[
                  { value: '__all__', label: 'All appointments' },
                  ...(selectedCalendar?.appointmentTypes.map(t => ({ value: t, label: t })) || []),
                ]}
                selected={appointmentTypes}
                onChange={setAppointmentTypes}
                placeholder="All appointments"
              />
            )}
          </div>
        </section>

        {/* Q2: Describe this appointment */}
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
              <p className="text-xs text-gray-400 mt-1.5 flex items-center gap-1">
                <span>{'\u{1F4A1}'}</span> Write like you&apos;re briefing a new receptionist
              </p>
            </div>
          </section>
        )}

        {/* Q3: Who can book? */}
        {calendarId && (
          <section className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-start gap-3 mb-1">
              <SectionNumber n={3} />
              <div>
                <h2 className="text-base font-semibold text-gray-900">Who can book this appointment?</h2>
              </div>
            </div>
            <div className="ml-11 mt-4 space-y-3">
              <label
                className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${
                  eligibility === 'anyone' ? 'border-blue-500 bg-blue-50/50' : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="eligibility"
                  checked={eligibility === 'anyone'}
                  onChange={() => setEligibility('anyone')}
                  className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Anyone</span>
              </label>

              <label
                className={`flex items-start gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${
                  eligibility === 'criteria' ? 'border-blue-500 bg-blue-50/50' : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="eligibility"
                  checked={eligibility === 'criteria'}
                  onChange={() => setEligibility('criteria')}
                  className="mt-0.5 w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Patients who meet these criteria:</span>
              </label>

              {eligibility === 'criteria' && (
                <div className="space-y-2 pl-2">
                  {eligibilityCriteria.map((criterion, index) => (
                    <div key={index} className="flex items-center gap-2 p-2.5 bg-gray-50 rounded-lg">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0" />
                      <span className="text-sm text-gray-700 flex-1">{criterion}</span>
                      <button
                        onClick={() => setEligibilityCriteria(prev => prev.filter((_, i) => i !== index))}
                        className="text-gray-400 hover:text-red-500 flex-shrink-0"
                      >
                        <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  ))}
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={newCriterion}
                      onChange={e => setNewCriterion(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === 'Enter' && newCriterion.trim()) {
                          e.preventDefault();
                          setEligibilityCriteria(prev => [...prev, newCriterion.trim()]);
                          setNewCriterion('');
                        }
                      }}
                      placeholder="e.g. Patient must have a doctor referral"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <Button
                      size="sm"
                      disabled={!newCriterion.trim()}
                      onClick={() => {
                        if (newCriterion.trim()) {
                          setEligibilityCriteria(prev => [...prev, newCriterion.trim()]);
                          setNewCriterion('');
                        }
                      }}
                    >
                      Add
                    </Button>
                  </div>
                  <p className="text-xs text-gray-400 flex items-center gap-1">
                    <span>{'\u{1F4A1}'}</span> The AI will check these criteria during the conversation
                  </p>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Q4: How should patients book? */}
        {calendarId && (
          <section className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-start gap-3 mb-1">
              <SectionNumber n={4} />
              <div>
                <h2 className="text-base font-semibold text-gray-900">How would you like patients to book?</h2>
                <p className="text-sm text-gray-500 mt-0.5">{selectedCalendar?.name}{appointmentTypes.length > 0 ? ` \u00B7 ${appointmentTypes.join(', ')}` : ''}</p>
              </div>
            </div>
            <div className="ml-11 space-y-3 mt-4">
              {BOOKING_METHODS.map(method => (
                <label
                  key={method.value}
                  className={`flex items-start gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${
                    bookingMethod === method.value ? 'border-blue-500 bg-blue-50/50' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="bookingMethod"
                    value={method.value}
                    checked={bookingMethod === method.value}
                    onChange={() => setBookingMethod(method.value)}
                    className="mt-0.5 w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <div>
                    <span className="text-sm font-medium text-gray-900">{method.label}</span>
                    <p className="text-xs text-gray-500 mt-0.5">{method.description}</p>
                  </div>
                </label>
              ))}

              {bookingMethod === 'link' && (
                <div className="mt-3">
                  <Input
                    label="Scheduling link URL"
                    placeholder="https://clinic.calendly.com/radiology"
                    value={schedulingLink}
                    onChange={e => setSchedulingLink(e.target.value)}
                  />
                </div>
              )}

              {bookingMethod === 'request' && (
                <div className="mt-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    How many options to collect?
                  </label>
                  <select
                    value={preferredSlotsCount}
                    onChange={e => setPreferredSlotsCount(Number(e.target.value))}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {[1, 2, 3, 4, 5].map(n => (
                      <option key={n} value={n}>{n}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Q4: What information to collect? */}
        {calendarId && (
          <section className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-start gap-3 mb-1">
              <SectionNumber n={5} />
              <div>
                <h2 className="text-base font-semibold text-gray-900">What information do we need to collect from the patient?</h2>
              </div>
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
                        <input
                          type="checkbox"
                          checked={field.required}
                          onChange={() => toggleRequired(field.propertyId)}
                          className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  ))}
                  {customFields.map(field => (
                    <div key={field.id} className="grid grid-cols-[1fr,80px] gap-2 px-4 py-2.5 border-b border-gray-100 last:border-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-700">{field.label}</span>
                        <span className="text-xs text-gray-400">({field.type})</span>
                        <button
                          onClick={() => setCustomFields(prev => prev.filter(f => f.id !== field.id))}
                          className="text-gray-400 hover:text-red-500 ml-auto"
                        >
                          <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                      <div className="flex justify-center">
                        <input
                          type="checkbox"
                          checked={field.required}
                          onChange={() => setCustomFields(prev => prev.map(f => f.id === field.id ? { ...f, required: !f.required } : f))}
                          className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {showCustomField ? (
                <div className="border border-gray-200 rounded-lg p-4 space-y-3">
                  <h3 className="text-sm font-medium text-gray-900">Add Custom Field</h3>
                  <Input label="Field name" placeholder="e.g. Type of exam" value={cfName} onChange={e => setCfName(e.target.value)} />
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Type</p>
                    <div className="flex gap-4">
                      {(['text', 'number', 'yes_no', 'select'] as const).map(t => (
                        <label key={t} className="flex items-center gap-1.5 cursor-pointer">
                          <input type="radio" name="cfType" checked={cfType === t} onChange={() => setCfType(t)} className="w-4 h-4 text-blue-600" />
                          <span className="text-sm text-gray-700">{t === 'yes_no' ? 'Yes/No' : t.charAt(0).toUpperCase() + t.slice(1)}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => setShowCustomField(false)}>Cancel</Button>
                    <Button size="sm" onClick={addCustomField} disabled={!cfName.trim()}>Add Field</Button>
                  </div>
                </div>
              ) : (
                <button onClick={() => setShowCustomField(true)} className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                  + Add custom field
                </button>
              )}
            </div>
          </section>
        )}

        {/* Q5: Handover rules */}
        {calendarId && (
          <section className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-start gap-3 mb-1">
              <SectionNumber n={6} />
              <div>
                <h2 className="text-base font-semibold text-gray-900">Are there any situations where we should handover to a human agent?</h2>
              </div>
            </div>
            <div className="ml-11 mt-4 space-y-4">
              <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors border-gray-200 hover:border-gray-300">
                <input
                  type="radio"
                  name="handover"
                  checked={!handoverEnabled}
                  onChange={() => setHandoverEnabled(false)}
                  className="w-4 h-4 text-blue-600 border-gray-300"
                />
                <span className="text-sm text-gray-700">No, the AI can handle all bookings</span>
              </label>

              <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors border-gray-200 hover:border-gray-300">
                <input
                  type="radio"
                  name="handover"
                  checked={handoverEnabled}
                  onChange={() => setHandoverEnabled(true)}
                  className="w-4 h-4 text-blue-600 border-gray-300"
                />
                <span className="text-sm text-gray-700">Yes, handover if:</span>
              </label>

              {handoverEnabled && (
                <div className="space-y-3 pl-2">
                  {handoverRules.map(rule => (
                    <div key={rule.id} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-700 flex-shrink-0">Handover if patient</span>
                      <select
                        value={rule.condition}
                        onChange={e => {
                          const newCond = e.target.value;
                          const firstVal = HANDOVER_VALUES[newCond]?.[0]?.value || '';
                          updateHandoverRule(rule.id, { condition: newCond, value: firstVal });
                        }}
                        className="px-2 py-1.5 border border-gray-300 rounded text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {HANDOVER_CONDITIONS.map(c => (
                          <option key={c.value} value={c.value}>{c.label}</option>
                        ))}
                      </select>
                      <select
                        value={rule.value}
                        onChange={e => updateHandoverRule(rule.id, { value: e.target.value })}
                        className="px-2 py-1.5 border border-gray-300 rounded text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {(HANDOVER_VALUES[rule.condition] || []).map(v => (
                          <option key={v.value} value={v.value}>{v.label}</option>
                        ))}
                      </select>
                      <button
                        onClick={() => removeHandoverRule(rule.id)}
                        className="text-gray-400 hover:text-red-500 flex-shrink-0 ml-auto"
                      >
                        <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  ))}
                  <button onClick={addHandoverRule} className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                    + Add another handover rule
                  </button>
                  <p className="text-xs text-gray-400 flex items-center gap-1">
                    <span>{'\u{1F4A1}'}</span> The AI will detect these from the patient&apos;s responses
                  </p>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Q6: Alerts */}
        {calendarId && (
          <section className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-start gap-3 mb-1">
              <SectionNumber n={7} />
              <div>
                <h2 className="text-base font-semibold text-gray-900">Who should we alert when a patient books?</h2>
              </div>
            </div>
            <div className="ml-11 mt-4 space-y-4">
              <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors border-gray-200 hover:border-gray-300">
                <input
                  type="radio"
                  name="alerts"
                  checked={!alertEnabled}
                  onChange={() => setAlertEnabled(false)}
                  className="w-4 h-4 text-blue-600 border-gray-300"
                />
                <span className="text-sm text-gray-700">No alerts needed</span>
              </label>

              <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors border-gray-200 hover:border-gray-300">
                <input
                  type="radio"
                  name="alerts"
                  checked={alertEnabled}
                  onChange={() => setAlertEnabled(true)}
                  className="w-4 h-4 text-blue-600 border-gray-300"
                />
                <span className="text-sm text-gray-700">Alert someone:</span>
              </label>

              {alertEnabled && (
                <div className="space-y-4 pl-2">
                  {alertRecipients.map((recipient, index) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-lg space-y-3">
                      <Input
                        label="Alert"
                        placeholder="e.g. Radiology Reception"
                        value={recipient.name}
                        onChange={e => updateRecipient(index, { name: e.target.value })}
                      />
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-700">via</p>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <Checkbox
                              label="Email"
                              checked={recipient.email !== ''}
                              onChange={checked => updateRecipient(index, { email: checked ? ' ' : '' })}
                            />
                            {recipient.email !== '' && (
                              <input
                                type="email"
                                placeholder="email@clinic.com"
                                value={recipient.email.trim()}
                                onChange={e => updateRecipient(index, { email: e.target.value || ' ' })}
                                className="w-full px-2.5 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                            )}
                          </div>
                          <div className="space-y-1">
                            <Checkbox
                              label="WhatsApp"
                              checked={recipient.whatsapp !== ''}
                              onChange={checked => updateRecipient(index, { whatsapp: checked ? ' ' : '' })}
                            />
                            {recipient.whatsapp !== '' && (
                              <input
                                type="tel"
                                placeholder="+65 9123 4567"
                                value={recipient.whatsapp.trim()}
                                onChange={e => updateRecipient(index, { whatsapp: e.target.value || ' ' })}
                                className="w-full px-2.5 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                            )}
                          </div>
                          <div>
                            <Checkbox
                              label="Viber"
                              checked={recipient.viber !== ''}
                              onChange={checked => updateRecipient(index, { viber: checked ? ' ' : '' })}
                            />
                          </div>
                          <div>
                            <Checkbox
                              label="SMS"
                              checked={recipient.sms !== ''}
                              onChange={checked => updateRecipient(index, { sms: checked ? ' ' : '' })}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  <div className="border-t border-gray-100 pt-4 space-y-2">
                    <p className="text-sm font-medium text-gray-700">When should we send alerts?</p>
                    {ALERT_TRIGGERS.map(trigger => (
                      <Checkbox
                        key={trigger.id}
                        label={trigger.label}
                        checked={alertTriggers.includes(trigger.id)}
                        onChange={() => toggleAlertTrigger(trigger.id)}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Actions */}
        {calendarId && (
          <div className="flex items-center justify-end gap-3 pb-8">
            <Button variant="outline" onClick={() => handleSave('draft')}>
              Save Draft
            </Button>
            <Button onClick={() => handleSave('active')} disabled={!calendarId}>
              Activate {'\u2713'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
