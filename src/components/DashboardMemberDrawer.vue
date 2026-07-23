<script setup lang="ts">
import type { DashboardMemberRow } from '@/types/dashboard'

defineProps<{
  open: boolean
  title: string
  members: DashboardMemberRow[]
  loading: boolean
  error: Error | null
}>()

const emit = defineEmits<{
  close: []
  memberSelect: [id: string]
}>()

function memberName(member: DashboardMemberRow) {
  return `${member.first_name} ${member.last_name}`.trim()
}
</script>

<template>
  <Teleport to="body">
    <div
      class="dashboard-drawer"
      :class="{ 'dashboard-drawer--open': open }"
      aria-hidden="true"
    >
      <button
        type="button"
        class="dashboard-drawer__backdrop"
        aria-label="Close member list"
        @click="emit('close')"
      />
      <aside
        class="dashboard-drawer__panel"
        role="dialog"
        aria-modal="true"
        :aria-hidden="!open"
        :aria-label="title"
      >
        <header class="dashboard-drawer__header">
          <div>
            <h2 class="dashboard-drawer__title">{{ title }}</h2>
            <p v-if="!loading && !error" class="dashboard-drawer__count">
              {{ members.length }} {{ members.length === 1 ? 'member' : 'members' }}
            </p>
          </div>
          <button
            type="button"
            class="dashboard-drawer__close"
            aria-label="Close"
            @click="emit('close')"
          >
            ✕
          </button>
        </header>

        <div class="dashboard-drawer__body">
          <div v-if="loading" class="dashboard-drawer__loading">
            <div class="loader"></div>
            Loading members...
          </div>

          <p v-else-if="error" class="dashboard-drawer__error">
            {{ error.message }}
          </p>

          <p v-else-if="members.length === 0" class="dashboard-drawer__empty">
            No members found for this selection.
          </p>

          <ul v-else class="dashboard-drawer__list">
            <li v-for="member in members" :key="member.id">
              <button
                type="button"
                class="dashboard-drawer__item"
                @click="emit('memberSelect', member.id)"
              >
                <div class="dashboard-drawer__name">{{ memberName(member) }}</div>
                <div class="dashboard-drawer__detail">
                  <span class="dashboard-drawer__label">Phone</span>
                  <span>{{ member.mobile_number || '—' }}</span>
                </div>
                <div class="dashboard-drawer__detail">
                  <span class="dashboard-drawer__label">Email</span>
                  <span>{{ member.email || '—' }}</span>
                </div>
                <div class="dashboard-drawer__detail">
                  <span class="dashboard-drawer__label">Address</span>
                  <span>{{ member.address || '—' }}</span>
                </div>
                <span class="dashboard-drawer__edit-hint">Click to edit member</span>
              </button>
            </li>
          </ul>
        </div>
      </aside>
    </div>
  </Teleport>
</template>
