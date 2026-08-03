import { ref, computed } from 'vue'
import type { Member, MemberEditForm, SocialMediaEntry } from '@/types/member'
import {
  HEARD_ABOUT_US_OPTIONS,
  MINISTRY_OPTIONS,
  SERVING_IN_MINISTRY_INTEREST,
} from '@/constants/memberFormOptions'
import { useToastStore } from '@/stores/toast'

const STANDARD_HEARD_ABOUT_US = HEARD_ABOUT_US_OPTIONS.filter((option) => option !== 'Others')

function parseJsonArray<T>(value: unknown): T[] {
  if (!value) return []
  if (Array.isArray(value)) return value as T[]
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value)
      return Array.isArray(parsed) ? parsed : []
    } catch {
      return []
    }
  }
  return []
}

function toDateInput(value: string | null | undefined): string {
  if (!value) return ''
  return value.split('T')[0] ?? ''
}

function ministryMatches(stored: string, optionValue: string): boolean {
  return stored.includes(optionValue)
}

function emptyForm(): MemberEditForm {
  return {
    member_no: '',
    first_name: '',
    middle_name: '',
    last_name: '',
    suffix: '',
    gender: '',
    birth_date: '',
    visit_date: '',
    civil_status: 'Single',
    mobile_number: '',
    email: '',
    address: '',
    heard_about_us: 'Friend / Family',
    heard_about_us_choice: 'Friend / Family',
    heard_about_us_specify: '',
    membership_type: '',
    household_name: '',
    prayer_request: '',
    social_media: [],
    visit_details: 'First Time Visitor',
    interests: [],
    networks: '',
    status_type: 'visitor',
    last_follow_up_date: '',
    followed_up_by: '',
    belong_class_completed: false,
    baptism_completed: false,
    bible_study_active: false,
    ministry_active: false,
    nationality: '',
    occupation: '',
    company: '',
    photo_url: '',
    origin_city_country: '',
    church_name: '',
    serving_in_ministry: [],
  }
}

function resolveHeardAboutUsFields(heardAboutUs: string | null | undefined) {
  const value = heardAboutUs ?? 'Friend / Family'
  if ((STANDARD_HEARD_ABOUT_US as readonly string[]).includes(value)) {
    return {
      heard_about_us: value,
      heard_about_us_choice: value,
      heard_about_us_specify: '',
    }
  }
  return {
    heard_about_us: value,
    heard_about_us_choice: 'Others',
    heard_about_us_specify: value === 'Others' ? '' : value,
  }
}

