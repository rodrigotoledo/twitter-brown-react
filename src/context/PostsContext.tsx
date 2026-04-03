import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createContext, ReactNode, useEffect, useRef, useState } from "react";
import { API_URL } from "../lib/api";
import { feedQueryOptions } from "../lib/queryDefaults";
import { useUser } from "./UserContext";

// Types
export type Comment = {
  id: string;
  user: string | { id: number; username: string; name: string; email: string };
  content: string;
};

export type Post = {
  id: string;
  user: string;
  content: string;
  title?: string;
  tags?: string[];
  likes?: number;
  dislikes?: number;
  views?: number;
  retweets?: number;
  userName?: string;
  userFullName?: string;
  comments?: Comment[];
};

// Types
type ApiTweet = {
  id: number;
  content: string;
  creatorId: number;
  creatorUsername: string;
  likes: number;
  dislikes: number;
  retweets: number;
  comments: ApiComment[];
  createdAt: string;
};

type ApiComment = {
  id: number;
  content: string;
  creatorId: number;
  creatorUsername: string;
  createdAt: string;
};

// Context type
interface PostsContextType {
  latestTweets: Post[] | undefined;
  isLoadingLatest: boolean;
  refetchLatest: () => void;
  userInteractions: Record<
    string,
    { liked?: boolean; disliked?: boolean; retweeted?: boolean }
  >;
  likePost: (id: string) => void;
  dislikePost: (id: string) => void;
  retweetPost: (id: string) => void;
  addComment: (id: string, comment: Comment) => void;
}

export const PostsContext = createContext<PostsContextType | undefined>(
  undefined,
);

