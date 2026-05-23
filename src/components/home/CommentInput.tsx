import { useState } from 'react'

const MAX_COMMENT_LENGTH = 280

interface Props {
  onSubmit: (content: string) => void
  isLoading?: boolean
  userAvatar?: string
}

const CommentInput = ({ onSubmit, isLoading = false, userAvatar }: Props) => {
  const [content, setContent] = useState('')

  const handleSubmit = () => {
    if (content.trim()) {
      onSubmit(content.trim())
      setContent('')
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      handleSubmit()
    }
  }

  return (
    <div className="bg-cursor-dark/20 px-4 py-3 space-y-3 border-l-2 border-cursor-accent">
      <div className="flex gap-3">
        {userAvatar ? (
          <img
            src={userAvatar}
            alt="Your avatar"
            className="w-8 h-8 rounded-full shrink-0"
          />
        ) : (
          <div className="w-8 h-8 rounded-full shrink-0 bg-cursor-accent/30" />
        )}
        <div className="flex-1">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value.slice(0, MAX_COMMENT_LENGTH))}
            onKeyDown={handleKeyDown}
            placeholder="Add a comment..."
            className="w-full resize-none bg-cursor-light text-cursor-foreground placeholder-cursor-muted outline-none text-sm rounded p-2"
            rows={2}
          />
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-cursor-muted">
              {content.length}/{MAX_COMMENT_LENGTH}
            </span>
            <button
              onClick={handleSubmit}
              disabled={!content.trim() || isLoading}
              className="px-3 py-1 bg-blue-500 text-white text-sm rounded-full font-semibold hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {isLoading ? '...' : 'Reply'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CommentInput
