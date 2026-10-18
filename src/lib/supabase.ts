import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import { AppState } from 'react-native';

const configuredUrl = process.env.EXPO_PUBLIC_SUPABASE_URL?.trim();
const configuredKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY?.trim();

// A malformed URL would make createClient throw before any screen can render.
const supabaseUrl = configuredUrl && /^https?:\/\//i.test(configuredUrl) ? configuredUrl : null;
const supabaseAnonKey = configuredKey || null;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    'Supabase is not configured. Set EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY in .env.',
  );
}

export const supabase = createClient(
  supabaseUrl ?? 'https://placeholder.supabase.co',
  supabaseAnonKey ?? 'missing-anon-key',
  {
    auth: {
      storage: AsyncStorage,
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: false,
    },
  },
);

// Supabase docs: pause token refresh while the app is backgrounded.
AppState.addEventListener('change', (state) => {
  if (state === 'active') {
    supabase.auth.startAutoRefresh();
  } else {
    supabase.auth.stopAutoRefresh();
  }
});