export function useMemberEdit(onSaved?: () => void) {
  const toast = useToastStore()
  const isOpen = ref(false)
  const loading = ref(false)
  const saving = ref(false)
  const memberId = ref('')
  const form = ref<MemberEditForm>(emptyForm())

  const showMinistrySection = computed(() =>
    form.value.interests.includes(SERVING_IN_MINISTRY_INTEREST),
  )

  function memberToForm(member: Member): MemberEditForm {
    const socialMedia = parseJsonArray<SocialMediaEntry>(member.social_media)
    const interests = parseJsonArray<string>(member.interests)
    const servingRaw = parseJsonArray<{ ministry: string }>(member.serving_in_ministry)
    const servingValues = MINISTRY_OPTIONS.filter((option) =>
      servingRaw.some((entry) => ministryMatches(entry.ministry, option.value)),
    ).map((option) => option.value)

    return {
      member_no: member.member_no ?? '',
      first_name: member.first_name ?? '',
      middle_name: member.middle_name ?? '',
      last_name: member.last_name ?? '',
      suffix: member.suffix ?? '',
      gender: member.gender ?? '',
      birth_date: toDateInput(member.birth_date),
      visit_date: toDateInput(member.visit_date),
      civil_status: member.civil_status ?? 'Single',
      mobile_number: member.mobile_number ?? '',
      email: member.email ?? '',
      address: member.address ?? '',
      ...resolveHeardAboutUsFields(member.heard_about_us),
      membership_type: member.membership_type ?? '',
      household_name: member.household_name ?? '',
      prayer_request: member.prayer_request ?? '',
      social_media: socialMedia,
      visit_details: member.visit_details ?? 'First Time Visitor',
      interests,
      networks: member.networks ?? '',
      status_type: member.status_type ?? 'visitor',
      last_follow_up_date: toDateInput(member.last_follow_up_date),
      followed_up_by: member.followed_up_by ?? '',
      belong_class_completed: member.belong_class_status === 'completed',
      baptism_completed: member.baptism_status === 'completed',
      bible_study_active: member.bstudy_type === 'active',
      ministry_active: member.ministry_status === 'active',
      nationality: member.nationality ?? '',
      occupation: member.occupation ?? '',
      company: member.company ?? '',
      photo_url: member.photo_url ?? '',
      origin_city_country: member.origin_city_country ?? '',
      church_name: member.church_name ?? '',
      serving_in_ministry: servingValues,
    }
  }

  function onHeardAboutUsChoiceChange() {
    if (form.value.heard_about_us_choice !== 'Others') {
      form.value.heard_about_us_specify = ''
    }
  }

  function resolvedHeardAboutUs() {
    if (form.value.heard_about_us_choice === 'Others') {
      return form.value.heard_about_us_specify.trim()
    }
    return form.value.heard_about_us_choice
  }

  async function openEdit(id: string) {
    memberId.value = id
    isOpen.value = true
    loading.value = true
    form.value = emptyForm()

    try {
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'
      const response = await fetch(`${apiBaseUrl}/members/${id}`)
      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Failed to load member')
      }

      form.value = memberToForm(result.data)
    } catch (err) {
      toast.showToast(err instanceof Error ? err.message : 'Failed to load member', true)
      closeEdit()
    } finally {
      loading.value = false
    }
  }

  function closeEdit() {
    isOpen.value = false
    memberId.value = ''
    form.value = emptyForm()
  }

  function toggleInterest(value: string) {
    const index = form.value.interests.indexOf(value)
    if (index >= 0) {
      form.value.interests.splice(index, 1)
      if (value === SERVING_IN_MINISTRY_INTEREST) {
        form.value.serving_in_ministry = []
      }
    } else {
      form.value.interests.push(value)
    }
  }

  function toggleMinistry(value: string) {
    const index = form.value.serving_in_ministry.indexOf(value)
    if (index >= 0) {
      form.value.serving_in_ministry.splice(index, 1)
    } else {
      form.value.serving_in_ministry.push(value)
    }
  }

  function handleMobileInput(event: Event) {
    const input = event.target as HTMLInputElement
    let value = input.value.replace(/\D/g, '')
    if (value.length > 11) value = value.substring(0, 11)
    input.value = value
    form.value.mobile_number = value
  }

  async function saveMember() {
    if (!memberId.value) return

    saving.value = true
    try {
      const servingInMinistry = form.value.serving_in_ministry.map((ministry) => {
        const option = MINISTRY_OPTIONS.find((item) => item.value === ministry)
        return {
          ministry: option?.label ?? ministry,
          role: 'Volunteer',
          start_date: new Date().toISOString().split('T')[0],
        }
      })

      const heardAboutUs = resolvedHeardAboutUs()
      if (!heardAboutUs) {
        toast.showToast(
          form.value.heard_about_us_choice === 'Others'
            ? 'Please specify how you heard about us'
            : 'Heard about us is required',
          true,
        )
        return
      }

      const payload = {
        first_name: form.value.first_name,
        middle_name: form.value.middle_name || null,
        last_name: form.value.last_name,
        suffix: form.value.suffix || null,
        gender: form.value.gender || null,
        birth_date: form.value.birth_date || null,
        visit_date: form.value.visit_date,
        civil_status: form.value.civil_status,
        mobile_number: form.value.mobile_number || null,
        email: form.value.email || null,
        address: form.value.address,
        heard_about_us: heardAboutUs,
        membership_type: form.value.membership_type || null,
        household_name: form.value.household_name || null,
        prayer_request: form.value.prayer_request || null,
        social_media: JSON.stringify(form.value.social_media),
        visit_details: form.value.visit_details,
        interests: JSON.stringify(form.value.interests),
        networks: form.value.networks || null,
        status_type: form.value.status_type || null,
        last_follow_up_date: form.value.last_follow_up_date || null,
        followed_up_by: form.value.followed_up_by || null,
        belong_class_status: form.value.belong_class_completed ? 'completed' : 'not started',
        baptism_status: form.value.baptism_completed ? 'completed' : 'pending',
        bstudy_type: form.value.bible_study_active ? 'active' : 'inactive',
        ministry_status: form.value.ministry_active ? 'active' : 'inactive',
        nationality: form.value.nationality || null,
        occupation: form.value.occupation || null,
        company: form.value.company || null,
        photo_url: form.value.photo_url || null,
        origin_city_country: form.value.origin_city_country || null,
        church_name: form.value.church_name || null,
        serving_in_ministry: JSON.stringify(servingInMinistry),
      }

      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'
      const response = await fetch(`${apiBaseUrl}/members/${memberId.value}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const result = await response.json()
      if (!response.ok) {
        throw new Error(result.message || 'Failed to update member')
      }

      toast.showToast('Member updated successfully')
      closeEdit()
      onSaved?.()
    } catch (err) {
      toast.showToast(err instanceof Error ? err.message : 'Failed to update member', true)
    } finally {
      saving.value = false
    }
  }

  return {
    isOpen,
    loading,
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
  }
}
