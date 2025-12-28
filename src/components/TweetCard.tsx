import CommentForm from "./CommentForm";
import { useUser } from "../context/UserContext";
import { usePosts } from "../context/usePosts";
import type { Comment as PostComment } from "../context/PostsContext";
import PostActions from "./PostActions";
import { useState } from "react";
import { Link } from "react-router-dom";

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
  compact?: boolean;
  showComments?: boolean;
  theme?: "sidebar" | "home";
};

const TweetCard = ({
  id,
  user,
  content,
  title,
  tags,
  likes,
  dislikes,
  retweets,
  userName,
  userFullName,
  comments,
  compact = false,
  showComments = true,
  theme = "home",
}: Props) => {
  const { user: currentUser } = useUser();
  const { addComment } = usePosts();
  const [showCommentsState, setShowCommentsState] = useState(false);

  const handleAddComment = (c: PostComment) => {
    addComment(id, c);
  };

  // Tema baseado na prop
  const cardClasses =
    theme === "sidebar"
      ? "mb-3 bg-vscode-input p-3 rounded border border-vscode-border hover:bg-vscode-hover transition hover:shadow-lg hover:-translate-y-1 will-change-transform will-change-shadow will-change-bg"
      : "bg-vscode-sidebar p-4 rounded shadow-lg border border-vscode-border hover:border-vscode-accent transition flex flex-col mb-4 hover:shadow-2xl hover:-translate-y-1 will-change-transform will-change-shadow will-change-border-color";

  return (
    <div className={cardClasses}>
      <div className="flex items-center gap-2 mb-1">
        {theme === "sidebar" ? (
          <Link
            to={`/tweets/${userName || user}`}
            className="text-sm font-semibold text-vscode-accent hover:underline cursor-pointer"
          >
            @{userName || user}
          </Link>
        ) : (
          <p className="text-sm font-semibold text-vscode-accent">
            @{userName || user}
          </p>
        )}
        {userFullName && (
          <span className="text-xs text-vscode-text-muted">
            ({userFullName})
          </span>
        )}
      </div>
      {title && theme !== "sidebar" && (
        <h3 className="text-base font-bold mt-1 text-vscode-text">{title}</h3>
      )}
      <p
        className={
          theme === "sidebar"
            ? "text-sm text-vscode-text mt-1 truncate max-w-full block overflow-hidden text-ellipsis whitespace-nowrap"
            : "text-sm text-vscode-text mt-2"
        }
        title={typeof content === "string" ? content : JSON.stringify(content)}
      >
        {typeof content === "string" ? content : JSON.stringify(content)}
      </p>
      {tags && tags.length > 0 && theme !== "sidebar" && (
        <div className="flex flex-wrap gap-2 mt-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="bg-vscode-hover text-vscode-text-muted px-2 py-0.5 rounded text-xs"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}
      <div
        className={`flex mt-3 gap-4 text-xs text-vscode-text-muted items-center ${compact || theme === "sidebar" ? "space-x-2" : "space-x-4"}`}
      >
        <PostActions
          id={id}
          likes={likes}
          dislikes={dislikes}
          retweets={retweets}
          comments={comments}
          compact={compact || theme === "sidebar"}
          userName={userName || user}
          showComments={showComments}
          onToggleComments={() => setShowCommentsState((v) => !v)}
        />
      </div>

      {/* Comentários: só mostra se showComments for true e estiver na home */}
      {showComments && showCommentsState && theme !== "sidebar" && (
        <div className="mt-4">
          <CommentForm
            onAdd={handleAddComment}
            user={currentUser?.username || "anonymous"}
          />
          {comments && comments.length > 0 && (
            <div className="mt-2 space-y-2">
              {comments.map((c) => (
                <div
                  key={c.id}
                  className="bg-vscode-input border border-vscode-border rounded px-3 py-2 text-sm text-vscode-text"
                >
                  <span className="font-semibold text-vscode-accent">
                    @{typeof c.user === "string" ? c.user : c.user.username}
                  </span>
                  : {c.content}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TweetCard;
