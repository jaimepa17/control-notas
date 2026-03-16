import { SUPABASE_ANON_KEY, SUPABASE_URL } from '@/lib/supabase';

export type ServiceStatus = {
  ok: boolean;
  severity?: 'warning' | 'critical';
  message?: string;
  debugMessage?: string;
};

export async function checkSupabaseAuthHealth(): Promise<ServiceStatus> {
  try {
    const response = await fetch(`${SUPABASE_URL}/auth/v1/health`, {
      headers: {
        apikey: SUPABASE_ANON_KEY,
      },
    });

    if (response.ok) {
      return { ok: true };
    }

    const statusText = `HTTP ${response.status}`;
    const isCritical = response.status >= 500;

    return {
      ok: false,
      severity: isCritical ? 'critical' : 'warning',
      message: isCritical
        ? 'Servicio de autenticación con incidencias importantes.'
        : 'Servicio de autenticación inestable.',
      debugMessage: statusText,
    };
  } catch (error) {
    const debugMessage = error instanceof Error ? error.message : 'Error desconocido de red';

    return {
      ok: false,
      severity: 'critical',
      message: 'No se pudo conectar con el servicio de autenticación.',
      debugMessage,
    };
  }
}