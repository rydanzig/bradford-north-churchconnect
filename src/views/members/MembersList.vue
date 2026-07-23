<script setup lang="ts">
import { computed } from 'vue'
import MemberEditModal from '@/components/MemberEditModal.vue'
import ConfirmDeleteModal from '@/components/ConfirmDeleteModal.vue'
import { useMembersList, ROWS_PER_PAGE_OPTIONS, SORTABLE_COLUMNS } from '@/composables/useMembersList'
import { useMemberEdit } from '@/composables/useMemberEdit'
import { exportDisplayedMembersToXlsx } from '@/utils/exportMembersToXlsx'
import {
  CIVIL_STATUS_OPTIONS,
  INTEREST_OPTIONS,
  VISIT_YEAR_OPTIONS,
  YES_NO_FILTER_OPTIONS,
} from '@/constants/memberFormOptions'

const {
  members,
  loading,
  error,
  filters,
  page,
  limit,
  total,
  totalPages,
  showingFrom,
  showingTo,
  fetchMembers,
  applyFilters,
  clearFilters,
  changeLimit,
  goToPage,
  sortBy,
  sortOrder,
  setSort,
  deletingId,
  requestDeleteMember,
  cancelDeleteMember,
  confirmDeleteMember,
  deleteConfirmOpen,
  deleteConfirmMessage,
} = useMembersList()

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
  saveMember,
} = useMemberEdit(() => fetchMembers())

const activeFilterCount = computed(() => {
  const { keyword, ...rest } = filters.value
  let count = keyword ? 1 : 0
  count += Object.values(rest).filter(Boolean).length
  return count
})

function exportCurrentPage() {
  if (!members.value.length) return
  exportDisplayedMembersToXlsx(members.value)
}

function isCompleted(status: string | null): boolean {
  return status === 'completed'
}
</script>

