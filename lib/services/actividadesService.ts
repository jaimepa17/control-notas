import { ServiceResult, notImplemented } from './_result';

export type Actividad = {
  id: string;
  parcial_id: string;
  nombre: string;
  tipo: 'corte' | 'examen';
  peso_porcentaje: number;
  fecha_asignada?: string | null;
  created_at: string;
};

export type CreateActividadInput = {
  parcial_id: string;
  nombre: string;
  tipo: 'corte' | 'examen';
  peso_porcentaje: number;
  fecha_asignada?: string | null;
};

export type UpdateActividadInput = {
  nombre?: string;
  tipo?: 'corte' | 'examen';
  peso_porcentaje?: number;
  fecha_asignada?: string | null;
};

export async function listActividades(): Promise<ServiceResult<Actividad[]>> {
  return notImplemented('actividades.listActividades');
}

export async function getActividadById(
  _id: string
): Promise<ServiceResult<Actividad | null>> {
  return notImplemented('actividades.getActividadById');
}

export async function createActividad(
  _input: CreateActividadInput
): Promise<ServiceResult<Actividad>> {
  return notImplemented('actividades.createActividad');
}

export async function updateActividad(
  _id: string,
  _input: UpdateActividadInput
): Promise<ServiceResult<Actividad>> {
  return notImplemented('actividades.updateActividad');
}

export async function deleteActividad(
  _id: string
): Promise<ServiceResult<{ id: string }>> {
  return notImplemented('actividades.deleteActividad');
}
