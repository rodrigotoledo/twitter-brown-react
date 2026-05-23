import { useQuery } from '@tanstack/react-query'
import { TOKEN_STORAGE_KEY } from '../context/UserContext'
import type { Post } from '../types/post'

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000'

type ApiPost = {
  id: string
  content: string
  created_at: string
  likes_count: number
  reposts_count: number
  comments_count: number
  liked_by_me: boolean
  reposted_by_me: boolean
  is_own_post: boolean
  is_following_author: boolean
  user: {
    name: string
    username: string
    avatar_url?: string
  }
}

const getAvatarUrl = (avatarUrl?: string) => {
  if (!avatarUrl) return ''
  return avatarUrl.startsWith('http') ? avatarUrl : `${apiUrl}${avatarUrl}`
}

const mapApiPost = (post: ApiPost): Post => ({
  id: post.id,
  author: {
    name: post.user.name,
    username: post.user.username,
    avatar: getAvatarUrl(post.user.avatar_url),
  },
  content: post.content,
  createdAt: new Date(post.created_at),
  likes: post.likes_count,
  reposts: post.reposts_count,
  comments: post.comments_count,
  likedByMe: post.liked_by_me,
  repostedByMe: post.reposted_by_me,
  isOwnPost: post.is_own_post,
  isFollowing: post.is_following_author,
})

export const usePostsQuery = () => {
  return useQuery({
    queryKey: ['posts'],
    queryFn: async () => {
      const token = localStorage.getItem(TOKEN_STORAGE_KEY)
      const headers: HeadersInit = token ? { Authorization: `Bearer ${token}` } : {}

      const response = await fetch(`${apiUrl}/api/posts/?limit=200`, { headers })
      const body = await response.json().catch(() => null)

      if (!response.ok) {
        throw new Error(body?.error?.message || 'Unable to load posts.')
      }

      return (body?.data || []).map(mapApiPost)
    },
  })
}

export const useCommentsQuery = (postId: string) => {
  return useQuery({
    queryKey: ['comments', postId],
    queryFn: async () => {
      const token = localStorage.getItem(TOKEN_STORAGE_KEY)
      const headers: HeadersInit = token ? { Authorization: `Bearer ${token}` } : {}

      const response = await fetch(`${apiUrl}/api/posts/${postId}/comments?limit=50`, {
        headers,
      })
      const body = await response.json().catch(() => null)

      if (!response.ok) {
        throw new Error(body?.error?.message || 'Unable to load comments.')
      }

      return (body?.data || []).map((c: any) => ({
        id: c.id,
        content: c.content,
        created_at: c.created_at,
        user: {
          id: c.user.id,
          name: c.user.name,
          username: c.user.username,
          avatar_url: c.user.avatar_url,
        },
      }))
    },
    enabled: !!postId,
  })
}
