<template>
  <form @submit.prevent="onSubmit" class="space-y-6">
    <!-- Name -->
    <FormField name="name" v-slot="{ componentField }">
      <FormItem>
        <FormLabel>Name</FormLabel>
        <FormControl>
          <Input v-bind="componentField" placeholder="Enter car name" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <!-- Model -->
    <FormField name="model" v-slot="{ componentField }">
      <FormItem>
        <FormLabel>Model</FormLabel>
        <FormControl>
          <Input v-bind="componentField" placeholder="Enter model" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <!-- Year -->
    <FormField name="year" v-slot="{ componentField }">
      <FormItem>
        <FormLabel>Year</FormLabel>
        <FormControl>
          <Input type="number" v-bind="componentField" placeholder="e.g. 2021" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <!-- Color -->
    <FormField name="color" v-slot="{ componentField }">
      <FormItem>
        <FormLabel>Color</FormLabel>
        <FormControl>
          <Input v-bind="componentField" placeholder="e.g. red" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <!-- Price -->
    <FormField name="price" v-slot="{ componentField }">
      <FormItem>
        <FormLabel>Price</FormLabel>
        <FormControl>
          <Input type="number" v-bind="componentField" placeholder="e.g. 25000" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <!-- Latitude -->
    <FormField name="latitude" v-slot="{ componentField }">
      <FormItem>
        <FormLabel>Latitude</FormLabel>
        <FormControl>
          <Input type="number" step="any" v-bind="componentField" placeholder="e.g. 55.753332" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <!-- Longitude -->
    <FormField name="longitude" v-slot="{ componentField }">
      <FormItem>
        <FormLabel>Longitude</FormLabel>
        <FormControl>
          <Input type="number" step="any" v-bind="componentField" placeholder="e.g. 37.621676" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <div class="flex gap-3 pt-2">
      <Button type="submit">Сохранить</Button>
      <Button type="button" variant="ghost" @click="emit('cancel')">Отмена</Button>
    </div>
  </form>
</template>

<script lang="ts" setup>
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import type { Vehicle } from '@/types/Vehicle'
import * as z from 'zod'

interface Props {
  model?: Partial<Vehicle>
}
const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'save', v: Omit<Vehicle, 'id'>): void
  (e: 'cancel'): void
}>()

const formSchema = toTypedSchema(
  z.object({
    name: z.string().min(1, 'Введите название'),
    model: z.string().min(1, 'Введите модель'),
    year: z.number().min(1900).max(new Date().getFullYear()),
    color: z.string().min(1, 'Введите цвет'),
    price: z.number().min(0),
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180),
  }),
)

const { handleSubmit } = useForm({
  validationSchema: formSchema,
  initialValues: {
    name: props.model?.name ?? '',
    model: props.model?.model ?? '',
    year: props.model?.year ?? new Date().getFullYear(),
    color: props.model?.color ?? '',
    price: props.model?.price ?? 0,
    latitude: props.model?.latitude ?? 0,
    longitude: props.model?.longitude ?? 0,
  },
})

const onSubmit = handleSubmit((values) => {
  emit('save', { ...values })
})
</script>

<style lang="postcss" scoped>
</style>
