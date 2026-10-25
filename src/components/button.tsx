import { cn } from '@/lib/utils';

type ButtonVariant = 'primary' | 'text';

const base =
  'inline-flex items-center justify-center gap-2 rounded-sm font-sans text-[0.9375rem] font-medium transition-opacity disabled:cursor-not-allowed disabled:opacity-40';

const variants: Record<ButtonVariant, string> = {
  /* One primary style: flat accent, dark label. Use it once per screen. */
  primary: 'min-h-12 w-full bg-accent px-6 py-3.5 text-bg hover:opacity-90',
  /* Text-only style: no border, no fill. */
  text: 'min-h-11 text-muted hover:text-ink hover:underline underline-offset-4',
};

interface ActionButtonProps {
  label: string;
  variant?: ButtonVariant;
  className?: string;
}

export function ActionButton({
  label,
  variant = 'primary',
  className,
  type = 'button',
  ...rest
}: ActionButtonProps & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'className' | 'children'>) {
  return (
    <button type={type} className={cn(base, variants[variant], className)} {...rest}>
      {label}
    </button>
  );
}
