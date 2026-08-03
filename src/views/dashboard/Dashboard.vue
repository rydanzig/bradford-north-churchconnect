<script setup lang="ts">
import { computed } from 'vue'
import DashboardPieChart from '@/components/DashboardPieChart.vue'
import DashboardBarChart from '@/components/DashboardBarChart.vue'
import DashboardMemberDrawer from '@/components/DashboardMemberDrawer.vue'
import MemberEditModal from '@/components/MemberEditModal.vue'
import { dashboardBarSelection, dashboardSegmentFromLabel, useDashboard } from '@/composables/useDashboard'
import { useMemberEdit } from '@/composables/useMemberEdit'
import { VISIT_YEAR_OPTIONS } from '@/constants/memberFormOptions'
import type { DashboardMemberCategory } from '@/types/dashboard'

const {
  visitYear,
  stats,
  loading,
  error,
  drawerOpen,
  drawerTitle,
  drawerMembers,
  drawerLoading,
  drawerError,
  fetchDrawerMembers,
  refreshDashboard,
  closeDrawer,
} = useDashboard()

const {
  isOpen,
  loading: editLoading,
  saving,
  form,
  showMinistrySection,
  openEdit,
  closeEdit,
  toggleInterest,
  toggleMinistry,
  handleMobileInput,
  onHeardAboutUsChoiceChange,
  saveMember,
} = useMemberEdit(() => refreshDashboard())

const yearLabel = computed(() => {
  if (!visitYear.value) return 'All Years'
  return visitYear.value
})

const belongClassChart = computed(() => {
  if (!stats.value) return { labels: [], data: [], colors: [] }
  return {
    labels: ['Completed', 'Not Completed'],
    data: [stats.value.belong_class.completed, stats.value.belong_class.not_completed],
    colors: ['#7c6b9a', '#e8e2ef'],
  }
})

const baptismChart = computed(() => {
  if (!stats.value) return { labels: [], data: [], colors: [] }
  return {
    labels: ['Completed', 'Not Completed'],
    data: [stats.value.baptism.completed, stats.value.baptism.not_completed],
    colors: ['#8b7ab5', '#e8e2ef'],
  }
})

const ministryChart = computed(() => {
  if (!stats.value) return { labels: [], data: [], colors: [] }
  return {
    labels: ['Active', 'Inactive'],
    data: [stats.value.ministry.active, stats.value.ministry.inactive],
    colors: ['#6b7d9a', '#e8e2ef'],
  }
})

const bibleStudyChart = computed(() => {
  if (!stats.value) return { labels: [], data: [], colors: [] }
  return {
    labels: ['Active', 'Inactive'],
    data: [stats.value.bible_study.active, stats.value.bible_study.inactive],
    colors: ['#9a86b8', '#e8e2ef'],
  }
})

const interestsChart = computed(() => {
  if (!stats.value) return { labels: [], data: [] }
  return {
    labels: stats.value.interests.map((item) => item.interest),
    data: stats.value.interests.map((item) => item.count),
  }
})

const engagementBarChart = computed(() => {
  if (!stats.value) {
    return { labels: [], data: [], total: 0, colors: [] as string[] }
  }

  const total = stats.value.total_visitors

  return {
    labels: [
      'Total Visitors',
      'Baptism Completed',
      'Belong Class Completed',
      'Bible Study Active',
      'Ministry Active',
    ],
    data: [
      total,
      stats.value.baptism.completed,
      stats.value.belong_class.completed,
      stats.value.bible_study.active,
      stats.value.ministry.active,
    ],
    total,
    colors: ['#2a2340', '#7c6b9a', '#6f8f7a', '#9a86b8', '#8b7ab5'],
  }
})

function handleSliceClick(
  chartTitle: string,
  category: DashboardMemberCategory,
  payload: { label: string },
) {
  const segment = dashboardSegmentFromLabel(category, payload.label)
  const yearSuffix = visitYear.value ? ` (${visitYear.value})` : ''
  fetchDrawerMembers(category, segment, `${chartTitle}: ${payload.label}${yearSuffix}`)
}

function handleBarClick(payload: { label: string }) {
  const selection = dashboardBarSelection(payload.label)
  if (!selection) return

  const yearSuffix = visitYear.value ? ` (${visitYear.value})` : ''
  fetchDrawerMembers(
    selection.category,
    selection.segment,
    `${selection.title}${yearSuffix}`,
  )
}

function handleMemberSelect(id: string) {
  openEdit(id)
}
</script>

