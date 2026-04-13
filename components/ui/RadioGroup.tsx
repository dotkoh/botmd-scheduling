'use client';

interface RadioOption {
  value: string;
  label: string;
  description?: string;
  hint?: string;
}

interface RadioGroupProps {
  name: string;
  options: RadioOption[];
  value: string;
  onChange: (value: string) => void;
  direction?: 'vertical' | 'horizontal';
}

export default function RadioGroup({ name, options, value, onChange, direction = 'vertical' }: RadioGroupProps) {
  return (
    <div className={direction === 'vertical' ? 'space-y-3' : 'flex flex-wrap gap-4'}>
      {options.map(opt => (
        <label
          key={opt.value}
          className={`flex items-start gap-3 p-4 border rounded-lg cursor-pointer transition-colors ${
            value === opt.value
              ? 'border-blue-500 bg-blue-50/50'
              : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50/50'
          } ${direction === 'horizontal' ? 'flex-1 min-w-[200px]' : ''}`}
        >
          <input
            type="radio"
            name={name}
            value={opt.value}
            checked={value === opt.value}
            onChange={() => onChange(opt.value)}
            className="mt-0.5 w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
          />
          <div className="flex-1">
            <div className="text-sm font-medium text-gray-900">{opt.label}</div>
            {opt.description && (
              <div className="text-sm text-gray-500 mt-0.5">{opt.description}</div>
            )}
            {opt.hint && (
              <div className="text-xs text-gray-400 mt-1">{opt.hint}</div>
            )}
          </div>
        </label>
      ))}
    </div>
  );
}
