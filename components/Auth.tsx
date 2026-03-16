import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { signInWithEmail, signUpWithEmail } from '@/lib/authLogic';
import NotificationBar from '@/components/NotificationBar';
import { checkSupabaseAuthHealth } from '@/lib/serviceMonitor';

type NotificationType = 'success' | 'warning' | 'error';

type NotificationState = {
  visible: boolean;
  type: NotificationType;
  message: string;
};

export default function Auth() {
  const [screen, setScreen] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState<NotificationState>({
    visible: false,
    type: 'warning',
    message: '',
  });
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showNotification = (type: NotificationType, message: string, durationMs = 5000) => {
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
    }

    setNotification({ visible: true, type, message });
    hideTimerRef.current = setTimeout(() => {
      setNotification((prev) => ({ ...prev, visible: false }));
      hideTimerRef.current = null;
    }, durationMs);
  };

  const closeNotification = () => {
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }
    setNotification((prev) => ({ ...prev, visible: false }));
  };

  useEffect(() => {
    let isMounted = true;

    const runHealthCheck = async () => {
      const health = await checkSupabaseAuthHealth();
      if (!isMounted || health.ok) {
        return;
      }

      if (health.severity === 'critical' && !__DEV__) {
        return;
      }

      const baseMessage = health.message ?? 'Hay problemas con el servicio de autenticación.';
      const debugPart = __DEV__ && health.debugMessage ? `\nDetalle: ${health.debugMessage}` : '';
      showNotification(
        health.severity === 'critical' ? 'error' : 'warning',
        `${baseMessage}${debugPart}`,
        6500
      );
    };

    const firstCheckTimer = setTimeout(runHealthCheck, 12000);
    const intervalId = setInterval(runHealthCheck, 60000);

    return () => {
      isMounted = false;
      clearTimeout(firstCheckTimer);
      clearInterval(intervalId);
      if (hideTimerRef.current) {
        clearTimeout(hideTimerRef.current);
      }
    };
  }, []);

  const iniciarSesion = async () => {
    setLoading(true);
    const result = await signInWithEmail(email, password);
    if (!result.ok) {
      const debugPart = __DEV__ && result.debugMessage ? `\nDetalle: ${result.debugMessage}` : '';
      showNotification(
        'error',
        `${result.message ?? 'No se pudo iniciar sesión.'}${debugPart}`,
        7000
      );
    }
    setLoading(false);
  };

  const registrarse = async () => {
    setLoading(true);
    const result = await signUpWithEmail(email, password, confirmPassword);

    if (!result.ok) {
      const debugPart = __DEV__ && result.debugMessage ? `\nDetalle: ${result.debugMessage}` : '';
      showNotification(
        'error',
        `${result.message ?? 'No se pudo crear la cuenta.'}${debugPart}`,
        7000
      );
      setLoading(false);
      return;
    }

    showNotification('success', result.message ?? 'Registro exitoso.', 5500);
    setConfirmPassword('');
    setScreen('login');
    setLoading(false);
  };

  const goToSignup = () => {
    setPassword('');
    setConfirmPassword('');
    setScreen('signup');
  };

  const goToLogin = () => {
    setPassword('');
    setConfirmPassword('');
    setScreen('login');
  };

  const title = screen === 'login' ? 'Iniciar Sesion' : 'Crear Cuenta';

  return (
    <View className="flex-1 justify-center items-center px-4 bg-gray-100">
      <NotificationBar
        visible={notification.visible}
        type={notification.type}
        message={notification.message}
        onClose={closeNotification}
      />

      <Text className="text-3xl font-bold mb-2 text-center text-gray-800">
        Control de Notas
      </Text>
      <Text className="text-base text-gray-600 mb-8">{title}</Text>

      <View className="w-full max-w-sm bg-white rounded-2xl p-6 shadow-md">
        <TextInput
          className="border-b border-gray-300 py-3 mb-5 text-base text-gray-800"
          placeholder="Correo electrónico"
          placeholderTextColor="#9ca3af"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          editable={!loading}
        />

        <TextInput
          className="border-b border-gray-300 py-3 mb-5 text-base text-gray-800"
          placeholder="Contraseña"
          placeholderTextColor="#9ca3af"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          editable={!loading}
        />

        {screen === 'signup' ? (
          <TextInput
            className="border-b border-gray-300 py-3 mb-8 text-base text-gray-800"
            placeholder="Confirmar contraseña"
            placeholderTextColor="#9ca3af"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            editable={!loading}
          />
        ) : (
          <View className="mb-8" />
        )}

        {loading ? (
          <ActivityIndicator size="large" color="#3b82f6" />
        ) : (
          <>
            <TouchableOpacity
              onPress={screen === 'login' ? iniciarSesion : registrarse}
              className="bg-blue-500 py-4 rounded-xl items-center mb-4 active:bg-blue-600"
            >
              <Text className="text-white font-bold text-base">
                {screen === 'login' ? 'Entrar' : 'Crear cuenta'}
              </Text>
            </TouchableOpacity>

            {screen === 'login' ? (
              <TouchableOpacity onPress={goToSignup} className="py-4 items-center">
                <Text className="text-blue-500 text-sm">Crear cuenta nueva</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={goToLogin} className="py-4 items-center">
                <Text className="text-blue-500 text-sm">Ya tengo cuenta, iniciar sesión</Text>
              </TouchableOpacity>
            )}
          </>
        )}
      </View>
    </View>
  );
}