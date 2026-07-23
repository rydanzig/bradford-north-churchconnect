<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch, computed } from 'vue'
import {
  Chart,
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  Legend,
  Tooltip,
  type ChartConfiguration,
  type ActiveElement,
} from 'chart.js'
import type { ChartEvent } from 'chart.js'

Chart.register(BarController, BarElement, CategoryScale, LinearScale, Legend, Tooltip)

const props = withDefaults(
  defineProps<{
    labels: string[]
    data: number[]
    total: number
    colors?: string[]
    emptyMessage?: string
  }>(),
  {
    colors: () => [],
    emptyMessage: 'No data available',
  },
)

const emit = defineEmits<{
  barClick: [{ index: number; label: string }]
}>()

const canvasRef = ref<HTMLCanvasElement | null>(null)
let chart: Chart<'bar'> | null = null

const defaultColors = ['#2a2340', '#7c6b9a', '#6f8f7a', '#9a86b8', '#8b7ab5']

const hasData = computed(() => props.total > 0)

function handleClick(_event: ChartEvent, elements: ActiveElement[]) {
  if (!elements.length) return

  const index = elements[0].index
  const label = props.labels[index]
  if (!label || !props.data[index]) return

  emit('barClick', { index, label })
}

function renderChart() {
  chart?.destroy()
  chart = null

  if (!canvasRef.value || !hasData.value) return

  const backgroundColor =
    props.colors.length > 0
      ? props.colors
      : props.labels.map((_, index) => defaultColors[index % defaultColors.length])

  const config: ChartConfiguration<'bar'> = {
    type: 'bar',
    data: {
      labels: props.labels,
      datasets: [
        {
          label: 'Members',
          data: props.data,
          backgroundColor,
          borderRadius: 8,
          borderSkipped: false,
          maxBarThickness: 72,
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
          display: false,
        },
        tooltip: {
          callbacks: {
            label(context) {
              const value = Number(context.parsed.y) || 0
              if (context.dataIndex === 0) {
                return `Total: ${value}`
              }
              const percent =
                props.total > 0 ? ((value / props.total) * 100).toFixed(1) : '0.0'
              return `${value} of ${props.total} (${percent}%)`
            },
            afterBody() {
              return 'Click to view members'
            },
          },
        },
      },
      scales: {
        x: {
          grid: {
            display: false,
          },
          ticks: {
            font: {
              family: "'Manrope', sans-serif",
              size: 12,
            },
            color: '#5b677a',
          },
        },
        y: {
          beginAtZero: true,
          suggestedMax: props.total,
          grid: {
            color: 'rgba(15, 23, 42, 0.06)',
          },
          ticks: {
            precision: 0,
            font: {
              family: "'Manrope', sans-serif",
              size: 12,
            },
            color: '#5b677a',
          },
        },
      },
    },
  }

  chart = new Chart(canvasRef.value, config)
}

onMounted(renderChart)
watch(() => [props.labels, props.data, props.total, props.colors], renderChart, { deep: true })
onBeforeUnmount(() => chart?.destroy())
</script>

<template>
  <div class="dashboard-bar-chart">
    <div v-if="!hasData" class="dashboard-bar-chart__empty">
      {{ emptyMessage }}
    </div>
    <canvas v-show="hasData" ref="canvasRef" />
  </div>
</template>
