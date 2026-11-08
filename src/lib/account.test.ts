import { describe, expect, it } from 'vitest';
import type { User } from '@supabase/supabase-js';
import {
  displayNameFor,
  isGoogleOnly,
  isReauthError,
  usernameFrom,
  validatePassword,
  validateUsername,
} from './account';

function fakeUser(overrides: Partial<User>): User {
  return { id: 'u1', app_metadata: {}, user_metadata: {}, ...overrides } as User;
}

describe('username rules', () => {
  it('accepts 3 to 20 letters, numbers, underscores and dots', () => {
    expect(validateUsername('abc')).toBeNull();
    expect(validateUsername('nimal.perera_99')).toBeNull();
    expect(validateUsername('a'.repeat(20))).toBeNull();
  });

  it('rejects values that are too short, too long or use other characters', () => {
    expect(validateUsername('ab')).toBe('Use at least 3 characters.');
    expect(validateUsername('a'.repeat(21))).toBe('Use 20 characters or fewer.');
    expect(validateUsername('nimal perera')).toBe('Use letters, numbers, underscores and dots only.');
    expect(validateUsername('nimal@home')).toBe('Use letters, numbers, underscores and dots only.');
  });
});

describe('password rules', () => {
  it('needs 8 characters and a matching confirmation', () => {
    expect(validatePassword('1234567', '1234567')).toBe('Use at least 8 characters.');
    expect(validatePassword('12345678', '12345679')).toBe('The two passwords do not match.');
    expect(validatePassword('12345678', '12345678')).toBeNull();
  });
});

describe('display name', () => {
  it('uses the username when set, otherwise the email before the @', () => {
    expect(
      displayNameFor(fakeUser({ email: 'nimal@example.com', user_metadata: { username: 'nimal.p' } })),
    ).toBe('nimal.p');
    expect(displayNameFor(fakeUser({ email: 'nimal@example.com' }))).toBe('nimal');
    expect(displayNameFor(null)).toBe('there');
  });

  it('ignores blank or non-string usernames', () => {
    expect(usernameFrom(fakeUser({ user_metadata: { username: '   ' } }))).toBe('');
    expect(usernameFrom(fakeUser({ user_metadata: { username: 42 } }))).toBe('');
  });
});

describe('google-only accounts', () => {
  it('is true only when no email identity exists', () => {
    expect(
      isGoogleOnly(fakeUser({ identities: [{ provider: 'google' }] } as Partial<User>)),
    ).toBe(true);
    expect(
      isGoogleOnly(
        fakeUser({ identities: [{ provider: 'google' }, { provider: 'email' }] } as Partial<User>),
      ),
    ).toBe(false);
    expect(isGoogleOnly(fakeUser({ app_metadata: { provider: 'google' } }))).toBe(true);
  });
});

describe('reauth detection', () => {
  it('spots the fresh-sign-in error and leaves other errors alone', () => {
    expect(isReauthError('Password update requires reauthentication')).toBe(true);
    expect(isReauthError('Password should be at least 6 characters')).toBe(false);
  });
});
