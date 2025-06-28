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
    <div className="flex flex-col space-y-2">
      <input
        type='text'
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="w-full p-3 text-black rounded resize-none outline-none"
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
        className="px-4 py-2 rounded bg-brown-dark border-amber-100 border-1 w-fit"
      >
        Post
      </button>
    </div>
  )
}

export default TweetForm
