import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { listCarreras, type Carrera } from '@/lib/services/carrerasService';
import { listAnios, type Anio } from '@/lib/services/aniosService';
import { listAsignaturas, type Asignatura } from '@/lib/services/asignaturasService';
import { listGrupos, type Grupo } from '@/lib/services/gruposService';
import { listParcialesByGrupo } from '@/lib/services/parcialesService';
import { listBloquesByParcial } from '@/lib/services/bloquesService';
import { listActividadesByBloque, type Actividad } from '@/lib/services/actividadesService';
import { listEstudiantes, type Estudiante } from '@/lib/services/estudiantesService';
import { listGrupoEstudiantesByGrupo } from '@/lib/services/grupoEstudiantesService';
import {
  createNota,
  listNotasByActividad,
  type Nota,
  updateNota,
} from '@/lib/services/notasService';
import { useSingleFlight } from '@/lib/hooks/useSingleFlight';

type RegistroNotasActividadProps = {
  onBack: () => void;
};

type ItemChip = {
  id: string;
  nombre: string;
};

const PaperGrid = () => (
  <View
    className="absolute inset-0 overflow-hidden rounded-[34px]"
    style={{ pointerEvents: 'none' }}
  >
    <View className="absolute inset-0 flex-row">
      {Array.from({ length: 22 }).map((_, i) => (
        <View key={`v-${i}`} className="h-full w-6 border-r border-[#DCCEC2]/60" />
      ))}
    </View>

    <View className="absolute inset-0">
      {Array.from({ length: 34 }).map((_, i) => (
        <View key={`h-${i}`} className="w-full h-6 border-b border-[#DCCEC2]/60" />
      ))}
    </View>
  </View>
);

function roundTo2(value: number): number {
  return Math.round(value * 100) / 100;
}

function normalizeNumberInput(raw: string): string {
  return raw.replace(/[^0-9.,]/g, '');
}

