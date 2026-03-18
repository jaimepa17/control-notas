import { ServiceResult, notImplemented } from './_result';

export type Parcial = {
  id: string;
  grupo_id: string;
  nombre: string;
  peso_porcentaje: number;
  created_at: string;
};

export type CreateParcialInput = {
  grupo_id: string;
  nombre: string;
  peso_porcentaje?: number;
};

export type UpdateParcialInput = {
  nombre?: string;
  peso_porcentaje?: number;
};

export async function listParciales(): Promise<ServiceResult<Parcial[]>> {
  return notImplemented('parciales.listParciales');
}

export async function getParcialById(_id: string): Promise<ServiceResult<Parcial | null>> {
  return notImplemented('parciales.getParcialById');
}

export async function createParcial(
  _input: CreateParcialInput
): Promise<ServiceResult<Parcial>> {
  return notImplemented('parciales.createParcial');
}

export async function updateParcial(
  _id: string,
  _input: UpdateParcialInput
): Promise<ServiceResult<Parcial>> {
  return notImplemented('parciales.updateParcial');
}

export async function deleteParcial(_id: string): Promise<ServiceResult<{ id: string }>> {
  return notImplemented('parciales.deleteParcial');
}
