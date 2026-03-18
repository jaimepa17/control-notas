import { supabase } from '@/lib/supabase';
import { fail, ServiceResult } from './_result';

export async function getCurrentUserId(): Promise<ServiceResult<string>> {
  const { data, error } = await supabase.auth.getUser();

  if (error) {
    return fail('No se pudo validar la sesión actual.', error.message);
  }

  const userId = data.user?.id;
  if (!userId) {
    return fail('Debes iniciar sesión para continuar.');
  }

  return { ok: true, data: userId };
}
