import { useQueryClient } from "@tanstack/react-query";
import { Send } from "lucide-react";
import { useState } from "react";
import { API_URL } from "../lib/api";
import { usePosts } from "../context/usePosts";

type Tweet = {
  id: string;
  user: string;
  content: string;
};

type Props = {
  onPost: (tweet: Tweet) => void;
  onError?: (error: string) => void;
};

const TweetForm = ({ onPost, onError }: Props) => {
  const { refetchLatest } = usePosts();
  // const { user } = useUser() // user not used
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  const handlePost = async () => {
    if (!text.trim()) return;
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const headers = {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };
      const res = await fetch(`${API_URL}/tweets`, {
        method: "POST",
        headers,
        body: JSON.stringify({ content: text.trim() }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Error posting tweet");
      }
      const data = await res.json();
      // API simplificada retorna dados diretos
      const tweet = {
        id: String(data.id),
        user: data.creatorUsername,
        content: data.content,
        likes: data.likes,
        dislikes: data.dislikes,
        retweets: data.retweets,
        userName: data.creatorUsername,
        userFullName: undefined,
        comments: data.comments.map((comment: { id: number; creatorUsername: string; content: string }) => ({
          id: String(comment.id),
          user: comment.creatorUsername,
          content: comment.content,
        })),
        createdAt: data.createdAt,
      };
      onPost(tweet);
      setText("");
      // Invalida queries para atualizar listas
      queryClient.invalidateQueries({ queryKey: ["latestTweets"] });
      if (tweet?.userName) {
        queryClient.invalidateQueries({
          queryKey: ["userTweetsByUsername", tweet.userName],
        });
      }
      // Refetch imediato do latestTweets para garantir atualização do SideBar
      if (refetchLatest) await refetchLatest();
    } catch (err) {
      if (onError && err instanceof Error) onError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col space-y-3">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="w-full rounded-xl border border-vscode-border bg-vscode-input px-4 py-3 text-vscode-text outline-none placeholder-vscode-text-muted focus:border-vscode-accent focus:ring-1 focus:ring-vscode-accent/30"
        placeholder="What's happening?"
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            handlePost();
          }
        }}
      />
      <button
        onClick={handlePost}
        className="inline-flex items-center gap-2 rounded-full bg-vscode-accent px-5 py-2 text-sm font-bold text-vscode-accent-ink transition hover:bg-vscode-accent-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-vscode-accent/50 disabled:opacity-60"
        title="Post tweet"
        disabled={loading}
      >
        <Send size={18} aria-hidden />
        {loading ? "Posting..." : "Post"}
      </button>
    </div>
  );
};

export default TweetForm;
