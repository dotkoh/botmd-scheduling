'use client';

import { useRouter } from 'next/navigation';
import { SchedulingRule } from '@/lib/types';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { useStore } from '@/lib/store';

const METHOD_LABELS: Record<string, string> = {
  direct: 'Direct booking',
  link: 'Send scheduling link',
  request: 'Request preferred times',
};

interface Props {
  rule: SchedulingRule;
}

export default function AppointmentCard({ rule }: Props) {
  const router = useRouter();
  const { updateRule } = useStore();

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-2">
        <h3 className="font-semibold text-gray-900">{rule.calendarName}</h3>
        <Badge variant={rule.status === 'active' ? 'success' : rule.status === 'paused' ? 'warning' : 'muted'}>
          {rule.status === 'active' ? '\u25CF Active' : rule.status === 'paused' ? '\u25CF Paused' : '\u25CB Draft'}
        </Badge>
      </div>

      <p className="text-sm text-gray-500 mb-4">{rule.appointmentTypes.join(', ')}</p>

      <div className="space-y-1.5 mb-4 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <span>{'\u{1F4DD}'}</span>
          <span>{METHOD_LABELS[rule.bookingMethod]}</span>
        </div>
        <div className="flex items-center gap-2">
          <span>{'\u{1F500}'}</span>
          <span>{rule.handoverRules.length > 0 ? `${rule.handoverRules.length} handover rule${rule.handoverRules.length > 1 ? 's' : ''}` : 'No handover rules'}</span>
        </div>
        <div className="flex items-center gap-2">
          <span>{'\u{1F514}'}</span>
          <span>{rule.alerts.enabled && rule.alerts.recipients.length > 0 ? `Alerts: ${rule.alerts.recipients.map(r => r.name).join(', ')}` : 'No alerts'}</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={() => router.push(`/appointments/${rule.id}`)}>
          Edit
        </Button>
        {rule.status === 'active' ? (
          <Button variant="ghost" size="sm" onClick={() => updateRule(rule.id, { status: 'paused' })}>
            Pause
          </Button>
        ) : rule.status === 'paused' ? (
          <Button variant="ghost" size="sm" onClick={() => updateRule(rule.id, { status: 'active' })}>
            Activate
          </Button>
        ) : (
          <Button variant="ghost" size="sm" onClick={() => updateRule(rule.id, { status: 'active' })}>
            Activate
          </Button>
        )}
      </div>
    </div>
  );
}
