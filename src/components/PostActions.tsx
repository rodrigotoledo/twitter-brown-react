import { usePosts } from "../context/usePosts";
import { useUser } from "../context/UserContext";
import { Heart, ThumbsDown, Repeat2, MessageCircle } from "lucide-react";
import { Comment } from "../context/PostsContext";

type Props = {
  id: string;
  likes?: number;
  dislikes?: number;
  retweets?: number;
  comments?: Comment[];
  compact?: boolean;
  userName?: string;
  showComments?: boolean;
  onToggleComments?: () => void;
};

const PostActions = ({
  id,
  likes,
  dislikes,
  retweets,
  comments,
  compact,
  userName,
  showComments,
  onToggleComments,
}: Props) => {
  const { user: currentUser } = useUser();
  const { likePost, dislikePost, retweetPost, userInteractions } = usePosts();

  const liked = !!userInteractions[id]?.liked;
  const disliked = !!userInteractions[id]?.disliked;
  const retweeted = !!userInteractions[id]?.retweeted;

  const likesCount = Array.isArray(likes)
    ? likes.length
    : typeof likes === "number"
      ? likes
      : 0;
  const dislikesCount = Array.isArray(dislikes)
    ? dislikes.length
    : typeof dislikes === "number"
      ? dislikes
      : 0;
  const retweetsCount = Array.isArray(retweets)
    ? retweets.length
    : typeof retweets === "number"
      ? retweets
      : 0;
  const commentsCount = comments?.length || 0;

  const handleLike = () => {
    if (!liked) {
      likePost(id);
    }
  };
  const handleDislike = () => {
    if (!disliked) {
      dislikePost(id);
    }
  };
  const handleRetweet = () => {
    if (!retweeted) {
      retweetPost(id);
    }
  };

  const handleComment = () => {
    if (onToggleComments) {
      onToggleComments();
    }
  };

  const base = compact ? "space-x-2 text-xs" : "space-x-4 text-xs";

  const isOwnTweet =
    currentUser?.username && userName && currentUser.username === userName;
  return (
    <div className={`flex mt-3 ${base} text-vscode-text-muted items-center`}>
      <span
        className={`${showComments ? "hover:text-vscode-accent cursor-pointer" : ""} transition flex items-center gap-1`}
        onClick={showComments ? handleComment : undefined}
        title={showComments ? (isOwnTweet ? "View comments" : "Comment") : undefined}
      >
        <MessageCircle size={compact ? 16 : 20} strokeWidth={1.8} />
        {commentsCount}
      </span>
      <span
        className={`hover:text-vscode-accent cursor-pointer transition flex items-center gap-1 ${liked ? "text-vscode-accent" : ""} ${isOwnTweet ? "opacity-50 pointer-events-none" : ""}`}
        onClick={isOwnTweet ? undefined : handleLike}
        title={isOwnTweet ? "You cannot like your own tweet" : "Like"}
      >
        <Heart
          size={compact ? 16 : 20}
          fill={liked ? "currentColor" : "none"}
          strokeWidth={1.8}
        />
        {likesCount}
      </span>
      <span
        className={`hover:text-vscode-accent cursor-pointer transition flex items-center gap-1 ${disliked ? "text-vscode-accent" : ""} ${isOwnTweet ? "opacity-50 pointer-events-none" : ""}`}
        onClick={isOwnTweet ? undefined : handleDislike}
        title={
          isOwnTweet
            ? "You cannot dislike your own tweet"
            : "Dislike"
        }
      >
        <ThumbsDown
          size={compact ? 16 : 20}
          fill={disliked ? "currentColor" : "none"}
          strokeWidth={1.8}
        />
        {dislikesCount}
      </span>
      <span
        className={`hover:text-vscode-accent cursor-pointer transition flex items-center gap-1 ${retweeted ? "text-vscode-accent" : ""} ${isOwnTweet ? "opacity-50 pointer-events-none" : ""}`}
        onClick={isOwnTweet ? undefined : handleRetweet}
        title={
          isOwnTweet ? "You cannot retweet your own tweet" : "Retweet"
        }
      >
        <Repeat2 size={compact ? 16 : 20} strokeWidth={1.8} />
        {retweetsCount}
      </span>
    </div>
  );
};

export default PostActions;
