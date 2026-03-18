export type ServiceResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string; debugMessage?: string };

export function ok<T>(data: T): ServiceResult<T> {
  return { ok: true, data };
}

export function fail<T = never>(
  error: string,
  debugMessage?: string
): ServiceResult<T> {
  return { ok: false, error, debugMessage };
}

export function notImplemented(name: string): ServiceResult<never> {
  return fail(`Servicio pendiente: ${name}`);
}
