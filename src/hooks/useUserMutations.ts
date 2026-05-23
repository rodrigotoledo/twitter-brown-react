import { useMutation, useQueryClient } from '@tanstack/react-query'
import { TOKEN_STORAGE_KEY } from '../context/UserContext'

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export const useFollowMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ username, isFollowing }: { username: string; isFollowing: boolean }) => {
      const token = localStorage.getItem(TOKEN_STORAGE_KEY)
      if (!token) throw new Error('Sign in to follow users.')

      const response = await fetch(`${apiUrl}/api/users/${username}/follow`, {
        method: isFollowing ? 'DELETE' : 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      const body = await response.json().catch(() => null)

      if (!response.ok) {
        throw new Error(body?.error?.message || 'Unable to update follow.')
      }

      return body?.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] })
      queryClient.invalidateQueries({ queryKey: ['user'] })
    },
  })
}
