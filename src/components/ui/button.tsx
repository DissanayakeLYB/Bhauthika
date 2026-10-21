import Link from 'next/link';
import type { ReactNode } from 'react';
import { Icon, type IconName } from '@/components/ui/icon';
import { cn } from '@/lib/utils';

export type ButtonVariant = 'primary' | 'ghost' | 'amber';

const variants: Record<ButtonVariant, string> = {
  primary:
    'bg-primary text-white shadow-[0_4px_12px_rgba(32,37,107,0.18)] hover:bg-primary-pressed active:bg-primary-deep',
  ghost: 'border border-border bg-surface text-primary hover:bg-canvas active:bg-surface-container',
  amber: 'bg-amber-soft text-amber-ink hover:bg-amber-tint active:bg-[#fcebd3]',
};

const base =
  'inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-card px-5 py-3 font-display text-[15px] font-semibold transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-45';

interface CommonProps {
  label: string;
  variant?: ButtonVariant;
  icon?: IconName;
  iconPosition?: 'left' | 'right';
  className?: string;
  children?: ReactNode;
}

type ButtonProps = CommonProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'className' | 'children'>;

export function ActionButton({
  label,
  variant = 'primary',
  icon,
  iconPosition = 'left',
  className,
  type = 'button',
  ...rest
}: ButtonProps) {
  return (
    <button type={type} className={cn(base, variants[variant], className)} {...rest}>
      {icon && iconPosition === 'left' ? <Icon name={icon} size={19} /> : null}
      <span>{label}</span>
      {icon && iconPosition === 'right' ? <Icon name={icon} size={19} /> : null}
    </button>
  );
}

type LinkButtonProps = CommonProps & {
  href: string;
  prefetch?: boolean;
  'aria-label'?: string;
  onClick?: () => void;
};

export function ActionLink({
  href,
  label,
  variant = 'primary',
  icon,
  iconPosition = 'left',
  className,
  prefetch,
  ...rest
}: LinkButtonProps) {
  return (
    <Link href={href} prefetch={prefetch} className={cn(base, variants[variant], className)} {...rest}>
      {icon && iconPosition === 'left' ? <Icon name={icon} size={19} /> : null}
      <span>{label}</span>
      {icon && iconPosition === 'right' ? <Icon name={icon} size={19} /> : null}
    </Link>
  );
}
