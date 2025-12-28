import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query';
import { usePosts } from '../context/usePosts';
import { Send } from 'lucide-react'


type Tweet = {
  id: string
  user: string
  content: string
}

type Props = {
  onPost: (tweet: Tweet) => void
  onError?: (error: string) => void
}


const TweetForm = ({ onPost, onError }: Props) => {
    const { refetchLatest } = usePosts();
  // const { user } = useUser() // user not used
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const queryClient = useQueryClient();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handlePost = async () => {
    if (!text.trim()) return;
    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      const apiUrl = import.meta.env.VITE_API_URL || '';
      const headers = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };
      const res = await fetch(`${apiUrl}/tweets`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ content: text.trim() }),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.message || 'Erro ao postar tweet')
      }
      const data = await res.json()
      // Ajuste: garantir que user seja string (username)
      const tweet = {
        ...data,
        user: typeof data.user === 'object' && data.user?.username ? data.user.username : data.user,
        userName: data.user?.username || undefined,
        userFullName: data.user?.name || undefined,
      };
      onPost(tweet)
      setText('')
      // Invalida queries para atualizar listas
      queryClient.invalidateQueries({ queryKey: ['latestTweets'] });
      if (user?.username) {
        queryClient.invalidateQueries({ queryKey: ['userTweets', user.username] });
      }
      // Refetch imediato do latestTweets para garantir atualização do SideBar
      if (refetchLatest) await refetchLatest();
    } catch (err) {
      if (onError && err instanceof Error) onError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col space-y-3">
      <input
        type='text'
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="w-full p-3 bg-vscode-input text-vscode-text rounded outline-none border border-vscode-border focus:border-vscode-border placeholder-vscode-text-muted"
        placeholder="What's happening?"
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            handlePost();
          }
        }}
      />
      <button
        onClick={handlePost}
        className="flex items-center gap-1 px-5 py-2 rounded font-semibold text-vscode-text bg-vscode-sidebar border border-vscode-border hover:bg-vscode-hover focus:outline-none focus:border-vscode-border transition shadow w-fit disabled:opacity-60"
        title="Postar tweet"
        disabled={loading}
      >
        <Send size={18} />
        {loading ? 'Postando...' : 'Postar'}
      </button>
    </div>
  )
}

export default TweetForm
