export interface DashboardStatusBreakdown {
  completed?: number
  not_completed?: number
  active?: number
  inactive?: number
}

export interface DashboardInterestStat {
  interest: string
  count: number
}

export interface DashboardStats {
  visit_year: string
  total_visitors: number
  belong_class: {
    completed: number
    not_completed: number
  }
  baptism: {
    completed: number
    not_completed: number
  }
  ministry: {
    active: number
    inactive: number
  }
  bible_study: {
    active: number
    inactive: number
  }
  interests: DashboardInterestStat[]
}

export type DashboardMemberCategory =
  | 'all'
  | 'belong_class'
  | 'baptism'
  | 'ministry'
  | 'bible_study'
  | 'interest'

export interface DashboardMemberRow {
  id: string
  first_name: string
  last_name: string
  mobile_number: string | null
  email: string | null
  address: string
}
