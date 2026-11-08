'use client';

import { FormEvent, useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ActionButton } from '@/components/button';
import { TextField } from '@/components/field';
import { Label } from '@/components/type';
import { PageHead, Screen } from '@/components/page';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';
import {
  GOOGLE_ONLY_MESSAGE,
  isGoogleOnly,
  isReauthError,
  REAUTH_MESSAGE,
  USERNAME_MAX,
  USERNAME_MIN,
  usernameFrom,
  validatePassword,
  validateUsername,
} from '@/lib/account';

export default function AccountPage() {
  const { user, signOut } = useAuth();
  const router = useRouter();

  const [editingUsername, setEditingUsername] = useState(false);
  const [usernameDraft, setUsernameDraft] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [usernameNotice, setUsernameNotice] = useState('');
  const [savingUsername, setSavingUsername] = useState(false);

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordNotice, setPasswordNotice] = useState('');
  const [savingPassword, setSavingPassword] = useState(false);

  const [signingOut, setSigningOut] = useState(false);

  const storedUsername = usernameFrom(user);
  const googleOnly = isGoogleOnly(user);

  const startUsernameEdit = useCallback(() => {
    setUsernameDraft(storedUsername);
    setUsernameError('');
    setUsernameNotice('');
    setEditingUsername(true);
  }, [storedUsername]);

  const cancelUsernameEdit = useCallback(() => {
    setEditingUsername(false);
    setUsernameError('');
  }, []);

  const saveUsername = useCallback(
    async (event: FormEvent) => {
      event.preventDefault();
      const value = usernameDraft.trim();
      const invalid = validateUsername(value);
      if (invalid) {
        setUsernameError(invalid);
        return;
      }

      setUsernameError('');
      setUsernameNotice('');
      setSavingUsername(true);
      const { error } = await supabase.auth.updateUser({ data: { username: value } });
      setSavingUsername(false);

      if (error) {
        setUsernameError(error.message);
        return;
      }
      setEditingUsername(false);
      setUsernameNotice('Username saved.');
    },
    [usernameDraft],
  );

  const changePassword = useCallback(
    async (event: FormEvent) => {
      event.preventDefault();
      const invalid = validatePassword(password, confirmPassword);
      if (invalid) {
        setPasswordError(invalid);
        return;
      }

      setPasswordError('');
      setPasswordNotice('');
      setSavingPassword(true);
      const { error } = await supabase.auth.updateUser({ password });
      setSavingPassword(false);

      if (error) {
        setPasswordError(isReauthError(error.message) ? REAUTH_MESSAGE : error.message);
        return;
      }
      setPassword('');
      setConfirmPassword('');
      setPasswordNotice('Password changed.');
    },
    [password, confirmPassword],
  );

  const handleSignOut = useCallback(async () => {
    setSigningOut(true);
    await signOut();
    router.replace('/');
  }, [signOut, router]);

  return (
    <Screen>
      <PageHead label="Account" title="Your account" lead="One student, one practice record." />

      <section aria-labelledby="username-title" className="border-t border-line pt-10">
        <div className="flex items-baseline justify-between gap-6">
          <Label className="text-muted">
            <span id="username-title">Username</span>
          </Label>
          {editingUsername ? null : (
            <ActionButton
              id="btn-edit-username"
              label={storedUsername ? 'Edit' : 'Add username'}
              variant="text"
              className="min-h-0 text-meta"
              disabled={savingUsername}
              onClick={startUsernameEdit}
            />
          )}
        </div>

        {editingUsername ? (
          <form id="form-username" onSubmit={saveUsername} className="mt-6 space-y-6">
            <TextField
              id="input-username"
              label="Display name"
              autoComplete="username"
              minLength={USERNAME_MIN}
              placeholder="your.name"
              value={usernameDraft}
              onChange={(value) => {
                setUsernameDraft(value);
                setUsernameError('');
              }}
            />
            <p className="text-meta text-muted">
              {USERNAME_MIN}–{USERNAME_MAX} characters. Letters, numbers, underscore and dot.
            </p>
            {usernameError ? (
              <p id="username-error" role="alert" className="text-meta text-wrong">
                {usernameError}
              </p>
            ) : null}
            <div className="flex items-center gap-8">
              <ActionButton
                id="btn-save-username"
                type="submit"
                label={savingUsername ? 'Saving…' : 'Save'}
                variant="text"
                className="min-h-0 text-meta text-ink"
                disabled={savingUsername}
              />
              <ActionButton
                id="btn-cancel-username"
                label="Cancel"
                variant="text"
                className="min-h-0 text-meta"
                disabled={savingUsername}
                onClick={cancelUsernameEdit}
              />
            </div>
          </form>
        ) : (
          <p id="username-value" className="mt-4 break-all text-body text-ink">
            {storedUsername || <span className="text-muted">Not set</span>}
          </p>
        )}

        {!editingUsername && usernameNotice ? (
          <p id="username-success" role="status" className="mt-3 text-meta text-correct">
            {usernameNotice}
          </p>
        ) : null}
      </section>

      <section aria-labelledby="email-title" className="border-t border-line pt-10">
        <Label className="text-muted">
          <span id="email-title">Email</span>
        </Label>
        <p id="email-value" className="mt-4 break-all font-mono text-body text-ink">
          {user?.email ?? '—'}
        </p>
      </section>

      <section aria-labelledby="password-title" className="border-t border-line pt-10">
        <Label className="text-muted">
          <span id="password-title">Change password</span>
        </Label>

        {googleOnly ? (
          <p className="mt-4 max-w-[46ch] text-body text-muted">{GOOGLE_ONLY_MESSAGE}</p>
        ) : (
          <form id="form-password" onSubmit={changePassword} className="mt-6 space-y-6">
            <TextField
              id="input-new-password"
              label="New password"
              type="password"
              autoComplete="new-password"
              minLength={8}
              placeholder="At least 8 characters"
              value={password}
              onChange={(value) => {
                setPassword(value);
                setPasswordError('');
              }}
            />
            <TextField
              id="input-confirm-password"
              label="Confirm new password"
              type="password"
              autoComplete="new-password"
              minLength={8}
              placeholder="Type it again"
              value={confirmPassword}
              onChange={(value) => {
                setConfirmPassword(value);
                setPasswordError('');
              }}
            />

            {passwordError ? (
              <p id="password-error" role="alert" className="text-meta text-wrong">
                {passwordError}
              </p>
            ) : null}
            {passwordNotice ? (
              <p id="password-success" role="status" className="text-meta text-correct">
                {passwordNotice}
              </p>
            ) : null}

            <ActionButton
              id="btn-change-password"
              type="submit"
              label={savingPassword ? 'Saving…' : 'Change password'}
              disabled={savingPassword || !password || !confirmPassword}
            />
          </form>
        )}
      </section>

      <div className="border-t border-line pt-10">
        <ActionButton
          id="btn-account-sign-out"
          label={signingOut ? 'Signing out…' : 'Sign out'}
          variant="text"
          disabled={signingOut}
          onClick={handleSignOut}
        />
      </div>
    </Screen>
  );
}
