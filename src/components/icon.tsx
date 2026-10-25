import type { ReactNode } from 'react';

const strokeIcons = {
  close: (
    <>
      <path d="M6 6l12 12" />
      <path d="M18 6 6 18" />
    </>
  ),
  flask: (
    <>
      <path d="M9.5 3h5" />
      <path d="M10.5 3v5.6L4.8 18a2 2 0 0 0 1.7 3h11a2 2 0 0 0 1.7-3L13.5 8.6V3" />
      <path d="M7.4 14h9.2" />
    </>
  ),
  insights: (
    <>
      <path d="M4 20V14" />
      <path d="M10 20V9" />
      <path d="M16 20v-4" />
      <path d="M21 20H3" />
      <path d="m14 8 3-3 3 2 3-4" />
    </>
  ),
  home: (
    <>
      <path d="M3 10.6 12 3l9 7.6V20a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 20z" />
      <path d="M9 21.5v-7h6v7" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5.2l3.2 2" />
    </>
  ),
  'arrow-right': (
    <>
      <path d="M4 12h15" />
      <path d="m13 6 6 6-6 6" />
    </>
  ),
  check: <path d="m4 12.5 5 5L20 6.5" />,
  'check-circle': (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="m8 12.2 2.8 2.8L16.4 9" />
    </>
  ),
  warning: (
    <>
      <path d="M12 3.2 2.8 20h18.4z" />
      <path d="M12 9.5v4.4" />
      <path d="M12 17.2v.1" />
    </>
  ),
  'chevron-right': <path d="m9 5.5 6.5 6.5L9 18.5" />,
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-4.4-4.4" />
    </>
  ),
  verified: (
    <>
      <path d="M12 3.2 19 6v5.9c0 4-2.9 7.3-7 8.9-4.1-1.6-7-4.9-7-8.9V6z" />
      <path d="m9 12 2.2 2.2L15.4 10" />
    </>
  ),
  book: (
    <>
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </>
  ),
  mail: (
    <>
      <rect x="2.5" y="5" width="19" height="14" rx="2.5" />
      <path d="m3.2 7.2 8.8 6 8.8-6" />
    </>
  ),
  lightbulb: (
    <>
      <path d="M9 18h6" />
      <path d="M10 21h4" />
      <path d="M12 3a6 6 0 0 0-3.5 10.9c.6.4.9 1 .9 1.7V17h5.2v-1.4c0-.7.3-1.3.9-1.7A6 6 0 0 0 12 3z" />
    </>
  ),
  flag: (
    <>
      <path d="M5 21V4" />
      <path d="M5 4h11l-1.4 4L16 12H5" />
    </>
  ),
  bookmark: <path d="M6.5 3h11v18l-5.5-3.8L6.5 21z" />,
  share: (
    <>
      <circle cx="18" cy="5" r="2.8" />
      <circle cx="6" cy="12" r="2.8" />
      <circle cx="18" cy="19" r="2.8" />
      <path d="m8.5 13.4 7 4.2" />
      <path d="m15.5 6.4-7 4.2" />
    </>
  ),
  tune: (
    <>
      <path d="M4 7h9" />
      <path d="M18 7h2" />
      <path d="M4 12h3" />
      <path d="M13 12h7" />
      <path d="M4 17h9" />
      <path d="M18 17h2" />
      <circle cx="15.5" cy="7" r="2" />
      <circle cx="9.5" cy="12" r="2" />
      <circle cx="15.5" cy="17" r="2" />
    </>
  ),
  sun: (
    <>
      <circle cx="12" cy="12" r="4.2" />
      <path d="M12 2.6v2.2" />
      <path d="M12 19.2v2.2" />
      <path d="M4.4 4.4 6 6" />
      <path d="m18 18 1.6 1.6" />
      <path d="M2.6 12h2.2" />
      <path d="M19.2 12h2.2" />
      <path d="M4.4 19.6 6 18" />
      <path d="m18 6 1.6-1.6" />
    </>
  ),
  moon: <path d="M20.4 14.6A8.4 8.4 0 0 1 9.4 3.6a8.4 8.4 0 1 0 11 11z" />,
  'trend-up': (
    <>
      <path d="m3 17 6-6 4 4 8-8" />
      <path d="M15 7h6v6" />
    </>
  ),
  document: (
    <>
      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
      <path d="M14 3v5h5" />
    </>
  ),
} satisfies Record<string, ReactNode>;

const solidIcons = {
  play: <path d="M8 5.2v13.6L19 12z" />,
  bolt: <path d="M13.2 2 4.5 13.6H10l-1 8.4L19 10.2h-5.6z" />,
  sparkle: (
    <>
      <path d="m11 2.5 1.7 5.1 5.1 1.7-5.1 1.7L11 16.1 9.3 11 4.2 9.3l5.1-1.7z" />
      <path d="m18.5 14 .9 2.6 2.6.9-2.6.9-.9 2.6-.9-2.6-2.6-.9 2.6-.9z" />
    </>
  ),
  fire: (
    <path d="M12.3 2c.5 3.2 4.2 4.6 4.2 8.6a4.5 4.5 0 0 1-9 0c0-1.7.7-2.9 1.6-3.8.1 1.3.7 2.1 1.4 2.1.7-2.2-.4-4.5 1.8-6.9z" />
  ),
} satisfies Record<string, ReactNode>;

export type IconName = keyof typeof strokeIcons | keyof typeof solidIcons;

interface IconProps {
  name: IconName;
  size?: number;
  className?: string;
  strokeWidth?: number;
}

export function Icon({ name, size = 20, className, strokeWidth = 1.75 }: IconProps) {
  const solid = name in solidIcons;
  const children = solid
    ? solidIcons[name as keyof typeof solidIcons]
    : strokeIcons[name as keyof typeof strokeIcons];

  return (
    <svg
      aria-hidden="true"
      focusable="false"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={solid ? 'currentColor' : 'none'}
      stroke={solid ? 'none' : 'currentColor'}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {children}
    </svg>
  );
}
