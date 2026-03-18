import { ServiceResult, notImplemented } from './_result';

export type Estudiante = {
  id: string;
  profesor_id: string;
  nombre_completo: string;
  identificacion?: string | null;
  created_at: string;
};

export type CreateEstudianteInput = {
  nombre_completo: string;
  identificacion?: string | null;
};

export type UpdateEstudianteInput = {
  nombre_completo?: string;
  identificacion?: string | null;
};

export async function listEstudiantes(): Promise<ServiceResult<Estudiante[]>> {
  return notImplemented('estudiantes.listEstudiantes');
}

export async function getEstudianteById(
  _id: string
): Promise<ServiceResult<Estudiante | null>> {
  return notImplemented('estudiantes.getEstudianteById');
}

export async function createEstudiante(
  _input: CreateEstudianteInput
): Promise<ServiceResult<Estudiante>> {
  return notImplemented('estudiantes.createEstudiante');
}

export async function updateEstudiante(
  _id: string,
  _input: UpdateEstudianteInput
): Promise<ServiceResult<Estudiante>> {
  return notImplemented('estudiantes.updateEstudiante');
}

export async function deleteEstudiante(
  _id: string
): Promise<ServiceResult<{ id: string }>> {
  return notImplemented('estudiantes.deleteEstudiante');
}
