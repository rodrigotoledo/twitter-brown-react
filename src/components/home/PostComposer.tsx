import { useRef, useState } from 'react'
import { useToast } from '../../context/ToastContext'
import { MAX_POST_LENGTH } from '../../constants/post'
import type { Post } from '../../types/post'
import type { User } from '../../context/UserContext'

type Props = {
  user: User
  onPost: (content: string, idempotencyKey: string) => Promise<Post>
}

const inputClass =
  'w-full border border-cursor-border bg-cursor-light text-cursor-foreground p-3 rounded-lg outline-none focus:outline focus:outline-2 focus:outline-cursor-focus resize-none min-h-[48px]'

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const getAvatarUrl = (avatarUrl?: string) => {
  if (!avatarUrl) return ''
  return avatarUrl.startsWith('http') ? avatarUrl : `${apiUrl}${avatarUrl}`
}

const createIdempotencyKey = () => {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID()
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`
}

const PostComposer = ({ user, onPost }: Props) => {
  const { toast } = useToast()
  const [text, setText] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const isSubmittingRef = useRef(false)
  const idempotencyKeyRef = useRef<string | null>(null)
  const avatar = getAvatarUrl(user?.avatar_url)

  const charCount = text.length
  const isNearLimit = charCount >= MAX_POST_LENGTH - 20
  const isAtLimit = charCount >= MAX_POST_LENGTH
  const canPost = text.trim().length > 0 && charCount <= MAX_POST_LENGTH && !isSubmitting

  const handleChange = (value: string) => {
    setText(value.slice(0, MAX_POST_LENGTH))
    idempotencyKeyRef.current = null
  }

  const handlePost = async () => {
    if (isSubmittingRef.current) return
    if (!user) {
      toast.error('Sign in to post.')
      return
    }
    if (!text.trim()) {
      toast.warning('Write something before posting.')
      return
    }
    if (charCount > MAX_POST_LENGTH) {
      toast.error(`Posts are limited to ${MAX_POST_LENGTH} characters.`)
      return
    }

    const content = text.trim()
    const idempotencyKey = idempotencyKeyRef.current || createIdempotencyKey()
    idempotencyKeyRef.current = idempotencyKey
    isSubmittingRef.current = true
    setIsSubmitting(true)

    try {
      await onPost(content, idempotencyKey)
      setText('')
      idempotencyKeyRef.current = null
      toast.success('Your post was published.')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to publish your post.')
    } finally {
      isSubmittingRef.current = false
      setIsSubmitting(false)
    }
  }

  return (
    <div className="px-4 pb-4">
      <div className="flex justify-end mb-2">
        <span
          id="post-char-count"
          className={`text-sm tabular-nums ${
            isAtLimit
              ? 'text-red-400 font-semibold'
              : isNearLimit
                ? 'text-amber-400'
                : 'text-cursor-muted'
          }`}
          aria-live="polite"
        >
          {charCount}/{MAX_POST_LENGTH}
        </span>
      </div>

      <div className="flex gap-3 items-end">
        {user?.avatar_url ? (
          <img
            src={avatar}
            alt=""
            className="h-11 w-11 rounded-full object-cover shrink-0 bg-cursor-dark"
          />
        ) : (
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-cursor-dark text-base font-bold">
            {(user?.username || '?').slice(0, 1).toUpperCase()}
          </div>
        )}
        <div className="flex-1 flex flex-col sm:flex-row gap-2 sm:items-end min-w-0">
          <textarea
            value={text}
            onChange={(e) => handleChange(e.target.value)}
            placeholder="What's happening?"
            rows={2}
            maxLength={MAX_POST_LENGTH}
            className={inputClass}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                if (canPost) void handlePost()
              }
            }}
            aria-describedby="post-char-count"
          />
          <button
            type="button"
            onClick={() => void handlePost()}
            disabled={!canPost}
            className="shrink-0 bg-cursor-accent text-cursor-on-accent font-bold px-5 py-2.5 rounded-full hover:bg-cursor-accent-hover transition disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-cursor-accent"
          >
            {isSubmitting ? 'Posting...' : 'Post'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default PostComposer
