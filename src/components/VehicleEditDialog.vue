<template>
  <Dialog v-model:open="open">
    <DialogTrigger as-child>
      <Button variant="ghost">Редактировать</Button>
    </DialogTrigger>

    <DialogContent class="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Редактировать {{ vehicle.name }} {{ vehicle.model }}</DialogTitle>
        <DialogDescription> Внесите изменения и нажмите «Сохранить». </DialogDescription>
      </DialogHeader>

      <form id="editForm" @submit.prevent="onSubmit" class="grid gap-3 mb-3">
        <FormField v-slot="{ componentField }" name="name">
          <FormItem>
            <FormLabel>Марка</FormLabel>
            <FormControl>
              <Input type="text" v-bind="componentField" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="price">
          <FormItem>
            <FormLabel>Цена</FormLabel>
            <FormControl>
              <Input type="number" v-bind="componentField" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
      </form>

      <DialogFooter>
        <DialogClose as-child>
          <Button variant="ghost">Отмена</Button>
        </DialogClose>
        <Button type="submit" form="editForm">Сохранить</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { toast } from 'vue-sonner'
import * as z from 'zod'
import { useVehiclesStore } from '@/stores/vehicles'
import type { Vehicle } from '@/types/Vehicle'
import { computed, ref, watch } from 'vue'

const open = ref(false)
const props = defineProps<{ vehicleId: number }>()
const store = useVehiclesStore()
const vehicle = computed(() => 
  store.items.find(v => v.id === props.vehicleId)!
)

// схема формы
const formSchema = toTypedSchema(
  z.object({
    name: z.string().min(1, 'Минимум 1 символ'),
    price: z.coerce.number().min(0, 'Цена не может быть отрицательной'),
  }),
)

// начальные значения
const { handleSubmit, resetForm } = useForm({
  validationSchema: formSchema,
  initialValues: {
    name: vehicle.value.name,
    price: vehicle.value.price,
  },
})

watch(
  () => open.value,
  (isOpen) => {
    if (isOpen) {
      resetForm({
        values: {
          name: vehicle.value.name,
          price: vehicle.value.price,
        },
      })
    }
  },
)

const onSubmit = handleSubmit((values: Partial<Vehicle>) => {
  store.update(props.vehicleId, values)
  toast('Изменения сохранены.', {
    description: `${values.name} ${vehicle.value.model} обновлена.`,
  })
  open.value = false
})
</script>
