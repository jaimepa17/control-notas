import { ServiceResult, notImplemented } from './_result';

export type Asignatura = {
  id: string;
  anio_id: string;
  nombre: string;
  created_at: string;
};

export type CreateAsignaturaInput = {
  anio_id: string;
  nombre: string;
};

export type UpdateAsignaturaInput = {
  nombre?: string;
};

export async function listAsignaturas(): Promise<ServiceResult<Asignatura[]>> {
  return notImplemented('asignaturas.listAsignaturas');
}

export async function getAsignaturaById(
  _id: string
): Promise<ServiceResult<Asignatura | null>> {
  return notImplemented('asignaturas.getAsignaturaById');
}

export async function createAsignatura(
  _input: CreateAsignaturaInput
): Promise<ServiceResult<Asignatura>> {
  return notImplemented('asignaturas.createAsignatura');
}

export async function updateAsignatura(
  _id: string,
  _input: UpdateAsignaturaInput
): Promise<ServiceResult<Asignatura>> {
  return notImplemented('asignaturas.updateAsignatura');
}

export async function deleteAsignatura(
  _id: string
): Promise<ServiceResult<{ id: string }>> {
  return notImplemented('asignaturas.deleteAsignatura');
}
