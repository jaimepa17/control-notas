import { ServiceResult, notImplemented } from './_result';

export type Nota = {
  id: string;
  actividad_id: string;
  estudiante_id: string;
  puntaje_obtenido: number;
  observaciones?: string | null;
  created_at: string;
};

export type CreateNotaInput = {
  actividad_id: string;
  estudiante_id: string;
  puntaje_obtenido: number;
  observaciones?: string | null;
};

export type UpdateNotaInput = {
  puntaje_obtenido?: number;
  observaciones?: string | null;
};

export async function listNotas(): Promise<ServiceResult<Nota[]>> {
  return notImplemented('notas.listNotas');
}

export async function getNotaById(_id: string): Promise<ServiceResult<Nota | null>> {
  return notImplemented('notas.getNotaById');
}

export async function createNota(_input: CreateNotaInput): Promise<ServiceResult<Nota>> {
  return notImplemented('notas.createNota');
}

export async function updateNota(
  _id: string,
  _input: UpdateNotaInput
): Promise<ServiceResult<Nota>> {
  return notImplemented('notas.updateNota');
}

export async function deleteNota(_id: string): Promise<ServiceResult<{ id: string }>> {
  return notImplemented('notas.deleteNota');
}
