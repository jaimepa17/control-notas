import { ServiceResult, notImplemented } from './_result';

export type Grupo = {
  id: string;
  asignatura_id: string;
  nombre: string;
  turno?: string | null;
  created_at: string;
};

export type CreateGrupoInput = {
  asignatura_id: string;
  nombre: string;
  turno?: string | null;
};

export type UpdateGrupoInput = {
  nombre?: string;
  turno?: string | null;
};

export async function listGrupos(): Promise<ServiceResult<Grupo[]>> {
  return notImplemented('grupos.listGrupos');
}

export async function getGrupoById(_id: string): Promise<ServiceResult<Grupo | null>> {
  return notImplemented('grupos.getGrupoById');
}

export async function createGrupo(_input: CreateGrupoInput): Promise<ServiceResult<Grupo>> {
  return notImplemented('grupos.createGrupo');
}

export async function updateGrupo(
  _id: string,
  _input: UpdateGrupoInput
): Promise<ServiceResult<Grupo>> {
  return notImplemented('grupos.updateGrupo');
}

export async function deleteGrupo(_id: string): Promise<ServiceResult<{ id: string }>> {
  return notImplemented('grupos.deleteGrupo');
}
