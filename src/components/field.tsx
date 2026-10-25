import type { ChangeEvent } from 'react';
import { cn } from '@/lib/utils';

interface TextFieldProps {
  id: string;
  label: string;
  type?: 'text' | 'email' | 'password';
  value: string;
  onChange: (value: string) => void;
  autoComplete?: string;
  required?: boolean;
  minLength?: number;
  placeholder?: string;
  className?: string;
}

/** Label above a hairline input: the only input style in the app. */
export function TextField({
  id,
  label,
  type = 'text',
  value,
  onChange,
  autoComplete,
  required,
  minLength,
  placeholder,
  className,
}: TextFieldProps) {
  return (
    <div className={className}>
      <label
        htmlFor={id}
        className="font-mono text-label tracking-[0.14em] text-muted uppercase"
      >
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(event: ChangeEvent<HTMLInputElement>) => onChange(event.target.value)}
        autoComplete={autoComplete}
        required={required}
        minLength={minLength}
        placeholder={placeholder}
        className={cn(
          'mt-3 w-full rounded-sm border border-line bg-transparent px-3 py-3',
          'text-body text-ink placeholder:text-muted',
          'transition-colors hover:border-muted focus:border-ink focus:outline-none',
        )}
      />
    </div>
  );
}
