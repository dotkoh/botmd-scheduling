'use client';

interface CheckboxProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  id?: string;
}

export default function Checkbox({ label, checked, onChange, id }: CheckboxProps) {
  const checkboxId = id || label.toLowerCase().replace(/\s+/g, '_');

  return (
    <label htmlFor={checkboxId} className="flex items-center gap-2.5 cursor-pointer group">
      <input
        type="checkbox"
        id={checkboxId}
        checked={checked}
        onChange={e => onChange(e.target.checked)}
        className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
      />
      <span className="text-sm text-gray-700 group-hover:text-gray-900">{label}</span>
    </label>
  );
}
