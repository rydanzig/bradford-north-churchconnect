<script setup lang="ts">
import {
  INTEREST_OPTIONS,
  MINISTRY_OPTIONS,
  CIVIL_STATUS_OPTIONS,
  GENDER_OPTIONS,
  MEMBERSHIP_STATUS_OPTIONS,
  STATUS_TYPE_OPTIONS,
  VISIT_DETAILS_OPTIONS,
  HEARD_ABOUT_US_OPTIONS,
  NETWORKS_OPTIONS,
} from '@/constants/memberFormOptions'
import type { MemberEditForm } from '@/types/member'

defineProps<{
  open: boolean
  loading: boolean
  saving: boolean
  form: MemberEditForm
  showMinistrySection: boolean
}>()

const emit = defineEmits<{
  close: []
  save: []
  toggleInterest: [value: string]
  toggleMinistry: [value: string]
  mobileInput: [event: Event]
}>()
</script>

<template>
  <Teleport to="body">
    <div class="modal-overlay member-edit-overlay" :class="{ open }" @click.self="emit('close')">
      <div class="modal-box member-edit-modal">
        <button type="button" class="modal-close" @click="emit('close')">✕</button>

        <div class="modal-title">Edit Member</div>
        <div class="modal-sub">Update member record details below.</div>

        <div v-if="loading" class="member-edit-loading">
          <div class="loader"></div>
          Loading member...
        </div>

      <form v-else class="member-edit-form" @submit.prevent="emit('save')">
        <section class="member-edit-section">
          <h3 class="member-edit-section__title">Member Info</h3>
          <div class="form-grid">
            <div class="form-group">
              <label>Member No</label>
              <input type="text" :value="form.member_no" readonly class="input-readonly" />
            </div>
            <div class="form-group">
              <label>First Name <span class="required">*</span></label>
              <input v-model="form.first_name" type="text" required maxlength="100" />
            </div>
            <div class="form-group">
              <label>Middle Name</label>
              <input v-model="form.middle_name" type="text" maxlength="100" />
            </div>
            <div class="form-group">
              <label>Last Name <span class="required">*</span></label>
              <input v-model="form.last_name" type="text" required maxlength="100" />
            </div>
            <div class="form-group">
              <label>Suffix</label>
              <input v-model="form.suffix" type="text" maxlength="10" />
            </div>
            <div class="form-group">
              <label>Gender</label>
              <select v-model="form.gender">
                <option value="">— Select —</option>
                <option v-for="option in GENDER_OPTIONS" :key="option" :value="option">{{ option }}</option>
              </select>
            </div>
            <div class="form-group">
              <label>Birth Date</label>
              <input v-model="form.birth_date" type="date" />
            </div>
            <div class="form-group">
              <label>Civil Status <span class="required">*</span></label>
              <select v-model="form.civil_status" required>
                <option v-for="option in CIVIL_STATUS_OPTIONS" :key="option" :value="option">{{ option }}</option>
              </select>
            </div>
          </div>
        </section>

        <section class="member-edit-section">
          <h3 class="member-edit-section__title">Contact</h3>
          <div class="form-grid">
            <div class="form-group">
              <label>Mobile Number</label>
              <input
                :value="form.mobile_number"
                type="tel"
                placeholder="09XXXXXXXXX"
                maxlength="11"
                @input="emit('mobileInput', $event)"
              />
            </div>
            <div class="form-group">
              <label>Email</label>
              <input v-model="form.email" type="email" maxlength="150" />
            </div>
            <div class="form-group form-full">
              <label>Address <span class="required">*</span></label>
              <input v-model="form.address" type="text" required />
            </div>
          </div>
        </section>

        <section class="member-edit-section">
          <h3 class="member-edit-section__title">Visit & Membership</h3>
          <div class="form-grid">
            <div class="form-group">
              <label>Visit Date <span class="required">*</span></label>
              <input v-model="form.visit_date" type="date" required />
            </div>
            <div class="form-group">
              <label>Visit Details</label>
              <select v-model="form.visit_details">
                <option v-for="option in VISIT_DETAILS_OPTIONS" :key="option" :value="option">{{ option }}</option>
              </select>
            </div>
            <div class="form-group">
              <label>Heard About Us</label>
              <select v-model="form.heard_about_us">
                <option v-for="option in HEARD_ABOUT_US_OPTIONS" :key="option" :value="option">{{ option }}</option>
              </select>
            </div>
            <div class="form-group">
              <label>Membership Status</label>
              <select v-model="form.membership_type">
                <option value="">— Select —</option>
                <option v-for="option in MEMBERSHIP_STATUS_OPTIONS" :key="option" :value="option">{{ option }}</option>
              </select>
            </div>
            <div class="form-group">
              <label>Status Type</label>
              <select v-model="form.status_type">
                <option v-for="option in STATUS_TYPE_OPTIONS" :key="option" :value="option">{{ option }}</option>
              </select>
            </div>
            <div class="form-group">
              <label>Networks</label>
              <select v-model="form.networks">
                <option value="">— Select —</option>
                <option v-for="option in NETWORKS_OPTIONS" :key="option" :value="option">{{ option }}</option>
              </select>
            </div>
            <div class="form-group">
              <label>Household Name</label>
              <input v-model="form.household_name" type="text" maxlength="200" />
            </div>
            <div class="form-group">
              <label>Origin City / Country</label>
              <input v-model="form.origin_city_country" type="text" maxlength="200" />
            </div>
            <div class="form-group">
              <label>Church Name</label>
              <input v-model="form.church_name" type="text" maxlength="200" />
            </div>
          </div>
        </section>

        <section v-if="form.social_media.length" class="member-edit-section">
          <h3 class="member-edit-section__title">Social Media</h3>
          <div class="form-grid social-media-edit-grid">
            <div
              v-for="(entry, index) in form.social_media"
              :key="index"
              class="form-group"
            >
              <label>{{ entry.type }}</label>
              <input
                v-model="entry.username"
                type="text"
                :placeholder="`${entry.type} username or URL`"
              />
            </div>
          </div>
        </section>

        <section class="member-edit-section">
          <h3 class="member-edit-section__title">Interests</h3>
          <div class="member-edit-checkboxes">
            <label
              v-for="option in INTEREST_OPTIONS"
              :key="option.value"
              class="checkbox-item"
            >
              <input
                type="checkbox"
                :checked="form.interests.includes(option.value)"
                @change="emit('toggleInterest', option.value)"
              />
              <span>{{ option.label }}</span>
            </label>
          </div>

          <div v-if="showMinistrySection" class="member-edit-ministry">
            <span class="member-edit-ministry__label">Serving In Ministry</span>
            <div class="member-edit-checkboxes member-edit-checkboxes--indented">
              <label
                v-for="option in MINISTRY_OPTIONS"
                :key="option.value"
                class="checkbox-item"
              >
                <input
                  type="checkbox"
                  :checked="form.serving_in_ministry.includes(option.value)"
                  @change="emit('toggleMinistry', option.value)"
                />
                <span>{{ option.label }}</span>
              </label>
            </div>
          </div>
        </section>

        <section class="member-edit-section">
          <h3 class="member-edit-section__title">Follow Up</h3>
          <div class="form-grid">
            <div class="form-group">
              <label>Last Follow Up Date</label>
              <input v-model="form.last_follow_up_date" type="date" />
            </div>
            <div class="form-group">
              <label>Followed Up By</label>
              <input v-model="form.followed_up_by" type="text" maxlength="200" />
            </div>
          </div>
        </section>

        <section class="member-edit-section">
          <h3 class="member-edit-section__title">Member Status</h3>
          <div class="member-edit-checkboxes member-edit-checkboxes--inline">
            <label class="checkbox-item">
              <input v-model="form.belong_class_completed" type="checkbox" />
              <span>Belong Class Completed</span>
            </label>
            <label class="checkbox-item">
              <input v-model="form.baptism_completed" type="checkbox" />
              <span>Baptism Completed</span>
            </label>
            <label class="checkbox-item">
              <input v-model="form.bible_study_active" type="checkbox" />
              <span>Bible Study Active</span>
            </label>
            <label class="checkbox-item">
              <input v-model="form.ministry_active" type="checkbox" />
              <span>Ministry Active</span>
            </label>
          </div>
        </section>

        <section class="member-edit-section">
          <h3 class="member-edit-section__title">Additional Info</h3>
          <div class="form-grid">
            <div class="form-group">
              <label>Nationality</label>
              <input v-model="form.nationality" type="text" maxlength="100" />
            </div>
            <div class="form-group">
              <label>Occupation</label>
              <input v-model="form.occupation" type="text" maxlength="100" />
            </div>
            <div class="form-group">
              <label>Company</label>
              <input v-model="form.company" type="text" maxlength="150" />
            </div>
            <div class="form-group">
              <label>Photo URL</label>
              <input v-model="form.photo_url" type="text" />
            </div>
            <div class="form-group form-full">
              <label>Prayer Request</label>
              <textarea v-model="form.prayer_request" rows="3"></textarea>
            </div>
          </div>
        </section>

        <div class="member-edit-actions">
          <button type="button" class="btn register-clear-btn" @click="emit('close')">Cancel</button>
          <button type="submit" class="btn btn-primary" :disabled="saving">
            {{ saving ? 'Saving...' : 'Save Changes' }}
          </button>
        </div>
      </form>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.member-edit-overlay {
  z-index: 700;
}

