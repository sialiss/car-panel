import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Vehicle } from '@/types/Vehicle'
import { fetchVehicles } from '@/api/api'

export const useVehiclesStore = defineStore('vehicles', () => {
  const items = ref<Vehicle[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const page = ref(1)
  const pageSize = ref(4)

  let sortkey: {
    key: 'year' | 'price' | null
    order: 'asc' | 'desc'
  } = {
    key: null,
    order: 'asc',
  }

  const sorted = ref<Vehicle[]>([])
  const paginated = computed(() => {
    const start = (page.value - 1) * pageSize.value
    return sorted.value.slice(start, start + pageSize.value)
  })

  async function load() {
    loading.value = true
    error.value = null
    try {
      const local = localStorage.getItem('vehicles_cache')
      if (local) {
        items.value = JSON.parse(local) as Vehicle[]
      } else {
        const data = await fetchVehicles()
        items.value = data
        localStorage.setItem('vehicles_cache', JSON.stringify(data))
      }
      sorted.value = [...items.value]
      setSort(sortkey.key, sortkey.order)
    } catch (e) {
      error.value = e instanceof Error ? e.message : String(e)
    } finally {
      loading.value = false
    }
  }

  function saveToLocal() {
    localStorage.setItem('vehicles_cache', JSON.stringify(items.value))
  }

  function create(v: Omit<Vehicle, 'id'>) {
    // генерируем id
    const id = items.value.length ? Math.max(...items.value.map((x) => x.id)) + 1 : 1
    const newV: Vehicle = { id, ...v }
    items.value.unshift(newV)
    saveToLocal()
    return newV
  }

  function update(id: number, data: Partial<Vehicle>) {
    const idx = items.value.findIndex((x) => x.id === id)
    if (idx === -1) return false

    items.value[idx] = { ...items.value[idx], ...data } as Vehicle
    sorted.value = [...items.value]
    setSort(sortkey.key, sortkey.order)
    saveToLocal()
    return true
  }

  // сортировка: по year и price
  function setSort(key: 'year' | 'price' | null, order: 'asc' | 'desc' = 'asc') {
    if (!key) {
      sorted.value = [...items.value]
      return
    }
    sortkey = { key, order }
    sorted.value = [...items.value].sort((a, b) =>
      order === 'asc' ? a[key] - b[key] : b[key] - a[key],
    )
    console.log(sorted.value)
  }

  function remove(id: number) {
    items.value = items.value.filter((v) => v.id !== id)
    sorted.value = sorted.value.filter((v) => v.id !== id)
    localStorage.setItem('vehicles_cache', JSON.stringify(items.value))
  }

  return {
    items,
    sorted,
    paginated,
    page,
    pageSize,
    load,
    create,
    update,
    remove,
    setSort,
    loading,
    error,
  }
})
