import { usePosts } from '../context/usePosts';
import { useUser } from '../context/UserContext';
import { useState } from 'react';
import { Heart, ThumbsDown, Repeat2 } from 'lucide-react';

type Props = {
  id: string;
  likes?: number;
  dislikes?: number;
  retweets?: number;
  compact?: boolean;
  userName?: string;
};

const PostActions = ({ id, likes, dislikes, retweets, compact, userName }: Props) => {
  const { user: currentUser } = useUser();
  const { likePost, dislikePost, retweetPost } = usePosts();
  const [liked, setLiked] = useState(!!localStorage.getItem(`like_${id}`));
  const [disliked, setDisliked] = useState(!!localStorage.getItem(`dislike_${id}`));
  const [retweeted, setRetweeted] = useState(!!localStorage.getItem(`retweet_${id}`));

  const handleLike = () => {
    if (!liked) {
      likePost(id);
      setLiked(true);
    }
  };
  const handleDislike = () => {
    if (!disliked) {
      dislikePost(id);
      setDisliked(true);
    }
  };
  const handleRetweet = () => {
    if (!retweeted) {
      retweetPost(id);
      setRetweeted(true);
    }
  };

  const base = compact ? 'space-x-2 text-xs' : 'space-x-4 text-xs';

  const isOwnTweet = currentUser?.username && userName && currentUser.username === userName;
  return (
    <div className={`flex mt-3 ${base} text-vscode-text-muted items-center`}>
      <span
        className={`hover:text-vscode-accent cursor-pointer transition flex items-center gap-1 ${liked ? 'text-vscode-accent' : ''} ${isOwnTweet ? 'opacity-50 pointer-events-none' : ''}`}
        onClick={isOwnTweet ? undefined : handleLike}
        title={isOwnTweet ? 'Você não pode curtir seu próprio tweet' : 'Like'}
      >
        <Heart size={compact ? 16 : 20} fill={liked ? 'currentColor' : 'none'} strokeWidth={1.8} />
        {likes ?? 0}
      </span>
      <span
        className={`hover:text-vscode-accent cursor-pointer transition flex items-center gap-1 ${disliked ? 'text-vscode-accent' : ''} ${isOwnTweet ? 'opacity-50 pointer-events-none' : ''}`}
        onClick={isOwnTweet ? undefined : handleDislike}
        title={isOwnTweet ? 'Você não pode dar dislike no seu próprio tweet' : 'Dislike'}
      >
        <ThumbsDown size={compact ? 16 : 20} fill={disliked ? 'currentColor' : 'none'} strokeWidth={1.8} />
        {dislikes ?? 0}
      </span>
      <span
        className={`hover:text-vscode-accent cursor-pointer transition flex items-center gap-1 ${retweeted ? 'text-vscode-accent' : ''}`}
        onClick={handleRetweet}
        title="Retweet"
      >
        <Repeat2 size={compact ? 16 : 20} strokeWidth={1.8} />
        {retweets ?? 0}
      </span>
    </div>
  );
};

export default PostActions;
