import { Icon, type IconName } from '@/components/icon';
import { cn } from '@/lib/utils';

const base =
  'inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-card px-5 py-3 font-display text-[15px] font-semibold transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-45';

type ButtonVariant = 'primary' | 'ghost';

const variants: Record<ButtonVariant, string> = {
  primary:
    'bg-primary-solid text-white shadow-[0_4px_12px_rgba(32,37,107,0.18)] hover:bg-primary-pressed active:bg-primary-deep',
  ghost: 'border border-border bg-surface text-primary hover:bg-canvas active:bg-surface-container',
};

interface ActionButtonProps {
  label: string;
  variant?: ButtonVariant;
  icon?: IconName;
  iconPosition?: 'left' | 'right';
  className?: string;
}

export function ActionButton({
  label,
  variant = 'primary',
  icon,
  iconPosition = 'left',
  className,
  type = 'button',
  ...rest
}: ActionButtonProps & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'className' | 'children'>) {
  return (
    <button type={type} className={cn(base, variants[variant], className)} {...rest}>
      {icon && iconPosition === 'left' ? <Icon name={icon} size={19} /> : null}
      <span>{label}</span>
      {icon && iconPosition === 'right' ? <Icon name={icon} size={19} /> : null}
    </button>
  );
}
