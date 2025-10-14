<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-2xl font-semibold">Список машин</h1>
      <div>
        <router-link to="/create" class="btn">Добавить машину</router-link>
      </div>
    </div>

    <div class="mb-8">
      <h2 class="text-xl mb-3">Карта расположения</h2>
      <VehicleMap :vehicles="store.items" />
    </div>

    <div class="flex gap-4 m-4">
      <div>
        <label>Сортировать:</label>
        <select v-model="localSort" @change="applySort" class="ml-2 p-1 border rounded">
          <option value="">Без сортировки</option>
          <option value="year:asc">Year ↑</option>
          <option value="year:desc">Year ↓</option>
          <option value="price:asc">Price ↑</option>
          <option value="price:desc">Price ↓</option>
        </select>
      </div>
      <div>
        <button @click="reload" class="ml-2 p-1 border rounded">Обновить</button>
      </div>
    </div>

    <div v-if="store.loading">Загрузка...</div>
    <div v-if="store.error" class="text-red-500">{{ store.error }}</div>

    <div v-if="store.sorted.length === 0 && !store.loading">Нет машин</div>

    <ul class="space-y-3">
      <li
        v-for="v in store.sorted"
        :key="v.id"
        class="p-4 border rounded flex justify-between items-center"
      >
        <div>
          <div class="font-medium">{{ v.name }} {{ v.model }}</div>
          <div class="text-sm text-gray-600">Year: {{ v.year }} • Price: ${{ v.price }}</div>
        </div>
        <div class="flex gap-2">
          <router-link :to="{ name: 'edit', params: { id: v.id } }" class="btn"
            >Редактировать</router-link
          >
          <button @click="del(v.id)" class="btn-ghost">Удалить</button>
        </div>
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useVehiclesStore } from '@/stores/vehicles'
import VehicleMap from '@/components/VehicleMap.vue'

const store = useVehiclesStore()
onMounted(() => store.load())

const localSort = ref('')
function applySort() {
  if (!localSort.value) {
    store.setSort(null)
    return
  }
  const [k, o] = localSort.value.split(':') as ['year' | 'price', 'asc' | 'desc']
  store.setSort(k, o)
}

function del(id: number) {
  if (!confirm('Удалить машину?')) return
  store.remove(id)
}

function reload() {
  // очищаем кэш localStorage и заново грузим
  localStorage.removeItem('vehicles_cache')
  store.load()
}
</script>

<style lang="postcss" scoped>
@layer components {
  .btn {
    @apply px-3 py-2 bg-blue-500 text-white rounded;
  }
  .btn-ghost {
    @apply px-3 py-1 border rounded bg-white text-red-600;
  }
}
</style>
