import { ServiceResult, notImplemented } from './_result';

export type Anio = {
  id: string;
  carrera_id: string;
  nombre: string;
  created_at: string;
};

export type CreateAnioInput = {
  carrera_id: string;
  nombre: string;
};

export type UpdateAnioInput = {
  nombre?: string;
};

export async function listAnios(): Promise<ServiceResult<Anio[]>> {
  return notImplemented('anios.listAnios');
}

export async function getAnioById(_id: string): Promise<ServiceResult<Anio | null>> {
  return notImplemented('anios.getAnioById');
}

export async function createAnio(_input: CreateAnioInput): Promise<ServiceResult<Anio>> {
  return notImplemented('anios.createAnio');
}

export async function updateAnio(
  _id: string,
  _input: UpdateAnioInput
): Promise<ServiceResult<Anio>> {
  return notImplemented('anios.updateAnio');
}

export async function deleteAnio(_id: string): Promise<ServiceResult<{ id: string }>> {
  return notImplemented('anios.deleteAnio');
}
