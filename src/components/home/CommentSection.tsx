interface Comment {
  id: string
  content: string
  created_at: string
  user: {
    id: string
    name: string
    username: string
    avatar_url?: string
  }
}

interface Props {
  comments: Comment[]
  isLoadingComments?: boolean
  showInput?: boolean
  onCommentAdded?: () => void
}

const formatTime = (dateString: string) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  return date.toLocaleDateString()
}

const CommentSection = ({
  comments,
  isLoadingComments = false,
  showInput = false,
  onCommentAdded,
}: Props) => {
  if (!showInput && comments.length === 0) return null

  return (
    <div className="bg-cursor-dark/20 border-l-2 border-cursor-accent px-4 py-3 space-y-2">
      {comments.length > 0 && (
        <>
          <div className="text-xs font-semibold text-cursor-muted uppercase tracking-wider">
            {comments.length} {comments.length === 1 ? 'Reply' : 'Replies'}
          </div>
          {isLoadingComments ? (
            <p className="text-sm text-cursor-muted py-2">Loading comments...</p>
          ) : (
            <div className="space-y-2">
              {comments.map((comment) => (
                <div key={comment.id} className="flex gap-2">
                  <div className="shrink-0 pt-0.5">
                    {comment.user.avatar_url ? (
                      <img
                        src={comment.user.avatar_url}
                        alt={comment.user.name}
                        className="w-7 h-7 rounded-full"
                      />
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-cursor-accent/20" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-xs">{comment.user.name}</span>
                      <span className="text-cursor-muted text-xs">@{comment.user.username}</span>
                      <span className="text-cursor-muted text-xs">
                        {formatTime(comment.created_at)}
                      </span>
                    </div>
                    <p className="text-xs mt-1 whitespace-pre-wrap break-all">
                      {comment.content}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default CommentSection
