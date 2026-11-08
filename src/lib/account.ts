import type { User } from '@supabase/supabase-js';

/** Username rules: 3–20 characters, letters, numbers, underscore and dot. */
export const USERNAME_MIN = 3;
export const USERNAME_MAX = 20;
const USERNAME_PATTERN = /^[A-Za-z0-9_.]+$/;

export const GOOGLE_ONLY_MESSAGE = 'You sign in with Google. You do not need a password.';
export const REAUTH_MESSAGE =
  'For safety, sign out, sign in again, then change your password.';

/** The username stored in user metadata, or an empty string when unset. */
export function usernameFrom(user: User | null): string {
  const value = user?.user_metadata?.username;
  return typeof value === 'string' ? value.trim() : '';
}

/** Username if set, otherwise the part of the email before the "@". */
export function displayNameFor(user: User | null): string {
  const username = usernameFrom(user);
  if (username) return username;
  const localPart = (user?.email ?? '').split('@')[0];
  return localPart || 'there';
}

export function validateUsername(raw: string): string | null {
  const value = raw.trim();
  if (value.length < USERNAME_MIN) return `Use at least ${USERNAME_MIN} characters.`;
  if (value.length > USERNAME_MAX) return `Use ${USERNAME_MAX} characters or fewer.`;
  if (!USERNAME_PATTERN.test(value)) return 'Use letters, numbers, underscores and dots only.';
  return null;
}

export function validatePassword(password: string, confirm: string): string | null {
  if (password.length < 8) return 'Use at least 8 characters.';
  if (password !== confirm) return 'The two passwords do not match.';
  return null;
}

/** True when the account only has OAuth identities, so it has no password to change. */
export function isGoogleOnly(user: User | null): boolean {
  const providers = (user?.identities ?? [])
    .map((identity) => identity.provider)
    .filter((provider): provider is string => Boolean(provider));

  if (providers.length > 0) return !providers.includes('email');
  return user?.app_metadata?.provider === 'google';
}

/** Supabase asks for a fresh sign-in before some password changes. */
export function isReauthError(message: string): boolean {
  const text = message.toLowerCase();
  return (
    text.includes('reauthenticat') ||
    text.includes('recent sign') ||
    text.includes('sign in again') ||
    text.includes('session is not fresh')
  );
}
