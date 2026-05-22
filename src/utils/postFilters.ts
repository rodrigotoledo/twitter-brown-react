import type { Post, PostFilter } from '../types/post'

const startOfDay = (date: Date) => {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  return d
}

const endOfDay = (date: Date) => {
  const d = new Date(date)
  d.setHours(23, 59, 59, 999)
  return d
}

const isInRange = (post: Post, start: Date, end: Date) => {
  const time = post.createdAt.getTime()
  return time >= start.getTime() && time <= end.getTime()
}

export const filterPosts = (posts: Post[], filter: PostFilter): Post[] => {
  const now = new Date()
  const todayStart = startOfDay(now)
  const todayEnd = endOfDay(now)

  const yesterday = new Date(now)
  yesterday.setDate(yesterday.getDate() - 1)
  const yesterdayStart = startOfDay(yesterday)
  const yesterdayEnd = endOfDay(yesterday)

  const thisWeekStart = new Date(now)
  thisWeekStart.setDate(now.getDate() - now.getDay())
  thisWeekStart.setHours(0, 0, 0, 0)

  const lastWeekEnd = new Date(thisWeekStart)
  lastWeekEnd.setMilliseconds(-1)
  const lastWeekStart = new Date(thisWeekStart)
  lastWeekStart.setDate(lastWeekStart.getDate() - 7)

  const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1)
  const thisYearStart = new Date(now.getFullYear(), 0, 1)

  switch (filter) {
    case 'latest50':
      return posts.slice(0, 50)
    case 'today':
      return posts.filter((p) => isInRange(p, todayStart, todayEnd))
    case 'yesterday':
      return posts.filter((p) => isInRange(p, yesterdayStart, yesterdayEnd))
    case 'thisWeek':
      return posts.filter((p) => isInRange(p, thisWeekStart, todayEnd))
    case 'lastWeek':
      return posts.filter((p) => isInRange(p, lastWeekStart, lastWeekEnd))
    case 'thisMonth':
      return posts.filter((p) => isInRange(p, thisMonthStart, todayEnd))
    case 'thisYear':
      return posts.filter((p) => isInRange(p, thisYearStart, todayEnd))
    default:
      return posts
  }
}

export const searchPosts = (posts: Post[], query: string): Post[] => {
  const q = query.trim().toLowerCase()
  if (!q) return posts
  return posts.filter(
    (p) =>
      p.content.toLowerCase().includes(q) ||
      p.author.name.toLowerCase().includes(q) ||
      p.author.username.toLowerCase().includes(q)
  )
}

export const POST_FILTER_OPTIONS: { value: PostFilter; label: string }[] = [
  { value: 'latest50', label: 'Latest 50' },
  { value: 'today', label: 'Today' },
  { value: 'yesterday', label: 'Yesterday' },
  { value: 'thisWeek', label: 'This week' },
  { value: 'lastWeek', label: 'Last week' },
  { value: 'thisMonth', label: 'This month' },
  { value: 'thisYear', label: 'This year' },
]
