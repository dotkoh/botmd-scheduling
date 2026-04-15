'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/lib/store';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { ADMIN_USERS, ALERT_TRIGGERS } from '@/lib/constants';

interface PageProps {
  params: Promise<{ id: string }>;
}

const METHOD_LABELS: Record<string, string> = {
  direct: 'Scheduling AI to book directly',
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
        <Button variant="outline" className="mt-4" onClick={() => router.push('/')}>Back to Dashboard</Button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <button onClick={() => router.push('/')} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4">
        <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
        Back
      </button>

      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-gray-900">{rule.calendarName}</h1>
            <Badge variant={rule.status === 'active' ? 'success' : 'muted'}>
              {rule.status === 'active' ? '\u25CF Active' : '\u25CB Draft'}
            </Badge>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            {rule.appointmentTypes.length > 0
              ? rule.appointmentTypes.map(t => t === '__all__' ? 'All Appointments' : t).join(', ')
              : 'All Appointments'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => updateRule(rule.id, { status: rule.status === 'active' ? 'draft' : 'active' })}>
            {rule.status === 'active' ? 'Pause' : 'Activate'}
          </Button>
          <Button variant="danger" size="sm" onClick={() => { deleteRule(rule.id); router.push('/'); }}>Delete</Button>
        </div>
      </div>

      <div className="space-y-4">
        {rule.description && (
          <Section title="Description" icon={'\u{1F4DD}'}>
            <p className="text-sm text-gray-700">{rule.description}</p>
          </Section>
        )}

        <Section title="Who Can Book" icon={'\u{1F464}'}>
          {rule.eligibility === 'anyone' ? (
            <p className="text-sm text-gray-700">Anyone can book this appointment</p>
          ) : (
            <div className="space-y-1.5">
              <p className="text-sm text-gray-700 mb-2">Patients who meet these criteria:</p>
              {rule.eligibilityCriteria.map((c, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-gray-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0" />{c}
                </div>
              ))}
              <p className="text-xs text-gray-500 mt-2">
                If not eligible: {rule.ineligibleAction === 'handover' ? 'Handover to human' : `Inform and offer to call ${rule.ineligibleCallNumber}`}
              </p>
            </div>
          )}
        </Section>

        <Section title="Booking Method" icon={'\u{1F4C5}'}>
          <p className="text-sm text-gray-700">{METHOD_LABELS[rule.bookingMethod]}</p>
          {rule.bookingMethod === 'direct' && (
            <div className="text-xs text-gray-500 mt-1 space-y-0.5">
              <p>Offer {rule.directConfig.slotsToOffer} slot{rule.directConfig.slotsToOffer > 1 ? 's' : ''}, up to {rule.directConfig.advanceAmount} {rule.directConfig.advanceUnit} in advance</p>
              <p>No slots: {rule.directConfig.noSlotsAction === 'handover' ? 'Handover' : 'Inform patient'}</p>
              <p>No suitable: {rule.directConfig.noSuitableAction === 'offer_next' ? `Retry up to ${rule.directConfig.maxRetries} times` : 'Handover immediately'}</p>
            </div>
          )}
          {rule.bookingMethod === 'request' && (
            <p className="text-xs text-gray-500 mt-1">Collect {rule.preferredSlotsCount} preferred date & time option{rule.preferredSlotsCount > 1 ? 's' : ''}</p>
          )}
        </Section>

        <Section title="Information Collected" icon={'\u{1F4C4}'}>
          <div className="space-y-1.5">
            {rule.fields.map(f => (
              <div key={f.propertyId} className="flex items-center gap-2 text-sm text-gray-700">
                <span className="w-1.5 h-1.5 rounded-full bg-gray-400 flex-shrink-0" />
                {f.label}
                <span className="text-xs text-gray-400">({f.required ? 'required' : 'optional'})</span>
              </div>
            ))}
            {rule.fields.length === 0 && <p className="text-sm text-gray-400">No fields configured</p>}
          </div>
        </Section>

        <Section title="Reschedule Policy" icon={'\u{1F504}'}>
          <p className="text-sm text-gray-700">
            {rule.reschedulePolicy === 'yes' ? `Permitted up to ${rule.rescheduleAmount} ${rule.rescheduleUnit} before appointment` :
             rule.reschedulePolicy === 'no_handover' ? 'Not permitted \u2014 handover to human' :
             `Not permitted \u2014 ask patient to call ${rule.rescheduleCallNumber}`}
          </p>
        </Section>

        <Section title="Cancellation Policy" icon={'\u{274C}'}>
          <p className="text-sm text-gray-700">
            {rule.cancelPolicy === 'yes' ? `Permitted up to ${rule.cancelAmount} ${rule.cancelUnit} before appointment` :
             rule.cancelPolicy === 'no_handover' ? 'Not permitted \u2014 handover to human' :
             `Not permitted \u2014 ask patient to call ${rule.cancelCallNumber}`}
          </p>
        </Section>

        <Section title="Alerts" icon={'\u{1F514}'}>
          {rule.alerts.enabled && rule.alerts.alertUsers.length > 0 ? (
            <div className="space-y-1">
              <p className="text-sm text-gray-700">
                {rule.alerts.alertUsers.map(uid => ADMIN_USERS.find(u => u.id === uid)?.name || uid).join(', ')}
              </p>
              <p className="text-xs text-gray-500">
                On: {rule.alerts.triggers.map(t => ALERT_TRIGGERS.find(at => at.id === t)?.label || t).join(', ')}
              </p>
              <p className="text-xs text-gray-400 mt-1">Patient handover requests will always alert users</p>
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
        <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2"><span>{icon}</span> {title}</h3>
        <button className="text-xs text-blue-600 hover:text-blue-700 font-medium">Edit</button>
      </div>
      {children}
    </div>
  );
}