<template>
  <div class="page active members-page" id="page-members">
    <header class="members-page__header">
      <div>
        <h1 class="members-page__title">Member Directory</h1>
        <p class="members-page__subtitle">Search, filter, and manage church member records</p>
      </div>
    </header>

    <div class="members-toolbar card">
      <div class="search-bar members-search">
        <input
          v-model="filters.keyword"
          type="search"
          placeholder="Type to search"
          aria-label="Type to search"
          @keyup.enter="applyFilters"
        />
        <button class="btn btn-primary" @click="applyFilters">Search</button>
      </div>

      <div class="members-filters">
        <div class="members-filters__head">
          <h2 class="members-filters__title">Filters</h2>
          <span v-if="activeFilterCount" class="members-filters__badge">
            {{ activeFilterCount }} active
          </span>
        </div>

        <div class="members-filters__grid">
          <div class="form-group">
            <label>Visit Year</label>
            <select v-model="filters.visit_year" @change="applyFilters">
              <option value="">All</option>
              <option v-for="year in VISIT_YEAR_OPTIONS" :key="year" :value="year">
                {{ year }}
              </option>
            </select>
          </div>

          <div class="form-group">
            <label>Civil Status</label>
            <select v-model="filters.civil_status" @change="applyFilters">
              <option value="">All</option>
              <option v-for="option in CIVIL_STATUS_OPTIONS" :key="option" :value="option">
                {{ option }}
              </option>
            </select>
          </div>

          <div class="form-group">
            <label>Interest</label>
            <select v-model="filters.interest" @change="applyFilters">
              <option value="">All</option>
              <option
                v-for="option in INTEREST_OPTIONS"
                :key="option.value"
                :value="option.value"
              >
                {{ option.label }}
              </option>
            </select>
          </div>

          <div class="form-group">
            <label>Belong Class Completed</label>
            <select v-model="filters.belong_class_completed" @change="applyFilters">
              <option
                v-for="option in YES_NO_FILTER_OPTIONS"
                :key="option.value"
                :value="option.value"
              >
                {{ option.label }}
              </option>
            </select>
          </div>

          <div class="form-group">
            <label>Baptism Completed</label>
            <select v-model="filters.baptism_completed" @change="applyFilters">
              <option
                v-for="option in YES_NO_FILTER_OPTIONS"
                :key="option.value"
                :value="option.value"
              >
                {{ option.label }}
              </option>
            </select>
          </div>

          <div class="form-group">
            <label>Bible Study Active</label>
            <select v-model="filters.bible_study_active" @change="applyFilters">
              <option
                v-for="option in YES_NO_FILTER_OPTIONS"
                :key="option.value"
                :value="option.value"
              >
                {{ option.label }}
              </option>
            </select>
          </div>

          <div class="form-group">
            <label>Ministry Active</label>
            <select v-model="filters.ministry_active" @change="applyFilters">
              <option
                v-for="option in YES_NO_FILTER_OPTIONS"
                :key="option.value"
                :value="option.value"
              >
                {{ option.label }}
              </option>
            </select>
          </div>
        </div>

        <button
          type="button"
          class="members-filters__clear"
          :disabled="!activeFilterCount"
          @click="clearFilters"
        >
          Clear all filters
        </button>
      </div>
    </div>

    <div class="members-table-card card">
      <div class="members-table-card__head">
        <h2 class="members-table-card__title">Members</h2>
        <div class="members-table-card__actions">
          <span v-if="!loading" class="members-table-card__count">
            {{ total }} {{ total === 1 ? 'result' : 'results' }}
          </span>
          <button
            type="button"
            class="members-export-btn"
            :disabled="loading || members.length === 0"
            @click="exportCurrentPage"
          >
            Export
          </button>
        </div>
      </div>

      <table v-if="!error && !loading && members.length" class="member-table table-with-ellipsis" id="member-table">
        <thead>
          <tr>
            <th v-for="column in SORTABLE_COLUMNS" :key="column.key">
              <div class="sortable-th">
                <span>{{ column.label }}</span>
                <span class="sort-btns">
                  <button
                    type="button"
                    class="sort-btn"
                    :class="{ 'sort-btn--active': sortBy === column.key && sortOrder === 'asc' }"
                    :aria-label="`Sort ${column.label} ascending`"
                    @click="setSort(column.key, 'asc')"
                  >
                    ▲
                  </button>
                  <button
                    type="button"
                    class="sort-btn"
                    :class="{ 'sort-btn--active': sortBy === column.key && sortOrder === 'desc' }"
                    :aria-label="`Sort ${column.label} descending`"
                    @click="setSort(column.key, 'desc')"
                  >
                    ▼
                  </button>
                </span>
              </div>
            </th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody id="member-tbody">
          <tr v-for="member in members" :key="member.id">
            <td>
              <strong>{{ member.first_name }} {{ member.last_name }}</strong>
            </td>
            <td>{{ member.mobile_number || '—' }}</td>
            <td
              class="ellipsis"
              :title="member.address && member.address.length > 20 ? member.address : ''"
            >
              {{ member.address }}
            </td>
            <td class="ellipsis" :title="member.email || ''">
              {{ member.email || '—' }}
            </td>
            <td>
              <span class="tag" :class="isCompleted(member.belong_class_status) ? 'tag-yes' : 'tag-no'">
                {{ isCompleted(member.belong_class_status) ? 'Yes' : 'No' }}
              </span>
            </td>
            <td>
              <span class="tag" :class="isCompleted(member.baptism_status) ? 'tag-yes' : 'tag-no'">
                {{ isCompleted(member.baptism_status) ? 'Yes' : 'No' }}
              </span>
            </td>
            <td>
              <div class="members-row-actions">
                <button type="button" class="members-edit-btn" @click="openEdit(member.id)">
                  Edit
                </button>
                <button
                  type="button"
                  class="members-delete-btn"
                  :disabled="deletingId === member.id"
                  @click="requestDeleteMember(member)"
                >
                  {{ deletingId === member.id ? 'Deleting…' : 'Delete' }}
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <div v-if="loading" class="members-loading">
        <div class="loader"></div>
        Loading members...
      </div>

      <div v-else-if="!error && members.length === 0" class="members-empty">
        <div class="members-empty__icon">🔍</div>
        <p>No members match your search or filters.</p>
      </div>

      <p v-if="error" class="text-error text-center">
        {{ error.message }}
      </p>

      <div v-if="!error && !loading && total > 0" class="members-pagination">
        <div class="members-pagination__left">
          <label class="members-pagination__label" for="rows-per-page">Rows per page</label>
          <select
            id="rows-per-page"
            class="members-pagination__select"
            :value="limit"
            @change="changeLimit(Number(($event.target as HTMLSelectElement).value))"
          >
            <option v-for="option in ROWS_PER_PAGE_OPTIONS" :key="option" :value="option">
              {{ option }}
            </option>
          </select>
          <span class="members-pagination__range">
            Showing {{ showingFrom }}–{{ showingTo }} of {{ total }}
          </span>
        </div>

        <div class="members-pagination__controls">
          <button
            type="button"
            class="members-pagination__btn"
            :disabled="page <= 1"
            @click="goToPage(page - 1)"
          >
            Previous
          </button>
          <span class="members-pagination__page">Page {{ page }} of {{ totalPages }}</span>
          <button
            type="button"
            class="members-pagination__btn"
            :disabled="page >= totalPages"
            @click="goToPage(page + 1)"
          >
            Next
          </button>
        </div>
      </div>
    </div>

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
    />

    <ConfirmDeleteModal
      :open="deleteConfirmOpen"
      :message="deleteConfirmMessage"
      :loading="!!deletingId"
      @cancel="cancelDeleteMember"
      @confirm="confirmDeleteMember"
    />
  </div>
</template>

<style>
@import '@/assets/styles/members-list.css';
</style>
