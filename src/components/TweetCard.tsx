
import CommentForm from './CommentForm'
import { useUser } from '../context/UserContext'
import { usePosts } from '../context/usePosts'
import type { Comment as PostComment } from '../context/PostsContext'
import PostActions from './PostActions'
import { useState } from 'react'

type Props = {
  id: string;
  user: string;
  content: string;
  title?: string;
  tags?: string[];
  likes?: number;
  dislikes?: number;
  retweets?: number;
  userName?: string;
  userFullName?: string;
  comments?: PostComment[];
}


const TweetCard = ({ id, user, content, title, tags, likes, dislikes, retweets, userName, userFullName, comments }: Props) => {
  const { user: currentUser } = useUser();
  const { addComment } = usePosts();
  const [showComments, setShowComments] = useState(false);

  const handleAddComment = (c: PostComment) => {
    addComment(id, c);
  };

  return (
    <div
      className="bg-vscode-sidebar p-4 rounded shadow-lg border border-vscode-border hover:border-vscode-accent transition flex flex-col mb-4 hover:shadow-2xl hover:-translate-y-1 will-change-transform will-change-shadow will-change-border-color"
    >
      <div className="flex items-center gap-2 mb-1">
        <p className="text-sm font-semibold text-vscode-accent">@{userName || user}</p>
        {userFullName && <span className="text-xs text-vscode-text-muted">({userFullName})</span>}
      </div>
      {title && <h3 className="text-base font-bold mt-1 text-vscode-text">{title}</h3>}
      <p className="text-sm text-vscode-text mt-2">{content}</p>
      {tags && tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {tags.map((tag) => (
            <span key={tag} className="bg-vscode-hover text-vscode-text-muted px-2 py-0.5 rounded text-xs">#{tag}</span>
          ))}
        </div>
      )}
      <div className="flex mt-3 gap-4 text-xs text-vscode-text-muted items-center">
        {currentUser?.username !== user && (
          <button
            className="flex mt-3 items-center gap-1 hover:text-vscode-accent cursor-pointer transition font-medium focus:outline-none"
            onClick={() => setShowComments((v) => !v)}
            type="button"
            title="Comentar"
          >
            {/* Ícone Lucide para comentário */}
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-message-circle"><path d="M21 11.5a8.38 8.38 0 0 1-1.9 5.4A8.5 8.5 0 0 1 12 21a8.38 8.38 0 0 1-5.4-1.9L3 21l1.9-5.4A8.38 8.38 0 0 1 3 11.5a8.5 8.5 0 1 1 17 0Z"></path></svg>
            <span>Comment</span>
          </button>
        )}
        <PostActions id={id} likes={likes} dislikes={dislikes} retweets={retweets} />
      </div>

      {/* Comentários: só mostra se showComments for true */}
      {showComments && (
        <div className="mt-4">
          <CommentForm onAdd={handleAddComment} user={currentUser?.username || 'anonymous'} />
          {comments && comments.length > 0 && (
            <div className="mt-2 space-y-2">
              {comments.map((c) => (
                <div key={c.id} className="bg-vscode-input border border-vscode-border rounded px-3 py-2 text-sm text-vscode-text">
                  <span className="font-semibold text-vscode-accent">@{c.user}</span>: {c.content}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default TweetCard