export const PostsProvider = ({ children }: { children: ReactNode }) => {
  const queryClient = useQueryClient();
  const { user } = useUser();

  const updateTweetAcrossCaches = (
    tweetId: string,
    updater: (post: Post) => Post,
  ) => {
    const applyUpdate = (posts?: Post[]) => {
      if (!posts) return posts;
      return posts.map((post) =>
        String(post.id) === tweetId ? updater(post) : post,
      );
    };

    const feedPrefixes = [
      "latestTweets",
      "tweetsForHome",
      "userTweetsByUsername",
    ] as const;
    for (const prefix of feedPrefixes) {
      queryClient.setQueriesData<Post[]>(
        { predicate: (q) => q.queryKey[0] === prefix },
        applyUpdate,
      );
    }
  };
  
  const getUserInteractionsKey = (username?: string) => 
    username ? `userInteractions_${username}` : "userInteractions";
  
  const [userInteractions, setUserInteractions] = useState<
    Record<string, { liked?: boolean; disliked?: boolean; retweeted?: boolean }>
  >(() => {
    if (user?.username) {
      const stored = localStorage.getItem(getUserInteractionsKey(user.username));
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch {
          // ignore invalid stored data
        }
      }
    }
    return {};
  });

  // Calcular interações específicas do usuário atual
  const currentUserInteractions = userInteractions;

  // Carregar interações do localStorage quando o usuário muda
  const currentUsernameRef = useRef(user?.username);
  useEffect(() => {
    if (user?.username !== currentUsernameRef.current) {
      currentUsernameRef.current = user?.username;
      if (user?.username) {
        const stored = localStorage.getItem(getUserInteractionsKey(user.username));
        if (stored) {
          try {
            setUserInteractions(JSON.parse(stored));
          } catch {
            setUserInteractions({});
          }
        } else {
          setUserInteractions({});
        }
      } else {
        setUserInteractions({});
      }
    }
  }, [user?.username]);

  // Listener para refetch após login/signup
  useEffect(() => {
    const handleTokenSet = () => {
      queryClient.refetchQueries({ queryKey: ["latestTweets"] });
    };
    window.addEventListener("tokenSet", handleTokenSet);
    return () => window.removeEventListener("tokenSet", handleTokenSet);
  }, [queryClient]);

  // Query global: últimos tweets
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const {
    data: latestTweets,
    isLoading: isLoadingLatest,
    refetch: refetchLatest,
  } = useQuery<Post[]>({
    queryKey: ["latestTweets"],
    queryFn: async () => {
      const headers = {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };
      const res = await fetch(`${API_URL}/tweets/latest`, { headers });
      if (!res.ok) throw new Error("Erro ao buscar latest tweets");
      const data = await res.json();
      const arr = Array.isArray(data) ? data : data.tweets || [];
      return arr.map((item: ApiTweet) => ({
        id: String(item.id),
        user: item.creatorUsername,
        content: item.content,
        likes: item.likes,
        dislikes: item.dislikes,
        retweets: item.retweets,
        userName: item.creatorUsername,
        userFullName: undefined, // API simplificada não retorna nome completo
        comments: item.comments.map((comment: ApiComment) => ({
          id: String(comment.id),
          user: comment.creatorUsername,
          content: comment.content,
        })),
        createdAt: item.createdAt,
      }));
    },
    enabled: !!token,
    ...feedQueryOptions,
  });

  const likePost = async (id: string) => {
    if (currentUserInteractions[id]?.liked) return;
    const updatedInteractions = {
      ...currentUserInteractions,
      [id]: { ...currentUserInteractions[id], liked: true },
    };
    setUserInteractions(updatedInteractions);
    if (user?.username) {
      localStorage.setItem(getUserInteractionsKey(user.username), JSON.stringify(updatedInteractions));
    }
    const idStr = String(id);
    updateTweetAcrossCaches(idStr, (post) => ({
      ...post,
      likes: (post.likes ?? 0) + 1,
    }));
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/tweets/${id}/like`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      if (res.ok) {
        // Invalida todas as queries relacionadas para garantir consistência
        queryClient.invalidateQueries({ queryKey: ["latestTweets"] });
        queryClient.invalidateQueries({ queryKey: ["tweetsForHome"] });

        // Invalida a query específica do usuário que postou o tweet
        const tweet = queryClient
          .getQueryData<Post[]>(["latestTweets"])
          ?.find((p) => String(p.id) === idStr);
        if (tweet?.userName) {
          queryClient.invalidateQueries({
            queryKey: ["userTweetsByUsername", tweet.userName],
          });
        }
      } else {
        // Reverte se erro
        const revertedInteractions = {
          ...currentUserInteractions,
          [id]: { ...currentUserInteractions[id], liked: false },
        };
        setUserInteractions(revertedInteractions);
        if (user?.username) {
          localStorage.setItem(getUserInteractionsKey(user.username), JSON.stringify(revertedInteractions));
        }
        updateTweetAcrossCaches(idStr, (post) => ({
          ...post,
          likes: Math.max(0, (post.likes ?? 0) - 1),
        }));
      }
    } catch {
      // Reverte se erro
      const revertedInteractions = {
        ...currentUserInteractions,
        [id]: { ...currentUserInteractions[id], liked: false },
      };
      setUserInteractions(revertedInteractions);
      if (user?.username) {
        localStorage.setItem(getUserInteractionsKey(user.username), JSON.stringify(revertedInteractions));
      }
      updateTweetAcrossCaches(idStr, (post) => ({
        ...post,
        likes: Math.max(0, (post.likes ?? 0) - 1),
      }));
    }
  };
  const dislikePost = async (id: string) => {
    if (currentUserInteractions[id]?.disliked) return;
    const updatedInteractions = {
      ...currentUserInteractions,
      [id]: { ...currentUserInteractions[id], disliked: true },
    };
    setUserInteractions(updatedInteractions);
    if (user?.username) {
      localStorage.setItem(getUserInteractionsKey(user.username), JSON.stringify(updatedInteractions));
    }
    const idStr = String(id);
    updateTweetAcrossCaches(idStr, (post) => ({
      ...post,
      dislikes: (post.dislikes ?? 0) + 1,
    }));
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/tweets/${id}/dislike`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      if (res.ok) {
        // Invalida todas as queries relacionadas
        queryClient.invalidateQueries({ queryKey: ["latestTweets"] });
        queryClient.invalidateQueries({ queryKey: ["tweetsForHome"] });

        // Invalida a query específica do usuário que postou o tweet
        const tweet = queryClient
          .getQueryData<Post[]>(["latestTweets"])
          ?.find((p) => String(p.id) === idStr);
        if (tweet?.userName) {
          queryClient.invalidateQueries({
            queryKey: ["userTweetsByUsername", tweet.userName],
          });
        }
      } else {
        // Reverte se erro
        const revertedInteractions = {
          ...currentUserInteractions,
          [id]: { ...currentUserInteractions[id], disliked: false },
        };
        setUserInteractions(revertedInteractions);
        if (user?.username) {
          localStorage.setItem(getUserInteractionsKey(user.username), JSON.stringify(revertedInteractions));
        }
        updateTweetAcrossCaches(idStr, (post) => ({
          ...post,
          dislikes: Math.max(0, (post.dislikes ?? 0) - 1),
        }));
      }
    } catch {
      // Reverte se erro
      const revertedInteractions = {
        ...currentUserInteractions,
        [id]: { ...currentUserInteractions[id], disliked: false },
      };
      setUserInteractions(revertedInteractions);
      if (user?.username) {
        localStorage.setItem(getUserInteractionsKey(user.username), JSON.stringify(revertedInteractions));
      }
      updateTweetAcrossCaches(idStr, (post) => ({
        ...post,
        dislikes: Math.max(0, (post.dislikes ?? 0) - 1),
      }));
    }
  };
  const retweetPost = async (id: string) => {
    if (currentUserInteractions[id]?.retweeted) return;
    const updatedInteractions = {
      ...currentUserInteractions,
      [id]: { ...currentUserInteractions[id], retweeted: true },
    };
    setUserInteractions(updatedInteractions);
    if (user?.username) {
      localStorage.setItem(getUserInteractionsKey(user.username), JSON.stringify(updatedInteractions));
    }
    const idStr = String(id);
    updateTweetAcrossCaches(idStr, (post) => ({
      ...post,
      retweets: (post.retweets ?? 0) + 1,
    }));
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/tweets/${id}/retweet`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      if (res.ok) {
        // Invalida todas as queries relacionadas
        queryClient.invalidateQueries({ queryKey: ["latestTweets"] });
        queryClient.invalidateQueries({ queryKey: ["tweetsForHome"] });

        // Invalida a query específica do usuário que postou o tweet
        const tweet = queryClient
          .getQueryData<Post[]>(["latestTweets"])
          ?.find((p) => String(p.id) === idStr);
        if (tweet?.userName) {
          queryClient.invalidateQueries({
            queryKey: ["userTweetsByUsername", tweet.userName],
          });
        }
      } else {
        // Reverte se erro
        const revertedInteractions = {
          ...currentUserInteractions,
          [id]: { ...currentUserInteractions[id], retweeted: false },
        };
        setUserInteractions(revertedInteractions);
        if (user?.username) {
          localStorage.setItem(getUserInteractionsKey(user.username), JSON.stringify(revertedInteractions));
        }
        updateTweetAcrossCaches(idStr, (post) => ({
          ...post,
          retweets: Math.max(0, (post.retweets ?? 0) - 1),
        }));
      }
    } catch {
      // Reverte se erro
      const revertedInteractions = {
        ...currentUserInteractions,
        [id]: { ...currentUserInteractions[id], retweeted: false },
      };
      setUserInteractions(revertedInteractions);
      if (user?.username) {
        localStorage.setItem(getUserInteractionsKey(user.username), JSON.stringify(revertedInteractions));
      }
      updateTweetAcrossCaches(idStr, (post) => ({
        ...post,
        retweets: Math.max(0, (post.retweets ?? 0) - 1),
      }));
    }
  };
  const addComment = async (id: string, comment: Comment) => {
    const tweet = queryClient
      .getQueryData<Post[]>(["latestTweets"])
      ?.find((p) => String(p.id) === id);
    const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

    // Atualização otimista: adiciona comentário localmente
    const optimisticComment = {
      id: Date.now().toString(), // ID temporário
      content: comment.content,
      user: {
        id: 0,
        username: currentUser.username || "anonymous",
        name: "",
        email: "",
      },
      createdAt: new Date().toISOString(),
    };

    // Atualiza cache otimisticamente
    updateTweetAcrossCaches(String(id), (post) => ({
      ...post,
      comments: [...(post.comments ?? []), optimisticComment],
    }));

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/tweets/${id}/comment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ content: comment.content }),
      });

      if (res.ok) {
        const saved = (await res.json()) as {
          id: number;
          content: string;
          user?: { username?: string };
        };
        const mapped: Comment = {
          id: String(saved.id),
          user: saved.user?.username ?? currentUser.username ?? "anonymous",
          content: saved.content,
        };
        // Replace optimistic row with server comment (keeps sidebar + caches in sync)
        updateTweetAcrossCaches(String(id), (post) => ({
          ...post,
          comments: [
            ...(post.comments ?? []).filter((c) => c.id !== optimisticComment.id),
            mapped,
          ],
        }));
        // Do not invalidate latestTweets here — refetch can race and drop the new comment count in the sidebar.
        queryClient.invalidateQueries({ queryKey: ["tweetsForHome"] });
        if (tweet?.userName) {
          queryClient.invalidateQueries({
            queryKey: ["userTweetsByUsername", tweet.userName],
          });
        }
      } else {
        // Erro: reverte atualização otimista
        updateTweetAcrossCaches(String(id), (post) => ({
          ...post,
          comments: (post.comments ?? []).filter(
            (c) => c.id !== optimisticComment.id,
          ),
        }));

        // Poderia mostrar mensagem de erro para o usuário
      }
    } catch {
      // Erro de rede: reverte atualização otimista
      updateTweetAcrossCaches(String(id), (post) => ({
        ...post,
        comments: (post.comments ?? []).filter(
          (c) => c.id !== optimisticComment.id,
        ),
      }));
    }
  };

  return (
    <PostsContext.Provider
      value={{
        latestTweets,
        isLoadingLatest,
        refetchLatest,
        userInteractions: currentUserInteractions,
        likePost,
        dislikePost,
        retweetPost,
        addComment,
      }}
    >
      {children}
    </PostsContext.Provider>
  );
};
