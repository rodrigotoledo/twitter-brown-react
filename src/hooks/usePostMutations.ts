import { useMutation, useQueryClient } from '@tanstack/react-query'
import { TOKEN_STORAGE_KEY } from '../context/UserContext'

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export const useCreatePostMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ content, idempotencyKey }: { content: string; idempotencyKey: string }) => {
      const token = localStorage.getItem(TOKEN_STORAGE_KEY)
      if (!token) throw new Error('Sign in to post.')

      const response = await fetch(`${apiUrl}/api/posts/`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Idempotency-Key': idempotencyKey,
        },
        body: JSON.stringify({ content }),
      })
      const body = await response.json().catch(() => null)

      if (!response.ok) {
        throw new Error(body?.error?.message || 'Unable to publish your post.')
      }

      if (!body?.data) {
        throw new Error('Post response was missing data.')
      }

      return body?.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] })
    },
  })
}

export const useLikePostMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ postId, isLiked }: { postId: string; isLiked: boolean }) => {
      const token = localStorage.getItem(TOKEN_STORAGE_KEY)
      if (!token) throw new Error('Sign in to like posts.')

      const response = await fetch(`${apiUrl}/api/posts/${postId}/like`, {
        method: isLiked ? 'DELETE' : 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      const body = await response.json().catch(() => null)

      if (!response.ok) {
        throw new Error(body?.error?.message || 'Unable to like this post.')
      }

      return body?.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] })
    },
  })
}

export const useRepostMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ postId, isReposted }: { postId: string; isReposted: boolean }) => {
      const token = localStorage.getItem(TOKEN_STORAGE_KEY)
      if (!token) throw new Error('Sign in to repost.')

      const response = await fetch(`${apiUrl}/api/posts/${postId}/repost`, {
        method: isReposted ? 'DELETE' : 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      const body = await response.json().catch(() => null)

      if (!response.ok) {
        throw new Error(body?.error?.message || 'Unable to repost.')
      }

      return body?.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] })
    },
  })
}

export const useCreateCommentMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ postId, content }: { postId: string; content: string }) => {
      const token = localStorage.getItem(TOKEN_STORAGE_KEY)
      if (!token) throw new Error('Sign in to comment.')

      const response = await fetch(`${apiUrl}/api/posts/${postId}/comments`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }),
      })
      const body = await response.json().catch(() => null)

      if (!response.ok) {
        throw new Error(body?.error?.message || 'Unable to post comment.')
      }

      return body?.data
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['comments', variables.postId] })
      queryClient.invalidateQueries({ queryKey: ['posts'] })
    },
  })
}
