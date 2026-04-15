'use client';

import { useState } from 'react';

const COUNTRY_CODES = [
  { code: '+63', country: 'PH', flag: '\u{1F1F5}\u{1F1ED}' },
  { code: '+65', country: 'SG', flag: '\u{1F1F8}\u{1F1EC}' },
  { code: '+60', country: 'MY', flag: '\u{1F1F2}\u{1F1FE}' },
  { code: '+66', country: 'TH', flag: '\u{1F1F9}\u{1F1ED}' },
  { code: '+62', country: 'ID', flag: '\u{1F1EE}\u{1F1E9}' },
  { code: '+84', country: 'VN', flag: '\u{1F1FB}\u{1F1F3}' },
  { code: '+91', country: 'IN', flag: '\u{1F1EE}\u{1F1F3}' },
  { code: '+1', country: 'US', flag: '\u{1F1FA}\u{1F1F8}' },
  { code: '+44', country: 'UK', flag: '\u{1F1EC}\u{1F1E7}' },
  { code: '+61', country: 'AU', flag: '\u{1F1E6}\u{1F1FA}' },
  { code: '+81', country: 'JP', flag: '\u{1F1EF}\u{1F1F5}' },
  { code: '+82', country: 'KR', flag: '\u{1F1F0}\u{1F1F7}' },
  { code: '+86', country: 'CN', flag: '\u{1F1E8}\u{1F1F3}' },
  { code: '+971', country: 'AE', flag: '\u{1F1E6}\u{1F1EA}' },
];

interface PhoneInputProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function PhoneInput({ label, value, onChange, placeholder = '9123 4567' }: PhoneInputProps) {
  const parts = value.match(/^(\+\d{1,3})\s*(.*)$/);
  const [countryCode, setCountryCode] = useState(parts?.[1] || '+65');
  const [number, setNumber] = useState(parts?.[2] || '');

  function handleCodeChange(newCode: string) {
    setCountryCode(newCode);
    onChange(`${newCode} ${number}`.trim());
  }

  function handleNumberChange(newNumber: string) {
    setNumber(newNumber);
    onChange(`${countryCode} ${newNumber}`.trim());
  }

  return (
    <div className="space-y-1.5">
      {label && <label className="block text-sm font-medium text-gray-700">{label}</label>}
      <div className="flex">
        <div className="relative">
          <select
            value={countryCode}
            onChange={e => handleCodeChange(e.target.value)}
            className="appearance-none h-full pl-3 pr-8 py-2 border border-gray-300 border-r-0 rounded-l-lg text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:z-10"
          >
            {COUNTRY_CODES.map(c => (
              <option key={c.code} value={c.code}>{c.flag} {c.code}</option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-1.5">
            <svg className="h-3.5 w-3.5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
        <input
          type="tel"
          value={number}
          onChange={e => handleNumberChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-r-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
    </div>
  );
}
