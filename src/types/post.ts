export type PostAuthor = {
  name: string
  username: string
  avatar: string
}

export type Post = {
  id: string
  author: PostAuthor
  content: string
  createdAt: Date
  likes: number
  reposts: number
  comments: number
  likedByMe: boolean
  repostedByMe: boolean
  isOwnPost: boolean
  isFollowing: boolean
}

export type PostFilter =
  | 'latest50'
  | 'today'
  | 'yesterday'
  | 'thisWeek'
  | 'lastWeek'
  | 'thisMonth'
  | 'thisYear'
