import { ref, computed, onMounted } from 'vue'
import type { Member } from '@/types/member'
import { useToastStore } from '@/stores/toast'

export const ROWS_PER_PAGE_OPTIONS = [20, 50, 75, 100] as const

export type MemberSortColumn =
  | 'name'
  | 'phone'
  | 'address'
  | 'email'
  | 'belong_class_completed'
  | 'baptized'

export type SortOrder = 'asc' | 'desc'

export const SORTABLE_COLUMNS: { key: MemberSortColumn; label: string }[] = [
  { key: 'name', label: 'Name' },
  { key: 'phone', label: 'Phone' },
  { key: 'address', label: 'Address' },
  { key: 'email', label: 'Email Address' },
  { key: 'belong_class_completed', label: 'Belong Class Completed' },
  { key: 'baptized', label: 'Baptized' },
]

export interface MemberListFilters {
  keyword: string
  visit_year: string
  civil_status: string
  interest: string
  belong_class_completed: string
  baptism_completed: string
  bible_study_active: string
  ministry_active: string
}

function emptyFilters(): MemberListFilters {
  return {
    keyword: '',
    visit_year: '',
    civil_status: '',
    interest: '',
    belong_class_completed: '',
    baptism_completed: '',
    bible_study_active: '',
    ministry_active: '',
  }
}

function buildQueryString(
  filters: MemberListFilters,
  page: number,
  limit: number,
  sortBy: MemberSortColumn | '',
  sortOrder: SortOrder,
): string {
  const params = new URLSearchParams()

  Object.entries(filters).forEach(([key, value]) => {
    if (value) params.set(key, value)
  })

  params.set('page', String(page))
  params.set('limit', String(limit))

  if (sortBy) {
    params.set('sort_by', sortBy)
    params.set('sort_order', sortOrder)
  }

  return `?${params.toString()}`
}

export function useMembersList() {
  const toast = useToastStore()
  const members = ref<Member[]>([])
  const loading = ref(false)
  const deletingId = ref<string | null>(null)
  const error = ref<Error | null>(null)
  const filters = ref<MemberListFilters>(emptyFilters())
  const page = ref(1)
  const limit = ref<number>(ROWS_PER_PAGE_OPTIONS[0])
  const total = ref(0)
  const totalPages = ref(1)
  const sortBy = ref<MemberSortColumn | ''>('')
  const sortOrder = ref<SortOrder>('asc')
  const deleteConfirmOpen = ref(false)
  const deleteConfirmMessage = ref('')
  const pendingDeleteMember = ref<Member | null>(null)

  const showingFrom = computed(() => {
    if (total.value === 0) return 0
    return (page.value - 1) * limit.value + 1
  })

  const showingTo = computed(() => {
    if (total.value === 0) return 0
    return Math.min(page.value * limit.value, total.value)
  })

  const fetchMembers = async () => {
    try {
      loading.value = true
      error.value = null
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'
      const response = await fetch(
        `${apiBaseUrl}/members${buildQueryString(filters.value, page.value, limit.value, sortBy.value, sortOrder.value)}`,
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

      members.value = result.data
      total.value = result.pagination?.total ?? result.data.length
      totalPages.value = result.pagination?.totalPages ?? 1
      page.value = result.pagination?.page ?? page.value
    } catch (err) {
      error.value = err instanceof Error ? err : new Error('Unknown error')
    } finally {
      loading.value = false
    }
  }

  onMounted(() => fetchMembers())

  const applyFilters = async () => {
    page.value = 1
    await fetchMembers()
  }

  const clearFilters = async () => {
    filters.value = emptyFilters()
    page.value = 1
    await fetchMembers()
  }

  const changeLimit = async (newLimit: number) => {
    limit.value = newLimit
    page.value = 1
    await fetchMembers()
  }

  const goToPage = async (newPage: number) => {
    if (newPage < 1 || newPage > totalPages.value || newPage === page.value) return
    page.value = newPage
    await fetchMembers()
  }

  const setSort = async (column: MemberSortColumn, order: SortOrder) => {
    sortBy.value = column
    sortOrder.value = order
    page.value = 1
    await fetchMembers()
  }

  const requestDeleteMember = (member: Member) => {
    const name = `${member.first_name} ${member.last_name}`.trim()
    pendingDeleteMember.value = member
    deleteConfirmMessage.value = `Delete ${name}? This action cannot be undone.`
    deleteConfirmOpen.value = true
  }

  const cancelDeleteMember = () => {
    if (deletingId.value) return
    deleteConfirmOpen.value = false
    pendingDeleteMember.value = null
    deleteConfirmMessage.value = ''
  }

  const confirmDeleteMember = async () => {
    const member = pendingDeleteMember.value
    if (!member) return

    deletingId.value = member.id
    try {
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'
      const response = await fetch(`${apiBaseUrl}/members/${member.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Failed to delete member')
      }

      if (members.value.length === 1 && page.value > 1) {
        page.value -= 1
      }

      toast.showToast('Member deleted successfully')
      deleteConfirmOpen.value = false
      pendingDeleteMember.value = null
      deleteConfirmMessage.value = ''
      await fetchMembers()
    } catch (err) {
      toast.showToast(
        err instanceof Error ? err.message : 'Failed to delete member',
        true,
      )
    } finally {
      deletingId.value = null
    }
  }

  return {
    members,
    loading,
    deletingId,
    error,
    filters,
    page,
    limit,
    total,
    totalPages,
    sortBy,
    sortOrder,
    showingFrom,
    showingTo,
    fetchMembers,
    applyFilters,
    clearFilters,
    changeLimit,
    goToPage,
    setSort,
    requestDeleteMember,
    cancelDeleteMember,
    confirmDeleteMember,
    deleteConfirmOpen,
    deleteConfirmMessage,
  }
}
