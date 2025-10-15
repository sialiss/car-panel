<template>
  <form @submit.prevent="onSubmit" class="space-y-6">
    <!-- Name -->
    <FormField name="name" v-slot="{ componentField }">
      <FormItem>
        <FormLabel>Марка</FormLabel>
        <FormControl>
          <Input v-bind="componentField" placeholder="Введите марку машины" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <!-- Model -->
    <FormField name="model" v-slot="{ componentField }">
      <FormItem>
        <FormLabel>Модель</FormLabel>
        <FormControl>
          <Input v-bind="componentField" placeholder="Введите модель" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <!-- Year -->
    <FormField name="year" v-slot="{ componentField }">
      <FormItem>
        <FormLabel>Год</FormLabel>
        <FormControl>
          <Input type="number" v-bind="componentField" placeholder="напр. 2021" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <!-- Color -->
    <FormField name="color" v-slot="{ componentField }">
      <FormItem>
        <FormLabel>Цвет</FormLabel>
        <FormControl>
          <Input v-bind="componentField" placeholder="напр. красный" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <!-- Price -->
    <FormField name="price" v-slot="{ componentField }">
      <FormItem>
        <FormLabel>Цена</FormLabel>
        <FormControl>
          <Input type="number" v-bind="componentField" placeholder="напр. 25000" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <!-- Latitude -->
    <!-- <FormField name="latitude" v-slot="{ componentField }">
      <FormItem>
        <FormLabel>Широта</FormLabel>
        <FormControl>
          <Input type="number" step="any" v-bind="componentField" placeholder="напр. 55.753332" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField> -->

    <!-- Longitude -->
    <!-- <FormField name="longitude" v-slot="{ componentField }">
      <FormItem>
        <FormLabel>Долгота</FormLabel>
        <FormControl>
          <Input type="number" step="any" v-bind="componentField" placeholder="напр. 37.621676" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField> -->

    <div class="flex gap-3 pt-2">
      <Button type="submit">Сохранить</Button>
      <Button type="button" variant="ghost" @click="emit('cancel')">Отмена</Button>
    </div>
  </form>
</template>

<script lang="ts" setup>
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
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
    year: z
      .number()
      .min(1900, 'Год не может быть меньше 1900')
      .max(new Date().getFullYear(), 'Год не может быть больше текущего'),
    color: z.string().min(1, 'Введите цвет'),
    price: z.number().min(0, 'Цена не должна быть отрицательной'),
    // latitude: z.number().min(-90).max(90),
    // longitude: z.number().min(-180).max(180),
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
    // latitude: props.model?.latitude ?? 0,
    // longitude: props.model?.longitude ?? 0,
  },
})

const onSubmit = handleSubmit((values) => {
  emit('save', { ...values })
})
</script>

<style lang="postcss" scoped></style>