.member-edit-modal {
  max-width: 760px;
  max-height: 90vh;
  overflow-y: auto;
  padding: 28px 28px 24px;
}

.member-edit-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 48px 0;
  color: var(--gray-600);
}

.member-edit-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.member-edit-section {
  padding-bottom: 4px;
  border-bottom: 1px solid var(--gray-200);
}

.member-edit-section:last-of-type {
  border-bottom: none;
}

.member-edit-section__title {
  font-family: var(--font-display);
  font-size: 17px;
  color: var(--navy);
  margin: 0 0 12px;
}

.input-readonly {
  background: var(--gray-100);
  color: var(--gray-600);
  cursor: not-allowed;
}

.social-media-edit-grid {
  max-width: 100%;
}

.member-edit-checkboxes {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.member-edit-checkboxes--inline {
  flex-direction: row;
  flex-wrap: wrap;
  gap: 16px;
}

.member-edit-checkboxes--indented {
  margin-left: 20px;
  margin-top: 8px;
  padding: 10px 12px;
  background: var(--sky-light);
  border-radius: 8px;
  border-left: 3px solid var(--sky);
}

.member-edit-ministry {
  margin-top: 10px;
}

.member-edit-ministry__label {
  display: block;
  font-size: 12px;
  font-weight: 700;
  color: var(--navy);
  margin-bottom: 4px;
}

.member-edit-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding-top: 8px;
  position: sticky;
  bottom: 0;
  background: var(--white);
}
</style>
