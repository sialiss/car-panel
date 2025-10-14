import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Vehicle } from '@/types/Vehicle'
import { fetchVehicles } from '@/api/api'

export const useVehiclesStore = defineStore('vehicles', () => {
  const items = ref<Vehicle[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function load() {
    loading.value = true
    error.value = null
    try {
      // сначала попробуем загрузить из localStorage (если есть), иначе с API
      const local = localStorage.getItem('vehicles_cache')
      if (local) {
        items.value = JSON.parse(local) as Vehicle[]
      } else {
        const data = await fetchVehicles()
        items.value = data
        localStorage.setItem('vehicles_cache', JSON.stringify(data))
      }
    } catch (e: unknown) {
      if (e instanceof Error) {
        error.value = e.message
      } else {
        error.value = 'Неизвестная ошибка'
      }
    } finally {
      loading.value = false
    }
  }

  function saveToLocal() {
    localStorage.setItem('vehicles_cache', JSON.stringify(items.value))
  }

  function create(v: Omit<Vehicle, 'id'>) {
    // генерируем id клиент-side
    const id = items.value.length ? Math.max(...items.value.map((x) => x.id)) + 1 : 1
    const newV: Vehicle = { id, ...v }
    items.value.unshift(newV)
    saveToLocal()
    return newV
  }

  function update(id: number, patch: Partial<Vehicle>) {
    const idx = items.value.findIndex((x) => x.id === id)
    if (idx === -1) return false

    items.value[idx] = { ...items.value[idx], ...patch } as Vehicle
    saveToLocal()
    return true
  }

  function remove(id: number) {
    items.value = items.value.filter((x) => x.id !== id)
    saveToLocal()
  }

  // сортировка: по year и price
  const sortKey = ref<'year' | 'price' | null>(null)
  const sortOrder = ref<'asc' | 'desc'>('asc')

  function setSort(key: 'year' | 'price' | null, order: 'asc' | 'desc' = 'asc') {
    sortKey.value = key
    sortOrder.value = order
  }

  const sorted = computed(() => {
    if (!sortKey.value) return items.value
    return [...items.value].sort((a, b) => {
      const av = a[sortKey.value!] as number
      const bv = b[sortKey.value!] as number
      if (av === bv) return 0
      return sortOrder.value === 'asc' ? av - bv : bv - av
    })
  })

  return {
    items,
    loading,
    error,
    load,
    create,
    update,
    remove,
    sorted,
    setSort,
    sortKey,
    sortOrder,
    saveToLocal,
  }
})
