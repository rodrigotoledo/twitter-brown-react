import { useState } from 'react'
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
        className="w-full p-3 bg-vscode-input text-vscode-text rounded outline-none border border-vscode-border focus:ring-2 focus:ring-vscode-accent placeholder-vscode-text-muted"
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
        className="px-5 py-2 rounded bg-vscode-accent text-white hover:bg-vscode-accent-hover transition w-fit font-semibold"
      >
        Post
      </button>
    </div>
  )
}

export default TweetForm
