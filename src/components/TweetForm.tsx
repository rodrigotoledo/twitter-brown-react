import { useState } from 'react'
import { useUser } from '../context/UserContext'
import FormField from './FormField'
import { useToast } from '../context/ToastContext'

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
  const { toast } = useToast()
  const [text, setText] = useState('')

  const handlePost = () => {
    if (!text.trim()) {
      toast.warning('Write something before posting.')
      return
    }
    onPost({
      id: crypto.randomUUID(),
      user: user?.username || 'anonymous',
      content: text.trim(),
    })
    setText('')
    toast.success('Your post was published.')
  }

  return (
    <div className="flex flex-col space-y-2">
      <FormField
        id="tweet-content"
        label="What's happening?"
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault()
            handlePost()
          }
        }}
      />
      <button
        onClick={handlePost}
        className="px-4 py-2 rounded bg-cursor-accent text-cursor-on-accent hover:bg-cursor-accent-hover w-fit"
      >
        Post
      </button>
    </div>
  )
}

export default TweetForm
