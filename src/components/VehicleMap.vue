<template>
  <div id="map" class="h-72 rounded border"></div>
</template>

<script lang="ts" setup>
import { onMounted, watch } from 'vue'
import type { Vehicle } from '@/types/Vehicle'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import iconUrl from 'leaflet/dist/images/marker-icon.png'
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png'
import shadowUrl from 'leaflet/dist/images/marker-shadow.png'
// delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
})

const props = defineProps<{ vehicles: Vehicle[] }>()

let map: L.Map | null = null
let markers: L.Marker[] = []

onMounted(() => {
  map = L.map('map').setView([55.753332, 37.621676], 5)
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap',
  }).addTo(map)
  updateMarkers()
})

watch(
  () => props.vehicles,
  () => {
    updateMarkers()
  },
  { deep: true },
)

function updateMarkers() {
  if (!map) return
  markers.forEach((m) => m.remove())
  markers = []
  props.vehicles.forEach((v) => {
    if (v.latitude == null || v.longitude == null) return
    const m = L.marker([v.latitude, v.longitude])
      .addTo(map!)
      .bindPopup(`<b>${v.name} ${v.model}</b><br/>${v.year} — $${v.price}`)
    markers.push(m)
  })
  // если есть маркеры — центрируем карту по ним
  if (markers.length) {
    const group = L.featureGroup(markers)
    map.fitBounds(group.getBounds(), { padding: [50, 50] })
  }
}
</script>

<style scoped>
#map {
  width: 100%;
}
</style>
