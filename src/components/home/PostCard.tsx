import type { Post } from '../../types/post'

type Props = {
  post: Post
  onLike: (id: string) => void
  onRepost: (id: string) => void
  onComment: (id: string) => void
  onShare: (id: string) => void
  onFollow: (id: string) => void
}

const ActionButton = ({
  label,
  count,
  onClick,
}: {
  label: string
  count?: number
  onClick: () => void
}) => (
  <button
    type="button"
    onClick={onClick}
    className="flex items-center gap-1.5 text-cursor-muted hover:text-cursor-accent transition text-sm"
  >
    <span>{label}</span>
    {count !== undefined && <span>{count}</span>}
  </button>
)

const PostCard = ({ post, onLike, onRepost, onComment, onShare, onFollow }: Props) => (
  <article className="border-b border-cursor-border px-4 py-4 hover:bg-cursor/30 transition">
    <div className="flex gap-3">
      {post.author.avatar ? (
        <img
          src={post.author.avatar}
          alt=""
          className="w-10 h-10 rounded-full shrink-0 bg-cursor-dark"
        />
      ) : (
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-cursor-dark text-sm font-bold">
          {post.author.username.slice(0, 1).toUpperCase()}
        </div>
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="font-semibold truncate">{post.author.name}</p>
            <p className="text-sm text-cursor-muted truncate">@{post.author.username}</p>
          </div>
          {!post.isOwnPost && (
            <button
              type="button"
              onClick={() => onFollow(post.id)}
              className={`shrink-0 text-sm font-semibold px-3 py-1 rounded-full border transition ${
                post.isFollowing
                  ? 'border-cursor-border text-cursor-muted hover:border-red-500/50 hover:text-red-400'
                  : 'border-cursor-foreground bg-cursor-foreground text-cursor-dark hover:opacity-90'
              }`}
            >
              {post.isFollowing ? 'Following' : 'Follow'}
            </button>
          )}
        </div>

        <p className="mt-2 text-[15px] leading-relaxed whitespace-pre-wrap break-words">
          {post.content}
        </p>

        <div className="mt-3 flex flex-wrap items-center gap-4 sm:gap-6">
          <ActionButton label="Comment" count={post.comments} onClick={() => onComment(post.id)} />
          {!post.isOwnPost && (
            <>
              <ActionButton
                label={post.repostedByMe ? 'Reposted' : 'Repost'}
                count={post.reposts}
                onClick={() => onRepost(post.id)}
              />
              <ActionButton
                label={post.likedByMe ? 'Liked' : 'Like'}
                count={post.likes}
                onClick={() => onLike(post.id)}
              />
            </>
          )}
          <ActionButton label="↗ Share" onClick={() => onShare(post.id)} />
        </div>
      </div>
    </div>
  </article>
)

export default PostCard
