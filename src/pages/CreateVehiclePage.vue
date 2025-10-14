<template>
  <div class="p-6">
    <h1 class="text-xl mb-4">Создать машину</h1>
    <VehicleForm @save="save" @cancel="cancel" />
  </div>
</template>

<script lang="ts" setup>
import VehicleForm from '@/components/VehicleForm.vue'
import { useRouter } from 'vue-router'
import { useVehiclesStore } from '@/stores/vehicles'
import type { Vehicle } from '@/types/Vehicle'

const router = useRouter()
const store = useVehiclesStore()

function save(payload: Omit<Vehicle, 'id'>) {
  store.create(payload)
  router.push({ name: 'vehicles' })
}

function cancel() {
  router.back()
}
</script>
