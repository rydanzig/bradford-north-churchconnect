export const INTEREST_OPTIONS = [
  { value: 'Spiritual Counseling', label: '🕊️ Spiritual Counseling' },
  { value: 'Join a BS Group', label: '📖 Join a Bible Study Group' },
  { value: 'Knowing more about Christianity', label: '✝ Knowing More About Christianity' },
  { value: 'Serving in Ministry', label: '🙌 Serving in Ministry' },
  { value: 'Want to serve as a volunteer', label: '🙋 Want to serve as a volunteer' },
  { value: 'Becoming a Member', label: '🏛️ Becoming a Member' },
  { value: 'Staying Updated', label: '📢 Staying Updated About Events & Activities' },
  { value: 'Connecting to a Network', label: '🤝 Connecting to a Network' },
] as const

export const MINISTRY_OPTIONS = [
  { value: "Children's Ministry", label: "👶 Children's Ministry" },
  { value: 'Youth Ministry', label: '🧑 Youth Ministry' },
  { value: 'Worship / Choir', label: '🎵 Worship / Choir' },
  { value: 'Community Outreach', label: '🤲 Community Outreach' },
  { value: "Men's / Women's Group", label: "👥 Men's / Women's Group" },
] as const

export const CIVIL_STATUS_OPTIONS = ['Single', 'Married', 'Widowed'] as const

export const GENDER_OPTIONS = ['Male', 'Female'] as const

export const MEMBERSHIP_STATUS_OPTIONS = [
  'Yes',
  'No',
  'Not Applicable',
] as const

export const STATUS_TYPE_OPTIONS = ['active', 'inactive', 'visitor'] as const

export const VISIT_DETAILS_OPTIONS = [
  'First Time Visitor',
  'Returning Visitor',
  'Visiting from Another Place',
  'Member of Another Church',
] as const

export const HEARD_ABOUT_US_OPTIONS = [
  'Friend / Family',
  'Social Media',
  'Website',
  'Drive By',
  'Community Event',
  'Others',
] as const

export const NETWORKS_OPTIONS = [
  'youth',
  'young professionals',
  'couples',
  'seniors',
] as const

export const SERVING_IN_MINISTRY_INTEREST = 'Serving in Ministry'

export const YES_NO_FILTER_OPTIONS = [
  { value: '', label: 'All' },
  { value: 'yes', label: 'Yes' },
  { value: 'no', label: 'No' },
] as const

const VISIT_YEAR_START = 2023

export const VISIT_YEAR_OPTIONS = Array.from(
  { length: new Date().getFullYear() - VISIT_YEAR_START + 1 },
  (_, index) => String(VISIT_YEAR_START + index),
).reverse()
