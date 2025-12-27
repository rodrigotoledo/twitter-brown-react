import { useState } from 'react'
import { Send } from 'lucide-react'
import { useUser } from '../context/UserContext'

type Tweet = {
  id: string
  user: string
  content: string
}

type Props = {
  onPost: (tweet: Tweet) => void
}

const TweetForm = ({ onPost }: Props) => {
  const { user } = useUser()
  const [text, setText] = useState('')

  const handlePost = () => {
    if (text.trim()) {
      onPost({
        id: crypto.randomUUID(),
        user: user?.username || 'anonymous',
        content: text.trim(),
      })
      setText('')
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
        className="flex items-center gap-1 px-5 py-2 rounded font-semibold text-vscode-text bg-vscode-sidebar border border-vscode-border hover:bg-vscode-hover focus:outline-none focus:border-vscode-border transition shadow w-fit"
        title="Postar tweet"
      >
        <Send size={18} />
        Postar
      </button>
    </div>
  )
}

export default TweetForm
