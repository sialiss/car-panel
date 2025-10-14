<template>
  <div class="p-6">
    <h1 class="text-xl mb-4">Редактировать машину</h1>
    <VehicleForm v-if="vehicle" :model="vehicle" @save="save" @cancel="cancel" />
    <div v-else>Не найдено</div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import VehicleForm from '@/components/VehicleForm.vue'
import { useVehiclesStore } from '@/stores/vehicles'
import type { Vehicle } from '@/types/Vehicle'

const route = useRoute()
const router = useRouter()
const store = useVehiclesStore()

onMounted(() => {
  if (!store.items.length) store.load()
})

const id = Number(route.params.id)
const vehicle = computed(() => store.items.find((v) => v.id === id))

function save(payload: Partial<Vehicle>) {
  store.update(id, payload)
  router.push({ name: 'vehicles' })
}
function cancel() {
  router.back()
}
</script>
