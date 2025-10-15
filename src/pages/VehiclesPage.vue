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

    <div class="flex gap-4 items-center flex-col sm:flex-row">
      <Button @click="reload">Сбросить все изменения</Button>
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
      <div class="flex-1 flex justify-end space-x-2 items-center">
        <Checkbox v-model="showAllOnMap" />
        <label
          class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Показать все машины на карте
        </label>
      </div>
    </div>

    <div v-if="store.loading" class="text-gray-600">Загрузка...</div>
    <div v-else-if="store.error" class="text-red-500">{{ store.error }}</div>
    <div v-else-if="store.paginated.length === 0">Нет машин</div>
    <!-- пагинация -->
    <Pagination :items-per-page="4" :total="store.sorted.length" v-model:default-page="store.page">
      <PaginationContent class="relative w-full flex justify-center">
        <div
          class="absolute left-[10%] md:left-[18%] lg:left-[25%] xl:left-[30%] 2xl:left-[35%] flex gap-2"
        >
          <PaginationPrevious @click="store.page--" :disabled="store.page <= 1" />
        </div>

        <div class="flex gap-1 pr-4%">
          <PaginationItem :value="1" :is-active="store.page === 1" @click="store.page = 1">
            1
          </PaginationItem>

          <PaginationEllipsis v-if="store.page > 3" />

          <template v-for="p in pagesToShow" :key="p">
            <PaginationItem
              v-if="p !== 1 && p !== totalPages"
              :value="p"
              :is-active="store.page === p"
              @click="store.page = p"
            >
              {{ p }}
            </PaginationItem>
          </template>

          <PaginationEllipsis v-if="store.page < totalPages - 2" />

          <PaginationItem
            v-if="totalPages > 1"
            :value="totalPages"
            :is-active="store.page === totalPages"
            @click="store.page = totalPages"
          >
            {{ totalPages }}
          </PaginationItem>
        </div>
        <div
          class="absolute right-[10%] md:right-[18%] lg:right-[25%] xl:right-[30%] 2xl:right-[35%] flex gap-2"
        >
          <PaginationNext @click="store.page++" :disabled="store.page >= totalPages" />
        </div>
      </PaginationContent>
    </Pagination>
    <!-- список машин -->
    <ul ref="listRef" class="space-y-3" :style="{ minHeight: listMinHeight + 'px' }">
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
          <VehicleEditDialog :vehicle-id="v.id" />

          <AlertDialog>
            <AlertDialogTrigger as-child>
              <Button variant="default">Удалить</Button>
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
import { ref, onMounted, watch, nextTick } from 'vue'
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
  PaginationEllipsis,
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
import VehicleEditDialog from '@/components/VehicleEditDialog.vue'
import { toast } from 'vue-sonner'

const store = useVehiclesStore()
onMounted(() => store.load())

const showAllOnMap = ref(false)

// массив для карты
const mapVehicles = computed(() => {
  return showAllOnMap.value ? store.items : store.paginated
})

const localSort = ref('')
const editData = ref<Record<number, { name: string; price: number }>>({})

watch(localSort, (newVal) => {
  if (!newVal) {
    store.setSort(null)
    store.page = 1
  } else {
    sortItems(newVal)
  }
})

function sortItems(type: string) {
  const [key, order] = type.split(':') as ['year' | 'price', 'asc' | 'desc']
  store.setSort(key, order)
  store.page = 1
}

function removeVehicle(id: number) {
  store.remove(id)
  toast('Изменения сохранены.', {
    description: `Машина удалена.`,
  })
}

async function reload() {
  localStorage.removeItem('vehicles_cache')
  await store.load()
  store.page = 1
}

watch(
  () => store.items,
  (items) => {
    // создаём локальные копии данных
    editData.value = Object.fromEntries(items.map((v) => [v.id, { name: v.name, price: v.price }]))
  },
  { immediate: true },
)

// для пагинации
const totalPages = computed(() => Math.ceil(store.sorted.length / store.pageSize))
const pagesToShow = computed(() => {
  const current = store.page
  const total = totalPages.value
  const pages: number[] = []

  // текущая, предыдущая и следующая
  if (current > 1) pages.push(current - 1)
  pages.push(current)
  if (current < total) pages.push(current + 1)

  return pages.filter((p) => p > 1 && p < total)
})

// для того, чтобы на после переключения на последнюю страницу не поднимался скролл
const listRef = ref<HTMLElement | null>(null)
const listMinHeight = ref(0)

onMounted(async () => {
  await nextTick()
  if (listRef.value) {
    listMinHeight.value = listRef.value.offsetHeight
  }
})
</script>

<style lang="postcss" scoped></style>
