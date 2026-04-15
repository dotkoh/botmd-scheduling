'use client';

import { useRouter } from 'next/navigation';
import { SchedulingRule } from '@/lib/types';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { useStore } from '@/lib/store';

const METHOD_LABELS: Record<string, string> = {
  direct: 'Direct booking',
  link: 'Scheduling link',
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
        <Badge variant={rule.status === 'active' ? 'success' : 'muted'}>
          {rule.status === 'active' ? '\u25CF Active' : '\u25CB Draft'}
        </Badge>
      </div>
      <p className="text-sm text-gray-500 mb-4">
        {rule.appointmentTypes.length > 0
          ? rule.appointmentTypes.map(t => t === '__all__' ? 'All Appointments' : t).join(', ')
          : 'All Appointments'}
      </p>
      <div className="space-y-1.5 mb-4 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <span>{'\u{1F4DD}'}</span>
          <span>{METHOD_LABELS[rule.bookingMethod]}</span>
        </div>
        <div className="flex items-center gap-2">
          <span>{'\u{1F464}'}</span>
          <span>{rule.eligibility === 'anyone' ? 'Open to anyone' : `${rule.eligibilityCriteria.length} eligibility criteria`}</span>
        </div>
        <div className="flex items-center gap-2">
          <span>{'\u{1F514}'}</span>
          <span>{rule.alerts.enabled ? `Alerts: ${rule.alerts.alertUsers.length} user${rule.alerts.alertUsers.length !== 1 ? 's' : ''}` : 'No alerts'}</span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={() => router.push(`/appointments/${rule.id}`)}>Edit</Button>
        {rule.status === 'active' ? (
          <Button variant="ghost" size="sm" onClick={() => updateRule(rule.id, { status: 'draft' })}>Pause</Button>
        ) : (
          <Button variant="ghost" size="sm" onClick={() => updateRule(rule.id, { status: 'active' })}>Activate</Button>
        )}
      </div>
    </div>
  );
}
