import type { StatusFilter } from "./types"

export const isStatusFilter = (key: string): key is StatusFilter => {
  return (
    key === 'all' || key === 'inWork' || key === 'completed'
  )
}