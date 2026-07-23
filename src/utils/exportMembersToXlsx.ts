import * as XLSX from 'xlsx'
import type { Member } from '@/types/member'

export function exportDisplayedMembersToXlsx(members: Member[]) {
  const rows = members.map((member) => ({
    Name: `${member.first_name} ${member.last_name}`.trim(),
    Phone: member.mobile_number || '',
    Address: member.address || '',
    'Email Address': member.email || '',
    'Belong Class Completed': member.belong_class_status === 'completed' ? 'Yes' : 'No',
    Baptized: member.baptism_status === 'completed' ? 'Yes' : 'No',
  }))

  const worksheet = XLSX.utils.json_to_sheet(rows)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Members')

  const date = new Date().toISOString().slice(0, 10)
  XLSX.writeFile(workbook, `members-page-${date}.xlsx`)
}
