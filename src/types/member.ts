export interface SocialMediaEntry {
  type: string
  username: string
}

export interface ServingInMinistryEntry {
  ministry: string
  role?: string
  start_date?: string
}

export interface Member {
  id: string
  seq_id?: number
  member_no: string | null
  first_name: string
  middle_name: string | null
  last_name: string
  suffix: string | null
  gender: string | null
  birth_date: string | null
  visit_date: string
  civil_status: string
  mobile_number: string | null
  email: string | null
  address: string
  heard_about_us: string
  membership_type: string | null
  household_name: string | null
  prayer_request: string | null
  social_media: SocialMediaEntry[] | string | null
  visit_details: string
  interests: string[] | string | null
  networks: string | null
  status_type: string | null
  last_follow_up_date: string | null
  followed_up_by: string | null
  belong_class_status: string | null
  baptism_status: string | null
  bstudy_type: string | null
  ministry_status: string | null
  nationality: string | null
  occupation: string | null
  company: string | null
  photo_url: string | null
  origin_city_country: string | null
  church_name: string | null
  serving_in_ministry: ServingInMinistryEntry[] | string | null
  created_at?: string
  updated_at?: string
}

export interface MemberEditForm {
  member_no: string
  first_name: string
  middle_name: string
  last_name: string
  suffix: string
  gender: string
  birth_date: string
  visit_date: string
  civil_status: string
  mobile_number: string
  email: string
  address: string
  heard_about_us: string
  heard_about_us_choice: string
  heard_about_us_specify: string
  membership_type: string
  household_name: string
  prayer_request: string
  social_media: SocialMediaEntry[]
  visit_details: string
  interests: string[]
  networks: string
  status_type: string
  last_follow_up_date: string
  followed_up_by: string
  belong_class_completed: boolean
  baptism_completed: boolean
  bible_study_active: boolean
  ministry_active: boolean
  nationality: string
  occupation: string
  company: string
  photo_url: string
  origin_city_country: string
  church_name: string
  serving_in_ministry: string[]
}
