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
    <div className="mb-6">
      <textarea
        rows={3}
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="w-full p-3 text-black rounded resize-none outline-none"
        placeholder="What's happening?"
      />
      <button
        onClick={handlePost}
        className="mt-2 bg-brown px-4 py-2 rounded hover:bg-brown-dark"
      >
        Post
      </button>
    </div>
  )
}

export default TweetForm
