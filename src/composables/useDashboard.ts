import { ref, watch, onMounted } from 'vue'
import type {
  DashboardMemberCategory,
  DashboardMemberRow,
  DashboardStats,
} from '@/types/dashboard'

export function useDashboard() {
  const visitYear = ref('')
  const stats = ref<DashboardStats | null>(null)
  const loading = ref(false)
  const error = ref<Error | null>(null)

  const drawerOpen = ref(false)
  const drawerTitle = ref('')
  const drawerMembers = ref<DashboardMemberRow[]>([])
  const drawerLoading = ref(false)
  const drawerError = ref<Error | null>(null)
  const lastDrawerQuery = ref<{
    category: DashboardMemberCategory
    segment: string
    title: string
  } | null>(null)

  const fetchStats = async (options?: { silent?: boolean }) => {
    try {
      if (!options?.silent) loading.value = true
      error.value = null
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'
      const params = new URLSearchParams()
      if (visitYear.value) params.set('visit_year', visitYear.value)

      const query = params.toString()
      const response = await fetch(
        `${apiBaseUrl}/members/dashboard/stats${query ? `?${query}` : ''}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      )

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Failed to fetch dashboard stats')
      }

      stats.value = result.data
    } catch (err) {
      error.value = err instanceof Error ? err : new Error('Unknown error')
      stats.value = null
    } finally {
      if (!options?.silent) loading.value = false
    }
  }

  const fetchDrawerMembers = async (
    category: DashboardMemberCategory,
    segment: string,
    title: string,
    options?: { silent?: boolean },
  ) => {
    lastDrawerQuery.value = { category, segment, title }
    drawerOpen.value = true
    drawerTitle.value = title
    if (!options?.silent) {
      drawerMembers.value = []
      drawerLoading.value = true
    }
    drawerError.value = null

    try {
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'
      const params = new URLSearchParams({
        category,
        segment,
      })
      if (visitYear.value) params.set('visit_year', visitYear.value)

      const response = await fetch(
        `${apiBaseUrl}/members/dashboard/members?${params.toString()}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      )

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Failed to fetch members')
      }

      drawerMembers.value = result.data
    } catch (err) {
      drawerError.value = err instanceof Error ? err : new Error('Unknown error')
    } finally {
      drawerLoading.value = false
    }
  }

  const closeDrawer = () => {
    drawerOpen.value = false
  }

  const refreshDashboard = async () => {
    await fetchStats({ silent: true })
    if (drawerOpen.value && lastDrawerQuery.value) {
      const { category, segment, title } = lastDrawerQuery.value
      await fetchDrawerMembers(category, segment, title, { silent: true })
    }
  }

  onMounted(fetchStats)
  watch(visitYear, () => {
    closeDrawer()
    fetchStats()
  })

  return {
    visitYear,
    stats,
    loading,
    error,
    drawerOpen,
    drawerTitle,
    drawerMembers,
    drawerLoading,
    drawerError,
    fetchStats,
    fetchDrawerMembers,
    refreshDashboard,
    closeDrawer,
  }
}

export function dashboardSegmentFromLabel(
  category: DashboardMemberCategory,
  label: string,
): string {
  if (category === 'interest') return label
  if (category === 'all') return 'all'

  const map: Record<string, string> = {
    Completed: 'completed',
    'Not Completed': 'not_completed',
    Active: 'active',
    Inactive: 'inactive',
  }

  return map[label] || label
}

export function dashboardBarSelection(
  label: string,
): { category: DashboardMemberCategory; segment: string; title: string } | null {
  const map: Record<
    string,
    { category: DashboardMemberCategory; segment: string; title: string }
  > = {
    'Total Visitors': {
      category: 'all',
      segment: 'all',
      title: 'Total Visitors',
    },
    'Baptism Completed': {
      category: 'baptism',
      segment: 'completed',
      title: 'Baptism Completed',
    },
    'Belong Class Completed': {
      category: 'belong_class',
      segment: 'completed',
      title: 'Belong Class Completed',
    },
    'Bible Study Active': {
      category: 'bible_study',
      segment: 'active',
      title: 'Bible Study Active',
    },
    'Ministry Active': {
      category: 'ministry',
      segment: 'active',
      title: 'Ministry Active',
    },
  }

  return map[label] ?? null
}
