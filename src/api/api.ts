import type { Vehicle } from '@/types/Vehicle'

const BASE = 'https://ofc-test-01.tspb.su/test-task'

// получение всех машин
export async function fetchVehicles(): Promise<Vehicle[]> {
  const res = await fetch(`${BASE}/vehicles`)
  if (!res.ok) throw new Error('Ошибка загрузки машин')
  return (await res.json()) as Vehicle[]
}