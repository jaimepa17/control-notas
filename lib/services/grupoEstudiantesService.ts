import { ServiceResult, notImplemented } from './_result';

export type GrupoEstudiante = {
  grupo_id: string;
  estudiante_id: string;
};

export type CreateGrupoEstudianteInput = GrupoEstudiante;

export async function listGrupoEstudiantes(): Promise<ServiceResult<GrupoEstudiante[]>> {
  return notImplemented('grupo_estudiantes.listGrupoEstudiantes');
}

export async function createGrupoEstudiante(
  _input: CreateGrupoEstudianteInput
): Promise<ServiceResult<GrupoEstudiante>> {
  return notImplemented('grupo_estudiantes.createGrupoEstudiante');
}

export async function deleteGrupoEstudiante(
  _grupoId: string,
  _estudianteId: string
): Promise<ServiceResult<{ grupo_id: string; estudiante_id: string }>> {
  return notImplemented('grupo_estudiantes.deleteGrupoEstudiante');
}
