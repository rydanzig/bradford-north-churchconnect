<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import {
  Chart,
  PieController,
  ArcElement,
  Legend,
  Tooltip,
  type ChartConfiguration,
  type ActiveElement,
} from 'chart.js'
import type { ChartEvent } from 'chart.js'

Chart.register(PieController, ArcElement, Legend, Tooltip)

const props = withDefaults(
  defineProps<{
    labels: string[]
    data: number[]
    colors?: string[]
    emptyMessage?: string
  }>(),
  {
    colors: () => [],
    emptyMessage: 'No data available',
  },
)

const emit = defineEmits<{
  sliceClick: [{ index: number; label: string }]
}>()

const canvasRef = ref<HTMLCanvasElement | null>(null)
let chart: Chart<'pie'> | null = null

const defaultPalette = [
  '#7c6b9a',
  '#8b7ab5',
  '#9a86b8',
  '#6f8f7a',
  '#a8899c',
  '#2a2340',
  '#6b7d9a',
  '#b7acc9',
]

function hasData() {
  return props.data.some((value) => value > 0)
}

function handleClick(_event: ChartEvent, elements: ActiveElement[]) {
  if (!elements.length) return

  const index = elements[0].index
  const label = props.labels[index]
  if (!label || !props.data[index]) return

  emit('sliceClick', { index, label })
}

function renderChart() {
  chart?.destroy()
  chart = null

  if (!canvasRef.value || !hasData()) return

  const backgroundColor =
    props.colors.length > 0
      ? props.colors
      : props.labels.map((_, index) => defaultPalette[index % defaultPalette.length])

  const config: ChartConfiguration<'pie'> = {
    type: 'pie',
    data: {
      labels: props.labels,
      datasets: [
        {
          data: props.data,
          backgroundColor,
          borderWidth: 2,
          borderColor: '#ffffff',
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      onClick: handleClick,
      onHover: (event, elements) => {
        const target = event.native?.target as HTMLElement | undefined
        if (target) {
          target.style.cursor = elements.length ? 'pointer' : 'default'
        }
      },
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            boxWidth: 12,
            padding: 14,
            font: {
              family: "'Manrope', sans-serif",
              size: 12,
            },
          },
        },
        tooltip: {
          callbacks: {
            label(context) {
              const value = Number(context.parsed) || 0
              const total = props.data.reduce((sum, item) => sum + item, 0)
              const percent = total > 0 ? ((value / total) * 100).toFixed(1) : '0.0'
              return `${context.label}: ${value} (${percent}%)`
            },
            afterBody() {
              return 'Click to view members'
            },
          },
        },
      },
    },
  }

  chart = new Chart(canvasRef.value, config)
}

onMounted(renderChart)
watch(() => [props.labels, props.data, props.colors], renderChart, { deep: true })
onBeforeUnmount(() => chart?.destroy())
</script>

<template>
  <div class="dashboard-chart">
    <div v-if="!hasData()" class="dashboard-chart__empty">
      {{ emptyMessage }}
    </div>
    <canvas v-show="hasData()" ref="canvasRef" />
  </div>
</template>
