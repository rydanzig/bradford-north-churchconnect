<script setup lang="ts">
import MembersTab from '@/components/MembersTab.vue';
import { useMembersList } from '@/composables/useMembersList';
const { 
    members, 
    loading, 
    error,
    filterTable 
} = useMembersList();
</script>
<template>
  <!--TODO: Loading here-->
  <!--TODO: Show errors, if there is/are-->
  <div class="page active" id="page-members">
    <MembersTab />
    <div class="tab-content active" id="tab-view">
      <div class="search-bar">
        <input
          type="text"
          placeholder="Search by name, phone, or member ID..."
          id="member-search-input"
          @input="filterTable"
        />
        <button class="btn btn-primary" @click="filterTable">🔍 Search</button>
      </div>
      <div class="card" style="padding: 0; overflow: hidden">
        <table v-if="!error" class="member-table table-with-ellipsis" id="member-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Phone</th>
              <th>Address</th>
              <th>Membership</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody id="member-tbody">
            <tr v-for="member in members" :key="member.id">
              <td>
                <strong>{{ member.first_name }} {{ member.last_name }}</strong>
              </td>
              <td>{{ member.mobile_number }}</td>
              <td class="ellipsis"
                  :title="member.address.length > 20 ? member.address : ''">
                  {{ member.address }}
              </td>
              <td>{{ member.membership_type }}</td>
              <td>
                <span
                  class="tag"
                  :class="{
                    'tag-active': member.status_type === 'active',
                    'tag-inactive': member.status_type === 'inactive',
                    'tag-visitor': member.status_type === 'visitor',
                  }"
                >
                  {{ member.status_type }}
                </span>
              </td>
              <td>
                <button class="btn btn-primary btn-sm" onclick="loadMember('James Anderson')">
                  Edit
                </button>
              </td>
            </tr>
            <tr v-if="loading">
                <td colspan="6" class="text-center">
                    <div class="loader"></div>
                    Loading...
                </td>
            </tr>
            <!-- Empty state -->
            <tr v-if="!loading && members.length === 0">
              <td colspan="6" class="text-center">No members found</td>
            </tr>
          </tbody>
        </table>
        <p v-if="error" class="text-error text-center">
            {{ error }}
        </p>
      </div>
    </div>
  </div>
</template>
<style></style>
