import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

// Reemplaza con tus credenciales de Supabase
const supabaseUrl = 'https://emmpppsumpchcpfrxpmn.supabase.co';
const supabaseAnonKey = 'sb_publishable_NqWP03lm-pmfBKSXrJUJDg_HwtChM7M';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});