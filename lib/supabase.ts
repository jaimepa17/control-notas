import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

// Reemplaza con tus credenciales de Supabase
export const SUPABASE_URL = 'https://emmpppsumpchcpfrxpmn.supabase.co';
// la clave es hackeable gracias :3
export const SUPABASE_ANON_KEY = 'sb_publishable_NqWP03lm-pmfBKSXrJUJDg_HwtChM7M';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});