export default function RegistroNotasActividad({ onBack }: RegistroNotasActividadProps) {
  const [carreras, setCarreras] = useState<Carrera[]>([]);
  const [anios, setAnios] = useState<Anio[]>([]);
  const [asignaturas, setAsignaturas] = useState<Asignatura[]>([]);
  const [grupos, setGrupos] = useState<Grupo[]>([]);

  const [selectedGrupoId, setSelectedGrupoId] = useState<string | null>(null);
  const [selectedActividadId, setSelectedActividadId] = useState<string | null>(null);
  const [filtroGrupo, setFiltroGrupo] = useState('');

  const [actividades, setActividades] = useState<Actividad[]>([]);
  const [estudiantesGrupo, setEstudiantesGrupo] = useState<Estudiante[]>([]);
  const [notasActividad, setNotasActividad] = useState<Nota[]>([]);
  const [inputsByStudentId, setInputsByStudentId] = useState<Record<string, string>>({});

  const [loadingBase, setLoadingBase] = useState(true);
  const [loadingGrupoData, setLoadingGrupoData] = useState(false);
  const [loadingNotas, setLoadingNotas] = useState(false);

  const { run: runGuardarNotas, isRunning: savingNotas } = useSingleFlight();

  const actividadSeleccionada = useMemo(
    () => actividades.find((item) => item.id === selectedActividadId) ?? null,
    [actividades, selectedActividadId]
  );

  const grupoSeleccionado = useMemo(
    () => grupos.find((item) => item.id === selectedGrupoId) ?? null,
    [grupos, selectedGrupoId]
  );

  const asignaturaSeleccionada = useMemo(
    () =>
      grupoSeleccionado
        ? asignaturas.find((item) => item.id === grupoSeleccionado.asignatura_id) ?? null
        : null,
    [asignaturas, grupoSeleccionado]
  );

  const anioSeleccionado = useMemo(
    () =>
      asignaturaSeleccionada
        ? anios.find((item) => item.id === asignaturaSeleccionada.anio_id) ?? null
        : null,
    [anios, asignaturaSeleccionada]
  );

  const carreraSeleccionada = useMemo(
    () =>
      anioSeleccionado
        ? carreras.find((item) => item.id === anioSeleccionado.carrera_id) ?? null
        : null,
    [carreras, anioSeleccionado]
  );

  const maxPuntajeActividad = roundTo2(Number(actividadSeleccionada?.peso_porcentaje ?? 100));

  const cargarBase = useCallback(async () => {
    setLoadingBase(true);
    const [carrerasResult, aniosResult, asignaturasResult, gruposResult] = await Promise.all([
      listCarreras(),
      listAnios(),
      listAsignaturas(),
      listGrupos(),
    ]);

    if (!carrerasResult.ok) {
      Alert.alert('No se pudieron cargar las carreras', carrerasResult.error);
      setCarreras([]);
      setLoadingBase(false);
      return;
    }

    if (!aniosResult.ok) {
      Alert.alert('No se pudieron cargar los años', aniosResult.error);
      setAnios([]);
      setLoadingBase(false);
      return;
    }

    if (!asignaturasResult.ok) {
      Alert.alert('No se pudieron cargar las asignaturas', asignaturasResult.error);
      setAsignaturas([]);
      setLoadingBase(false);
      return;
    }

    if (!gruposResult.ok) {
      Alert.alert('No se pudieron cargar los grupos', gruposResult.error);
      setGrupos([]);
      setLoadingBase(false);
      return;
    }

    setCarreras(carrerasResult.data);
    setAnios(aniosResult.data);
    setAsignaturas(asignaturasResult.data);
    setGrupos(gruposResult.data);

    setSelectedGrupoId((prev) => {
      if (prev && gruposResult.data.some((item) => item.id === prev)) {
        return prev;
      }
      return gruposResult.data[0]?.id ?? null;
    });
    setLoadingBase(false);
  }, []);

  const cargarGrupoData = useCallback(async (grupoId: string) => {
    setLoadingGrupoData(true);

    const [parcialesResult, grupoEstudiantesResult, estudiantesResult] = await Promise.all([
      listParcialesByGrupo(grupoId),
      listGrupoEstudiantesByGrupo(grupoId),
      listEstudiantes(),
    ]);

    if (!parcialesResult.ok) {
      Alert.alert('No se pudieron cargar los parciales del grupo', parcialesResult.error);
      setActividades([]);
      setSelectedActividadId(null);
      setLoadingGrupoData(false);
      return;
    }

    if (!grupoEstudiantesResult.ok) {
      Alert.alert('No se pudo cargar la matrícula del grupo', grupoEstudiantesResult.error);
      setEstudiantesGrupo([]);
      setLoadingGrupoData(false);
      return;
    }

    if (!estudiantesResult.ok) {
      Alert.alert('No se pudieron cargar los estudiantes', estudiantesResult.error);
      setEstudiantesGrupo([]);
      setLoadingGrupoData(false);
      return;
    }

    const parciales = parcialesResult.data;

    const bloquesByParcial = await Promise.all(
      parciales.map(async (parcial) => {
        const bloquesResult = await listBloquesByParcial(parcial.id);
        return bloquesResult.ok ? bloquesResult.data : [];
      })
    );

    const bloques = bloquesByParcial.flat();

    const actividadesByBloque = await Promise.all(
      bloques.map(async (bloque) => {
        const actividadesResult = await listActividadesByBloque(bloque.id);
        return actividadesResult.ok ? actividadesResult.data : [];
      })
    );

    const actividadesFlatten = actividadesByBloque
      .flat()
      .sort((a, b) => a.created_at.localeCompare(b.created_at));

    setActividades(actividadesFlatten);
    setSelectedActividadId((prev) => {
      if (prev && actividadesFlatten.some((item) => item.id === prev)) {
        return prev;
      }
      return actividadesFlatten[0]?.id ?? null;
    });

    const studentIds = new Set(grupoEstudiantesResult.data.map((item) => item.estudiante_id));
    const estudiantesFiltrados = estudiantesResult.data
      .filter((item) => studentIds.has(item.id))
      .sort((a, b) => a.nombre_completo.localeCompare(b.nombre_completo));

    setEstudiantesGrupo(estudiantesFiltrados);
    setLoadingGrupoData(false);
  }, []);

  const cargarNotasActividad = useCallback(async (actividadId: string) => {
    setLoadingNotas(true);

    const result = await listNotasByActividad(actividadId);
    if (!result.ok) {
      Alert.alert('No se pudieron cargar las notas de la actividad', result.error);
      setNotasActividad([]);
      setInputsByStudentId({});
      setLoadingNotas(false);
      return;
    }

    const notas = result.data;
    setNotasActividad(notas);

    const map: Record<string, string> = {};
    notas.forEach((nota) => {
      map[nota.estudiante_id] = String(nota.puntaje_obtenido);
    });
    setInputsByStudentId(map);
    setLoadingNotas(false);
  }, []);

  useEffect(() => {
    void cargarBase();
  }, [cargarBase]);

  useEffect(() => {
    if (!selectedGrupoId) {
      setActividades([]);
      setSelectedActividadId(null);
      setEstudiantesGrupo([]);
      setNotasActividad([]);
      setInputsByStudentId({});
      return;
    }

    void cargarGrupoData(selectedGrupoId);
  }, [selectedGrupoId, cargarGrupoData]);

  useEffect(() => {
    if (!selectedActividadId) {
      setNotasActividad([]);
      setInputsByStudentId({});
      return;
    }

    void cargarNotasActividad(selectedActividadId);
  }, [selectedActividadId, cargarNotasActividad]);

  const onChangePuntaje = useCallback((studentId: string, raw: string) => {
    const clean = normalizeNumberInput(raw);
    setInputsByStudentId((prev) => ({ ...prev, [studentId]: clean }));
  }, []);

  const guardarNotas = async () => {
    if (!actividadSeleccionada) {
      Alert.alert('Selecciona una actividad', 'Debes elegir una actividad para registrar notas.');
      return;
    }

    if (estudiantesGrupo.length === 0) {
      Alert.alert('Grupo vacío', 'Este grupo no tiene estudiantes matriculados.');
      return;
    }

    await runGuardarNotas(async () => {
      const notasByStudent = new Map(notasActividad.map((nota) => [nota.estudiante_id, nota]));

      let creadas = 0;
      let actualizadas = 0;
      let omitidas = 0;

      for (const estudiante of estudiantesGrupo) {
        const raw = (inputsByStudentId[estudiante.id] ?? '').trim();

        if (!raw) {
          omitidas += 1;
          continue;
        }

        const parsed = Number(raw.replace(',', '.'));
        if (Number.isNaN(parsed)) {
          Alert.alert(
            'Puntaje inválido',
            `El puntaje de ${estudiante.nombre_completo} no es válido.`
          );
          return;
        }

        const puntaje = roundTo2(parsed);
        if (puntaje < 0 || puntaje > maxPuntajeActividad) {
          Alert.alert(
            'Puntaje fuera de rango',
            `El puntaje de ${estudiante.nombre_completo} debe estar entre 0 y ${maxPuntajeActividad}.`
          );
          return;
        }

        const notaExistente = notasByStudent.get(estudiante.id);

        if (!notaExistente) {
          const createResult = await createNota({
            actividad_id: actividadSeleccionada.id,
            estudiante_id: estudiante.id,
            puntaje_obtenido: puntaje,
          });

          if (!createResult.ok) {
            Alert.alert('No se pudo guardar una nota', createResult.error);
            return;
          }

          creadas += 1;
          continue;
        }

        if (Number(notaExistente.puntaje_obtenido) === puntaje) {
          omitidas += 1;
          continue;
        }

        const updateResult = await updateNota(notaExistente.id, {
          puntaje_obtenido: puntaje,
        });

        if (!updateResult.ok) {
          Alert.alert('No se pudo actualizar una nota', updateResult.error);
          return;
        }

        actualizadas += 1;
      }

      await cargarNotasActividad(actividadSeleccionada.id);
      Alert.alert(
        'Notas guardadas',
        `Creadas: ${creadas} • Actualizadas: ${actualizadas} • Sin cambios: ${omitidas}`
      );
    });
  };

  const renderChip = (
    label: string,
    items: ItemChip[],
    selectedId: string | null,
    onSelect: (id: string) => void,
    emptyText: string
  ) => (
    <View className="mt-3 rounded-2xl border-[3px] border-black bg-[#FFF7E8] px-4 py-3">
      <Text className="text-xs font-black uppercase tracking-wide text-[#7A6857]">{label}</Text>
      {items.length === 0 ? (
        <Text className="mt-2 text-sm font-semibold text-[#5E5045]">{emptyText}</Text>
      ) : (
        <View className="mt-2 flex-row flex-wrap gap-2">
          {items.map((item) => {
            const active = item.id === selectedId;
            return (
              <TouchableOpacity
                key={item.id}
                accessibilityRole="button"
                activeOpacity={0.9}
                onPress={() => onSelect(item.id)}
                className={`rounded-full border-[3px] px-3 py-1 ${
                  active ? 'border-black bg-[#D7ECFF]' : 'border-black bg-[#F3E7D5]'
                }`}
              >
                <Text className="text-xs font-black text-black">{item.nombre}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      )}
    </View>
  );

  const gruposFiltrados = useMemo(() => {
    const query = filtroGrupo.trim().toLowerCase();
    if (!query) {
      return grupos;
    }

    return grupos.filter((item) => item.nombre.toLowerCase().includes(query));
  }, [grupos, filtroGrupo]);

  const grupoItems = gruposFiltrados.map((item) => ({ id: item.id, nombre: item.nombre }));
  const actividadItems = actividades.map((item) => ({
    id: item.id,
    nombre: `${item.nombre} (${roundTo2(Number(item.peso_porcentaje ?? 0))}%)`,
  }));

  return (
    <View className="flex-1 bg-[#C5A07D] px-4 pt-12 pb-4">
      <View className="relative mb-4 px-1">
        <View className="relative">
          <View className="absolute inset-0 translate-x-1.5 translate-y-2 rounded-[30px] bg-black" />
          <View className="rounded-[30px] border-[4px] border-black bg-[#EBD7BF] px-5 py-3.5">
            <TouchableOpacity
              accessibilityRole="button"
              activeOpacity={0.9}
              onPress={onBack}
              className="self-start rounded-full border-[3px] border-black bg-white px-3 py-1"
            >
              <Text className="text-xs font-black text-black">← Volver</Text>
            </TouchableOpacity>

            <Text className="mt-3 text-2xl font-black text-[#1E140D]">Registrar notas por actividad</Text>
            <Text className="mt-1 text-sm font-semibold text-[#5E5045]">
              Califica múltiples estudiantes de una sola actividad en un solo paso.
            </Text>
          </View>
        </View>
      </View>

      <View className="relative flex-1">
        <View className="absolute inset-x-0 bottom-[-4px] h-[5px] rounded-full bg-black/90" />
        <View className="flex-1 overflow-hidden rounded-[34px] border-[4px] border-black bg-[#F7F0E4]">
          <PaperGrid />

          {loadingBase ? (
            <View className="flex-1 items-center justify-center">
              <ActivityIndicator size="large" color="#000" />
            </View>
          ) : (
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{
                paddingHorizontal: 20,
                paddingTop: 16,
                paddingBottom: 140,
              }}
            >
              <View className="self-start rounded-full border-[3px] border-black bg-[#F3E7D5] px-5 py-2">
                <Text className="text-sm font-black text-black">Flujo: Grupo → Actividad → Notas</Text>
              </View>

              <View className="mt-3 rounded-2xl border-[3px] border-black bg-[#FFF7E8] px-4 py-3">
                <Text className="text-xs font-black uppercase tracking-wide text-[#7A6857]">Buscar grupo</Text>
                <TextInput
                  value={filtroGrupo}
                  onChangeText={setFiltroGrupo}
                  placeholder="Ej: Grupo B1"
                  placeholderTextColor="#9F8B78"
                  className="mt-2 rounded-xl border-[3px] border-black bg-white px-3 py-2 text-base font-bold text-black"
                />
              </View>

              {renderChip(
                'Grupo',
                grupoItems,
                selectedGrupoId,
                setSelectedGrupoId,
                'No hay grupos registrados con ese criterio.'
              )}

              {grupoSeleccionado ? (
                <View className="mt-3 rounded-2xl border-[3px] border-black bg-[#FFF7E8] px-4 py-3">
                  <Text className="text-xs font-black uppercase tracking-wide text-[#7A6857]">
                    Contexto del grupo
                  </Text>
                  <Text className="mt-1 text-sm font-bold text-[#5E5045]">
                    Carrera: {carreraSeleccionada?.nombre ?? 'Sin carrera'}
                  </Text>
                  <Text className="mt-1 text-sm font-bold text-[#5E5045]">
                    Año: {anioSeleccionado?.nombre ?? 'Sin año'}
                  </Text>
                  <Text className="mt-1 text-sm font-bold text-[#5E5045]">
                    Asignatura: {asignaturaSeleccionada?.nombre ?? 'Sin asignatura'}
                  </Text>
                </View>
              ) : null}

              {loadingGrupoData ? (
                <Text className="mt-3 text-sm font-semibold text-[#5E5045]">Cargando estudiantes y actividades...</Text>
              ) : (
                renderChip(
                  'Actividad',
                  actividadItems,
                  selectedActividadId,
                  setSelectedActividadId,
                  'Este grupo no tiene actividades disponibles.'
                )
              )}

              {actividadSeleccionada ? (
                <View className="mt-3 rounded-2xl border-[3px] border-black bg-[#FFF7E8] px-4 py-3">
                  <Text className="text-xs font-black uppercase tracking-wide text-[#7A6857]">
                    Actividad seleccionada
                  </Text>
                  <Text className="mt-1 text-base font-black text-black">{actividadSeleccionada.nombre}</Text>
                  <Text className="mt-1 text-sm font-bold text-[#5E5045]">
                    Puntaje máximo: {maxPuntajeActividad}
                  </Text>
                </View>
              ) : null}

              {loadingNotas ? (
                <Text className="mt-4 text-sm font-semibold text-[#5E5045]">Cargando notas...</Text>
              ) : actividadSeleccionada && estudiantesGrupo.length > 0 ? (
                <View className="mt-4">
                  <Text className="text-sm font-black text-[#1E140D]">
                    Estudiantes del grupo ({estudiantesGrupo.length})
                  </Text>

                  <FlatList
                    data={estudiantesGrupo}
                    keyExtractor={(item) => item.id}
                    scrollEnabled={false}
                    contentContainerStyle={{ paddingTop: 10, gap: 10 }}
                    renderItem={({ item }) => (
                      <View className="rounded-2xl border-[3px] border-black bg-[#FFF7E8] px-4 py-3">
                        <Text className="text-sm font-black text-black">{item.nombre_completo}</Text>
                        <TextInput
                          value={inputsByStudentId[item.id] ?? ''}
                          onChangeText={(value) => onChangePuntaje(item.id, value)}
                          keyboardType="decimal-pad"
                          placeholder={`0 a ${maxPuntajeActividad}`}
                          placeholderTextColor="#9F8B78"
                          className="mt-2 rounded-xl border-[3px] border-black bg-white px-3 py-2 text-base font-bold text-black"
                        />
                      </View>
                    )}
                  />

                  <TouchableOpacity
                    accessibilityRole="button"
                    activeOpacity={0.9}
                    disabled={savingNotas}
                    onPress={guardarNotas}
                    className="mt-4 self-start rounded-xl border-[3px] border-black bg-[#BDE9C7] px-5 py-3"
                  >
                    <Text className="text-sm font-black text-black">
                      {savingNotas ? 'Guardando notas...' : 'Guardar notas de la actividad'}
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : actividadSeleccionada ? (
                <Text className="mt-4 text-sm font-semibold text-[#5E5045]">
                  Este grupo no tiene estudiantes matriculados.
                </Text>
              ) : null}
            </ScrollView>
          )}
        </View>
      </View>
    </View>
  );
}
