<template>
  <div class="p-6 space-y-6">
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-2xl font-semibold">Список машин</h1>
      <Button as-child>
        <router-link to="/create">Добавить машину</router-link>
      </Button>
    </div>

    <div>
      <h2 class="text-xl mb-3">Карта расположения</h2>
      <VehicleMap :vehicles="mapVehicles" />
    </div>

    <div class="flex gap-4 items-center">
      <div class="flex items-center gap-1">
        <label>Сортировать:</label>
        <Select v-model="localSort" class="ml-2 p-1">
          <SelectTrigger>
            <SelectValue value="" placeholder="Без сортировки" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="year:asc"> Year ↑ </SelectItem>
              <SelectItem value="year:desc"> Year ↓ </SelectItem>
              <SelectItem value="price:asc"> Price ↑ </SelectItem>
              <SelectItem value="price:desc"> Price ↓ </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <Button @click="reload">Обновить</Button>
      <div class="flex-1 flex justify-end space-x-2 items-center">
        <Checkbox v-model="showAllOnMap" />
        <label
          class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Отобразить все машины на карте
        </label>
      </div>
    </div>

    <div v-if="store.loading" class="text-gray-600">Загрузка...</div>
    <div v-else-if="store.error" class="text-red-500">{{ store.error }}</div>
    <div v-else-if="store.paginated.length === 0">Нет машин</div>
    <!-- пагинация -->
    <Pagination :items-per-page="7" :total="store.sorted.length" v-model:default-page="store.page">
      <PaginationContent v-slot="{ items }">
        <PaginationPrevious @click="store.page--" />

        <template v-for="(item, index) in items" :key="index">
          <PaginationItem
            v-if="item.type === 'page'"
            :value="item.value"
            :is-active="item.value === store.page"
            @click="store.page = item.value"
          >
            {{ item.value }}
          </PaginationItem>
        </template>

        <!-- <PaginationEllipsis :index="4" /> -->

        <PaginationNext @click="store.page++" />
      </PaginationContent>
    </Pagination>
    <!-- список машин -->
    <ul class="space-y-3">
      <li
        v-for="v in store.paginated"
        :key="v.id"
        class="p-4 border rounded flex justify-between items-center"
      >
        <div>
          <div class="font-medium">{{ v.name }} {{ v.model }}</div>
          <div class="text-sm text-gray-600">Year: {{ v.year }} • Price: ${{ v.price }}</div>
        </div>
        <div class="flex gap-2">
          <Button as-child variant="ghost">
            <router-link :to="{ name: 'edit', params: { id: v.id } }">Редактировать</router-link>
          </Button>

          <AlertDialog>
            <AlertDialogTrigger as-child>
              <Button variant="destructive">Удалить</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Удалить {{ v.name }} {{ v.model }}?</AlertDialogTitle>
                <AlertDialogDescription>
                  Это действие нельзя отменить. Машина будет безвозвратно удалена.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel as-child>
                  <Button variant="secondary">Отмена</Button>
                </AlertDialogCancel>
                <AlertDialogAction @click="removeVehicle(v.id)">Удалить</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useVehiclesStore } from '@/stores/vehicles'
import VehicleMap from '@/components/VehicleMap.vue'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { Checkbox } from '@/components/ui/checkbox'
import { computed } from 'vue'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const store = useVehiclesStore()
onMounted(() => store.load())

const showAllOnMap = ref(false)
// массив для карты
const mapVehicles = computed(() => {
  return showAllOnMap.value ? store.items : store.paginated
})

const localSort = ref('')

watch(localSort, (newVal) => {
  if (!newVal) {
    store.setSort(null)
  } else {
    const [key, order] = newVal.split(':') as ['year' | 'price', 'asc' | 'desc']
    store.setSort(key, order)
  }
  store.page = 1
})

function removeVehicle(id: number) {
  store.remove(id)
}

function reload() {
  localStorage.removeItem('vehicles_cache')
  store.load()
}
</script>
