'use client';

import { useRouter } from 'next/navigation';
import { useStore } from '@/lib/store';
import AppointmentCard from '@/components/dashboard/AppointmentCard';
import Button from '@/components/ui/Button';

export default function Dashboard() {
  const router = useRouter();
  const { rules } = useStore();

  const active = rules.filter(r => r.status === 'active').length;
  const paused = rules.filter(r => r.status === 'paused').length;
  const draft = rules.filter(r => r.status === 'draft').length;

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Scheduling Rules</h1>
          <p className="text-sm text-gray-500 mt-1">
            Configure booking rules for your AI scheduling agent
          </p>
        </div>
        <Button onClick={() => router.push('/appointments/create')}>
          + Create
        </Button>
      </div>

      {rules.length > 0 && (
        <div className="flex items-center gap-4 mb-6 text-sm text-gray-500">
          <span>{rules.length} rule{rules.length !== 1 ? 's' : ''}</span>
          <span className="text-gray-300">|</span>
          <span className="text-green-600">{active} active</span>
          {paused > 0 && <span className="text-yellow-600">{paused} paused</span>}
          {draft > 0 && <span className="text-gray-400">{draft} draft</span>}
        </div>
      )}

      {rules.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-5xl mb-4">{'\u{1F4C5}'}</div>
          <h2 className="text-lg font-medium text-gray-900 mb-2">No scheduling rules yet</h2>
          <p className="text-sm text-gray-500 mb-6">
            Create your first scheduling rule to start accepting bookings
          </p>
          <Button onClick={() => router.push('/appointments/create')}>
            + Create Scheduling Rule
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {rules.map(rule => (
            <AppointmentCard key={rule.id} rule={rule} />
          ))}
        </div>
      )}
    </div>
  );
}
