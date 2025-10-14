<template>
  <form @submit.prevent="onSubmit" class="space-y-4">
    <div>
      <label class="block text-sm">Name</label>
      <input v-model="form.name" required class="input" />
    </div>
    <div>
      <label class="block text-sm">Model</label>
      <input v-model="form.model" required class="input" />
    </div>
    <div>
      <label class="block text-sm">Year</label>
      <input v-model.number="form.year" type="number" required class="input" />
    </div>
    <div>
      <label class="block text-sm">Color</label>
      <input v-model="form.color" class="input" />
    </div>
    <div>
      <label class="block text-sm">Price</label>
      <input v-model.number="form.price" type="number" required class="input" />
    </div>
    <div>
      <label class="block text-sm">Latitude</label>
      <input v-model.number="form.latitude" type="number" required class="input" />
    </div>
    <div>
      <label class="block text-sm">Longitude</label>
      <input v-model.number="form.longitude" type="number" required class="input" />
    </div>
    <div class="flex gap-2">
      <button type="submit" class="btn">Сохранить</button>
      <button type="button" @click="$emit('cancel')" class="btn-ghost">Отмена</button>
    </div>
  </form>
</template>

<script lang="ts" setup>
import { reactive } from 'vue'
import type { Vehicle } from '@/types/Vehicle'

interface Props {
  model?: Partial<Vehicle>
}
const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'save', v: Omit<Vehicle, 'id'>): void
  (e: 'cancel'): void
}>()

const form = reactive({
  name: props.model?.name ?? '',
  model: props.model?.model ?? '',
  year: props.model?.year ?? new Date().getFullYear(),
  color: props.model?.color ?? '',
  price: props.model?.price ?? 0,
  latitude: props.model?.latitude ?? 0,
  longitude: props.model?.longitude ?? 0,
})

function onSubmit() {
  emit('save', { ...form })
}
</script>

<style lang="postcss" scoped>
@layer components {
  .input {
    @apply border rounded px-2 py-1 w-full;
  }
  .btn {
    @apply px-3 py-1 border rounded bg-slate-100 hover:bg-slate-200;
  }
  .btn-ghost {
    @apply px-3 py-1 border rounded bg-white text-red-600;
  }
}
</style>
