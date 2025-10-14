import { createRouter, createWebHistory } from 'vue-router'
import VehiclesPage from '@/pages/VehiclesPage.vue'
import VehicleEditorPage from '@/pages/VehicleEditorPage.vue'
import CreateVehiclePage from '@/pages/CreateVehiclePage.vue'

const routes = [
  { path: '/', name: 'vehicles', component: VehiclesPage },
  { path: '/create', name: 'create', component: CreateVehiclePage },
  { path: '/edit/:id', name: 'edit', component: VehicleEditorPage, props: true },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
