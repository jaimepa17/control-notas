import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { supabase } from '@/lib/supabase';

type Carrera = {
  id: string | number;
  nombre?: string | null;
  created_at?: string | null;
  [key: string]: unknown;
};

type HomeProps = {
  userEmail?: string;
};

export default function Home({ userEmail }: HomeProps) {
  const [carreras, setCarreras] = useState<Carrera[]>([]);
  const [loading, setLoading] = useState(true);
  const [signingOut, setSigningOut] = useState(false);
  const [accountPanelVisible, setAccountPanelVisible] = useState(false);

  const cerrarSesion = async () => {
    if (signingOut) {
      return;
    }

    setSigningOut(true);
    const { error } = await supabase.auth.signOut();
    if (error) {
      Alert.alert('No se pudo cerrar sesión', error.message);
    }
    setSigningOut(false);
  };

  const cambiarCuenta = () => {
    setAccountPanelVisible(false);
    Alert.alert(
      'Cambiar de cuenta',
      'Se cerrará la sesión actual para iniciar con otra cuenta.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Continuar',
          style: 'destructive',
          onPress: cerrarSesion,
        },
      ]
    );
  };

  const openAccountPanel = () => {
    setAccountPanelVisible(true);
  };

  const closeAccountPanel = () => {
    setAccountPanelVisible(false);
  };

  useEffect(() => {
    const cargarCarreras = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('carreras')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        Alert.alert('No se pudieron cargar las carreras', error.message);
      }

      setCarreras((data as Carrera[]) ?? []);
      setLoading(false);
    };

    cargarCarreras();
  }, []);

  const renderCarrera = ({ item, index }: { item: Carrera; index: number }) => {
    const titulo =
      (typeof item.nombre === 'string' && item.nombre.trim()) ||
      `Carrera ${index + 1}`;

    return (
      <TouchableOpacity
        accessibilityRole="button"
        activeOpacity={0.9}
        className="mb-5"
      >
        <View className="relative">
          <View className="absolute inset-0 translate-x-2 translate-y-2 rounded-[28px] bg-black" />
          <View className="rounded-[28px] border-[3px] border-black bg-[#FDF9F1] p-6">
            <View className="mb-4 flex-row items-start justify-between">
              <View className="flex-1 pr-3">
                <Text className="text-2xl font-black text-black">{titulo}</Text>
                <Text className="mt-2 text-sm font-medium text-[#6B5A4A]">
                  Programa académico
                </Text>
              </View>

              <View className="rounded-full border-[3px] border-black bg-[#FFD9A0] px-3 py-2">
                <Text className="text-xs font-black text-black">CLASE</Text>
              </View>
            </View>

            <View className="rounded-2xl border-[3px] border-black bg-[#FFF7E8] px-4 py-3">
              <Text className="text-xs font-bold uppercase tracking-wide text-[#7A6857]">
                Fecha de creación
              </Text>
              <Text className="mt-1 text-base font-semibold text-black">
                {item.created_at
                  ? new Date(item.created_at).toLocaleDateString('es-ES')
                  : 'Fecha no disponible'}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const Header = () => (
    <View className="mb-6">
      <View className="mb-5 flex-row items-start justify-between">
        <View className="flex-1 pr-4">
          <Text className="text-4xl font-black text-[#1E140D]">¡Hola, Profe!</Text>
          <Text className="mt-2 text-base font-medium text-[#3A2B20]">
            Organiza tus carreras como en una libreta bonita.
          </Text>
        </View>

        <TouchableOpacity
          accessibilityRole="button"
          activeOpacity={0.9}
          onPress={openAccountPanel}
          className="relative"
        >
          <View className="absolute inset-0 translate-x-1.5 translate-y-1.5 rounded-full bg-black" />
          <View className="h-20 w-20 items-center justify-center rounded-full border-[4px] border-black bg-[#FDF9F1]">
            <Text className="text-3xl">🐱</Text>
          </View>
        </TouchableOpacity>
      </View>

      <View className="self-start rounded-full border-[3px] border-black bg-[#FDF9F1] px-5 py-2">
        <Text className="text-sm font-black text-black">Mis Carreras</Text>
      </View>
    </View>
  );

  const EmptyState = () => (
    <View className="mt-8 items-center justify-center px-1">
      <View className="relative w-full">
        <View className="absolute inset-0 translate-x-2 translate-y-2 rounded-[32px] bg-black" />
        <View className="items-center rounded-[32px] border-[3px] border-black bg-[#FDF9F1] px-6 py-10">
          <Text className="text-5xl">📒</Text>
          <Text className="mt-4 text-center text-2xl font-black text-black">
            Tu libreta está vacía
          </Text>
          <Text className="mt-3 text-center text-base font-medium leading-6 text-[#5F5146]">
            ¡Agrega tu primera clase y empieza a organizar tus programas académicos!
          </Text>

          <TouchableOpacity
            accessibilityRole="button"
            activeOpacity={0.9}
            className="mt-6 rounded-2xl border-[3px] border-black bg-[#FFD98E] px-6 py-4"
          >
            <Text className="text-base font-black text-black">
              + Agregar Nueva Carrera
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-[#AF8F76] px-6">
        <View className="absolute left-6 right-6 top-16 bottom-16 rounded-[36px] border-[3px] border-black bg-[#FDF9F1]" />
        <ActivityIndicator size="large" color="#000000" />
        <Text className="mt-4 text-base font-bold text-[#1E140D]">
          Cargando tu libreta...
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-[#AF8F76]">
      <Modal
        visible={accountPanelVisible}
        animationType="slide"
        transparent
        onRequestClose={closeAccountPanel}
      >
        <Pressable className="flex-1 bg-black/30" onPress={closeAccountPanel}>
          <View className="flex-1 justify-end">
            <Pressable className="rounded-t-[36px] border-[4px] border-black bg-[#FDF9F1] px-5 pt-5 pb-8">
              <View className="mb-4 items-center">
                <View className="h-2 w-20 rounded-full bg-[#B9987A]" />
              </View>

              <View className="relative mb-5">
                <View className="absolute inset-0 translate-x-2 translate-y-2 rounded-[30px] bg-black" />
                <View className="rounded-[30px] border-[3px] border-black bg-[#FFF7E8] p-5">
                  <View className="flex-row items-center">
                    <View className="h-20 w-20 items-center justify-center rounded-full border-[4px] border-black bg-[#FDF9F1]">
                      <Text className="text-3xl">🐱</Text>
                    </View>

                    <View className="ml-4 flex-1">
                      <Text className="text-2xl font-black text-black">Mi cuenta</Text>
                      <Text className="mt-1 text-base font-semibold text-[#5E5045]">
                        {userEmail ?? 'Usuario autenticado'}
                      </Text>
                      <Text className="mt-2 text-sm font-medium text-[#7A6857]">
                        Avatar provisional. Luego podrás subir tu foto.
                      </Text>
                    </View>
                  </View>
                </View>
              </View>

              <View className="relative mb-4">
                <View className="absolute inset-0 translate-x-2 translate-y-2 rounded-[28px] bg-black" />
                <View className="rounded-[28px] border-[3px] border-black bg-[#F7E7C6] p-5">
                  <Text className="text-xs font-bold uppercase tracking-wide text-[#6B5747]">
                    Opciones de cuenta
                  </Text>

                  <View className="mt-4 gap-3">
                    <View className="rounded-2xl border-[3px] border-black bg-[#D9F2C7] px-4 py-4">
                      <Text className="text-base font-black text-black">Perfil del profesor</Text>
                      <Text className="mt-1 text-sm font-medium text-[#4C5B42]">
                        Visualiza tu nombre, correo y futura foto de perfil.
                      </Text>
                    </View>

                    <View className="rounded-2xl border-[3px] border-black bg-[#D7ECFF] px-4 py-4">
                      <Text className="text-base font-black text-black">Configuraciones avanzadas</Text>
                      <Text className="mt-1 text-sm font-medium text-[#44596A]">
                        Apariencia, notificaciones, seguridad y preferencias. Solo visual por ahora.
                      </Text>
                    </View>

                    <View className="rounded-2xl border-[3px] border-dashed border-black bg-[#FFE7BD] px-4 py-4">
                      <Text className="text-base font-black text-black">Próximamente</Text>
                      <Text className="mt-1 text-sm font-medium text-[#6E5735]">
                        Cambiar avatar, editar nombre y administrar sesiones activas.
                      </Text>
                    </View>
                  </View>
                </View>
              </View>

              <View className="flex-row gap-3">
                <TouchableOpacity
                  accessibilityRole="button"
                  disabled={signingOut}
                  onPress={cambiarCuenta}
                  activeOpacity={0.9}
                  className="flex-1 rounded-2xl border-[3px] border-black bg-[#A7D8FF] px-4 py-4"
                >
                  <Text className="text-center text-sm font-black text-black">
                    {signingOut ? 'Procesando...' : 'Cambiar cuenta'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  accessibilityRole="button"
                  disabled={signingOut}
                  onPress={cerrarSesion}
                  activeOpacity={0.9}
                  className="flex-1 rounded-2xl border-[3px] border-black bg-[#FFC9C2] px-4 py-4"
                >
                  <Text className="text-center text-sm font-black text-black">
                    Cerrar sesión
                  </Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                accessibilityRole="button"
                activeOpacity={0.9}
                onPress={closeAccountPanel}
                className="mt-4 self-center rounded-full border-[3px] border-black bg-white px-5 py-2"
              >
                <Text className="text-sm font-black text-black">Cerrar panel</Text>
              </TouchableOpacity>
            </Pressable>
          </View>
        </Pressable>
      </Modal>

      <FlatList
        data={carreras}
        keyExtractor={(item, index) => String(item.id ?? index)}
        renderItem={renderCarrera}
        ListHeaderComponent={Header}
        ListEmptyComponent={EmptyState}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 56,
          paddingBottom: 120,
          flexGrow: 1,
        }}
      />

      <View className="absolute bottom-7 right-6">
        <View className="absolute inset-0 translate-x-2 translate-y-2 rounded-full bg-black" />
        <TouchableOpacity
          accessibilityRole="button"
          activeOpacity={0.9}
          className="h-20 w-20 items-center justify-center rounded-full border-[4px] border-black bg-[#FFB6C9]"
        >
          <Text className="text-4xl font-black text-black">+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}