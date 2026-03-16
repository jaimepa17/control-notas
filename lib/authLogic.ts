import { supabase } from '@/lib/supabase';

type AuthResult = {
  ok: boolean;
  message?: string;
  debugMessage?: string;
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function getFriendlyAuthError(errorMessage: string) {
  const message = errorMessage.toLowerCase();

  if (message.includes('email rate limit exceeded')) {
    return 'Demasiados intentos en poco tiempo. Espera unos minutos antes de volver a intentarlo.';
  }

  if (message.includes('invalid login credentials')) {
    return 'Correo o contraseña incorrectos.';
  }

  if (message.includes('email not confirmed')) {
    return 'Debes confirmar tu correo antes de iniciar sesión.';
  }

  if (message.includes('already registered')) {
    return 'Este correo ya está registrado. Intenta iniciar sesión.';
  }

  if (message.includes('password should be at least')) {
    return 'La contraseña debe tener al menos 8 caracteres.';
  }

  if (message.includes('unable to validate email address')) {
    return 'El correo electrónico no tiene un formato válido.';
  }

  return 'Ocurrió un problema de autenticación. Intenta nuevamente.';
}

export function validateLoginInput(email: string, password: string): AuthResult {
  const safeEmail = email.trim().toLowerCase();

  if (!safeEmail || !password) {
    return { ok: false, message: 'Completa correo y contraseña.' };
  }

  if (!EMAIL_REGEX.test(safeEmail)) {
    return { ok: false, message: 'Ingresa un correo electrónico válido.' };
  }

  return { ok: true };
}

export function validateSignupInput(
  email: string,
  password: string,
  confirmPassword: string
): AuthResult {
  const safeEmail = email.trim().toLowerCase();

  if (!safeEmail || !password || !confirmPassword) {
    return { ok: false, message: 'Completa todos los campos del registro.' };
  }

  if (!EMAIL_REGEX.test(safeEmail)) {
    return { ok: false, message: 'Ingresa un correo electrónico válido.' };
  }

  if (password.length < 8) {
    return { ok: false, message: 'La contraseña debe tener al menos 8 caracteres.' };
  }

  if (password !== confirmPassword) {
    return { ok: false, message: 'Las contraseñas no coinciden.' };
  }

  return { ok: true };
}

export async function signInWithEmail(email: string, password: string): Promise<AuthResult> {
  const safeEmail = email.trim().toLowerCase();
  const validation = validateLoginInput(safeEmail, password);

  if (!validation.ok) {
    return validation;
  }

  const { error } = await supabase.auth.signInWithPassword({
    email: safeEmail,
    password,
  });

  if (error) {
    return {
      ok: false,
      message: getFriendlyAuthError(error.message),
      debugMessage: error.message,
    };
  }

  return { ok: true };
}

export async function signUpWithEmail(
  email: string,
  password: string,
  confirmPassword: string
): Promise<AuthResult> {
  const safeEmail = email.trim().toLowerCase();
  const validation = validateSignupInput(safeEmail, password, confirmPassword);

  if (!validation.ok) {
    return validation;
  }

  const { error } = await supabase.auth.signUp({
    email: safeEmail,
    password,
  });

  if (error) {
    return {
      ok: false,
      message: getFriendlyAuthError(error.message),
      debugMessage: error.message,
    };
  }

  return {
    ok: true,
    message: 'Cuenta creada correctamente. Revisa tu correo para verificarla.',
  };
}