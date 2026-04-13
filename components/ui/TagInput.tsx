'use client';

import { useState, useRef, useEffect } from 'react';

interface TagInputOption {
  value: string;
  label: string;
  group?: string;
}

interface TagInputProps {
  label?: string;
  hint?: string;
  options: TagInputOption[];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
  allowCustom?: boolean;
}

export default function TagInput({
  label,
  hint,
  options,
  selected,
  onChange,
  placeholder = 'Select...',
  allowCustom = false,
}: TagInputProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const available = options.filter(
    opt => !selected.includes(opt.value) && opt.label.toLowerCase().includes(search.toLowerCase())
  );

  const groups = Array.from(new Set(available.map(opt => opt.group || 'DEFAULT PROPERTIES')));

  function removeTag(value: string) {
    onChange(selected.filter(s => s !== value));
  }

  function addTag(value: string) {
    onChange([...selected, value]);
    setSearch('');
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Backspace' && search === '' && selected.length > 0) {
      removeTag(selected[selected.length - 1]);
    }
    if (e.key === 'Enter' && allowCustom && search.trim()) {
      e.preventDefault();
      if (!selected.includes(search.trim())) {
        addTag(search.trim());
      }
    }
    if (e.key === 'Escape') {
      setIsOpen(false);
    }
  }

  function getLabel(value: string) {
    const opt = options.find(o => o.value === value);
    return opt ? opt.label : value;
  }

  return (
    <div className="relative space-y-1.5" ref={containerRef}>
      {label && <label className="block text-sm font-medium text-gray-700">{label}</label>}
      <div
        className={`flex flex-wrap items-center gap-1.5 px-3 py-2 border rounded-lg bg-white cursor-text min-h-[42px] transition-colors ${
          isOpen ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-gray-300'
        }`}
        onClick={() => {
          setIsOpen(true);
          inputRef.current?.focus();
        }}
      >
        {selected.map(value => (
          <span
            key={value}
            className="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-100 text-gray-700 rounded text-sm"
          >
            {getLabel(value)}
            <button
              type="button"
              onClick={e => {
                e.stopPropagation();
                removeTag(value);
              }}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </span>
        ))}
        <input
          ref={inputRef}
          type="text"
          value={search}
          onChange={e => {
            setSearch(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={selected.length === 0 ? placeholder : ''}
          className="flex-1 min-w-[120px] text-sm outline-none bg-transparent placeholder-gray-400"
        />
        {selected.length > 0 && (
          <button
            type="button"
            onClick={e => {
              e.stopPropagation();
              onChange([]);
            }}
            className="text-gray-400 hover:text-gray-600 flex-shrink-0"
          >
            <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        )}
        <svg className="w-4 h-4 text-gray-400 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </div>

      {isOpen && available.length > 0 && (
        <div className="absolute z-50 left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {groups.map(group => (
            <div key={group}>
              <div className="px-3 py-2 text-xs font-medium text-gray-400 uppercase tracking-wider">
                {group}
              </div>
              {available
                .filter(opt => (opt.group || 'DEFAULT PROPERTIES') === group)
                .map(opt => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => addTag(opt.value)}
                    className="w-full text-left px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    {opt.label}
                  </button>
                ))}
            </div>
          ))}
        </div>
      )}

      {hint && <p className="text-xs text-gray-500">{hint}</p>}
    </div>
  );
}