<template>
  <div class="page active dashboard-page" id="page-dashboard">
    <header class="dashboard-page__header">
      <div>
        <h1 class="dashboard-page__title">Dashboard</h1>
        <p class="dashboard-page__subtitle">Live visitor insights and engagement signals</p>
      </div>
    </header>

    <div class="dashboard-top-row">
      <div class="dashboard-top-row__filter card">
        <div class="form-group dashboard-toolbar__filter">
          <label for="dashboard-visit-year">Visit Year</label>
          <select id="dashboard-visit-year" v-model="visitYear" :disabled="loading">
            <option value="">All</option>
            <option v-for="year in VISIT_YEAR_OPTIONS" :key="year" :value="year">
              {{ year }}
            </option>
          </select>
        </div>
      </div>

      <div v-if="loading" class="dashboard-summary dashboard-summary--loading card">
        <div class="loader"></div>
        Loading visitors...
      </div>

      <div v-else-if="error" class="dashboard-summary dashboard-summary--error card">
        <p class="text-error">{{ error.message }}</p>
      </div>

      <div v-else-if="stats" class="dashboard-summary card">
        <div class="dashboard-summary__content">
          <div>
            <div class="dashboard-summary__label">Total Visitors</div>
            <div class="dashboard-summary__meta">{{ yearLabel }}</div>
          </div>
          <div class="dashboard-summary__value">{{ stats.total_visitors }}</div>
        </div>
      </div>
    </div>

    <template v-if="stats && !loading && !error">
      <article class="dashboard-card dashboard-card--wide card">
        <h2 class="dashboard-card__title">Visitor Engagement Overview</h2>
        <p class="dashboard-card__subtitle">
          Total visitors compared with baptism, belong class, bible study, and ministry counts
          for {{ yearLabel }}
        </p>
        <DashboardBarChart
          :labels="engagementBarChart.labels"
          :data="engagementBarChart.data"
          :total="engagementBarChart.total"
          :colors="engagementBarChart.colors"
          empty-message="No visitor records for this period"
          @bar-click="handleBarClick"
        />
      </article>

      <div class="dashboard-grid">
        <article class="dashboard-card card">
          <h2 class="dashboard-card__title">Belong Class Completed</h2>
          <DashboardPieChart
            :labels="belongClassChart.labels"
            :data="belongClassChart.data"
            :colors="belongClassChart.colors"
            empty-message="No visitor records for this period"
            @slice-click="handleSliceClick('Belong Class Completed', 'belong_class', $event)"
          />
        </article>

        <article class="dashboard-card card">
          <h2 class="dashboard-card__title">Baptism Completed</h2>
          <DashboardPieChart
            :labels="baptismChart.labels"
            :data="baptismChart.data"
            :colors="baptismChart.colors"
            empty-message="No visitor records for this period"
            @slice-click="handleSliceClick('Baptism Completed', 'baptism', $event)"
          />
        </article>

        <article class="dashboard-card card">
          <h2 class="dashboard-card__title">Ministry Active</h2>
          <DashboardPieChart
            :labels="ministryChart.labels"
            :data="ministryChart.data"
            :colors="ministryChart.colors"
            empty-message="No visitor records for this period"
            @slice-click="handleSliceClick('Ministry Active', 'ministry', $event)"
          />
        </article>

        <article class="dashboard-card card">
          <h2 class="dashboard-card__title">Bible Study Active</h2>
          <DashboardPieChart
            :labels="bibleStudyChart.labels"
            :data="bibleStudyChart.data"
            :colors="bibleStudyChart.colors"
            empty-message="No visitor records for this period"
            @slice-click="handleSliceClick('Bible Study Active', 'bible_study', $event)"
          />
        </article>
      </div>

      <article class="dashboard-card dashboard-card--wide card">
        <h2 class="dashboard-card__title">Member Interests</h2>
        <p class="dashboard-card__subtitle">
          Count of visitors who selected each interest
        </p>
        <DashboardPieChart
          :labels="interestsChart.labels"
          :data="interestsChart.data"
          empty-message="No interests recorded for this period"
          @slice-click="handleSliceClick('Member Interests', 'interest', $event)"
        />
      </article>
    </template>

    <DashboardMemberDrawer
      :open="drawerOpen"
      :title="drawerTitle"
      :members="drawerMembers"
      :loading="drawerLoading"
      :error="drawerError"
      @close="closeDrawer"
      @member-select="handleMemberSelect"
    />

    <MemberEditModal
      :open="isOpen"
      :loading="editLoading"
      :saving="saving"
      :form="form"
      :show-ministry-section="showMinistrySection"
      @close="closeEdit"
      @save="saveMember"
      @toggle-interest="toggleInterest"
      @toggle-ministry="toggleMinistry"
      @mobile-input="handleMobileInput"
      @heard-about-us-change="onHeardAboutUsChoiceChange"
    />
  </div>
</template>

<style>
@import '@/assets/styles/dashboard.css';
</style>
