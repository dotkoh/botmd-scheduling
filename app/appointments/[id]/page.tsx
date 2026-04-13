'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/lib/store';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { BOOKING_METHODS, ALERT_TRIGGERS } from '@/lib/constants';

interface PageProps {
  params: Promise<{ id: string }>;
}

const METHOD_LABELS: Record<string, string> = {
  direct: 'Direct booking with AI',
  link: 'Send scheduling link',
  request: 'Request preferred date and time',
};

export default function EditPage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();
  const { getRule, updateRule, deleteRule } = useStore();

  const rule = getRule(id);

  if (!rule) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-8 text-center">
        <p className="text-gray-500">Scheduling rule not found.</p>
        <Button variant="outline" className="mt-4" onClick={() => router.push('/')}>
          Back to Dashboard
        </Button>
      </div>
    );
  }

  function toggleStatus() {
    if (!rule) return;
    updateRule(rule.id, { status: rule.status === 'active' ? 'paused' : 'active' });
  }

  function handleDelete() {
    if (!rule) return;
    deleteRule(rule.id);
    router.push('/');
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <button
        onClick={() => router.push('/')}
        className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4"
      >
        <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
        Back
      </button>

      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-gray-900">{rule.calendarName}</h1>
            <Badge variant={rule.status === 'active' ? 'success' : rule.status === 'paused' ? 'warning' : 'muted'}>
              {rule.status === 'active' ? '\u25CF Active' : rule.status === 'paused' ? '\u25CF Paused' : '\u25CB Draft'}
            </Badge>
          </div>
          <p className="text-sm text-gray-500 mt-1">{rule.appointmentTypes.join(', ')}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={toggleStatus}>
            {rule.status === 'active' ? 'Pause' : 'Activate'}
          </Button>
          <Button variant="danger" size="sm" onClick={handleDelete}>Delete</Button>
        </div>
      </div>

      <div className="space-y-4">
        {/* Calendar & Appointment Types */}
        <Section title="Calendar" icon={'\u{1F4C5}'}>
          <p className="text-sm text-gray-700 font-medium">{rule.calendarName}</p>
        </Section>

        <Section title="Appointment Types" icon={'\u{1F4CB}'}>
          <div className="flex flex-wrap gap-2">
            {rule.appointmentTypes.map(t => (
              <span key={t} className="px-2.5 py-1 bg-gray-100 text-gray-700 rounded text-sm">{t}</span>
            ))}
          </div>
        </Section>

        {/* Booking Method */}
        <Section title="Booking Method" icon={'\u{1F4DD}'}>
          <p className="text-sm text-gray-700">{METHOD_LABELS[rule.bookingMethod]}</p>
          {rule.bookingMethod === 'request' && rule.preferredSlotsCount && (
            <p className="text-xs text-gray-500 mt-1">Up to {rule.preferredSlotsCount} preferred options</p>
          )}
          {rule.bookingMethod === 'link' && rule.schedulingLink && (
            <p className="text-xs text-blue-500 mt-1">{rule.schedulingLink}</p>
          )}
        </Section>

        {/* Information Collected */}
        <Section title="Information Collected" icon={'\u{1F4C4}'}>
          <div className="space-y-1.5">
            {rule.fields.map(f => (
              <div key={f.propertyId} className="flex items-center gap-2 text-sm text-gray-700">
                <span className="w-1.5 h-1.5 rounded-full bg-gray-400 flex-shrink-0" />
                {f.label}
                <span className="text-xs text-gray-400">({f.required ? 'required' : 'optional'})</span>
              </div>
            ))}
            {rule.customFields.map(f => (
              <div key={f.id} className="flex items-center gap-2 text-sm text-gray-700">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0" />
                {f.label}
                <span className="text-xs text-gray-400">({f.required ? 'required' : 'optional'}, {f.type})</span>
              </div>
            ))}
          </div>
        </Section>

        {/* Handover Rules */}
        <Section title="Handover Rules" icon={'\u{1F500}'}>
          {rule.handoverRules.length > 0 ? (
            <ul className="space-y-1.5">
              {rule.handoverRules.map(hr => (
                <li key={hr.id} className="flex items-center gap-2 text-sm text-gray-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 flex-shrink-0" />
                  {hr.label}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-400">No handover rules — AI handles all bookings</p>
          )}
        </Section>

        {/* Alerts */}
        <Section title="Alerts" icon={'\u{1F514}'}>
          {rule.alerts.enabled && rule.alerts.recipients.length > 0 ? (
            <div className="space-y-2">
              {rule.alerts.recipients.map((r, i) => (
                <div key={i} className="text-sm text-gray-700">
                  <p className="font-medium">{r.name}</p>
                  <div className="flex flex-wrap gap-3 text-gray-500 mt-1">
                    {r.email && <span>{'\u{1F4E7}'} {r.email.trim()}</span>}
                    {r.whatsapp && <span>{'\u{1F4F1}'} {r.whatsapp.trim()}</span>}
                    {r.viber && <span>Viber</span>}
                    {r.sms && <span>SMS</span>}
                  </div>
                </div>
              ))}
              {rule.alerts.triggers.length > 0 && (
                <p className="text-xs text-gray-400 mt-2">
                  On: {rule.alerts.triggers.map(t => ALERT_TRIGGERS.find(at => at.id === t)?.label || t).join(', ')}
                </p>
              )}
            </div>
          ) : (
            <p className="text-sm text-gray-400">No alerts configured</p>
          )}
        </Section>
      </div>
    </div>
  );
}

function Section({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
          <span>{icon}</span> {title}
        </h3>
        <button className="text-xs text-blue-600 hover:text-blue-700 font-medium">Edit</button>
      </div>
      {children}
    </div>
  );
}
