import { createContext, ReactNode, useEffect, useState, useRef } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
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
      const apiUrl = import.meta.env.VITE_API_URL || "";
      const headers = {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };
      const res = await fetch(`${apiUrl}/tweets/latest`, { headers });
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
    refetchInterval: 5000,
    refetchOnWindowFocus: true,
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
    // Otimista: incrementa apenas na latestTweets
    queryClient.setQueryData<Post[]>(["latestTweets"], (old) =>
      old?.map((p) =>
        String(p.id) === idStr ? { ...p, likes: (p.likes ?? 0) + 1 } : p,
      ),
    );
    try {
      const apiUrl = import.meta.env.VITE_API_URL || "";
      const token = localStorage.getItem("token");
      const res = await fetch(`${apiUrl}/tweets/${id}/like`, {
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
        queryClient.setQueryData<Post[]>(["latestTweets"], (old) =>
          old?.map((p) =>
            String(p.id) === idStr
              ? { ...p, likes: Math.max(0, (p.likes ?? 0) - 1) }
              : p,
          ),
        );
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
      queryClient.setQueryData<Post[]>(["latestTweets"], (old) =>
        old?.map((p) =>
          String(p.id) === idStr
            ? { ...p, likes: Math.max(0, (p.likes ?? 0) - 1) }
            : p,
        ),
      );
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
    // Otimista: incrementa apenas na latestTweets
    queryClient.setQueryData<Post[]>(["latestTweets"], (old) =>
      old?.map((p) =>
        String(p.id) === idStr ? { ...p, dislikes: (p.dislikes ?? 0) + 1 } : p,
      ),
    );
    try {
      const apiUrl = import.meta.env.VITE_API_URL || "";
      const token = localStorage.getItem("token");
      const res = await fetch(`${apiUrl}/tweets/${id}/dislike`, {
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
        queryClient.setQueryData<Post[]>(["latestTweets"], (old) =>
          old?.map((p) =>
            String(p.id) === idStr
              ? { ...p, dislikes: Math.max(0, (p.dislikes ?? 0) - 1) }
              : p,
          ),
        );
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
      queryClient.setQueryData<Post[]>(["latestTweets"], (old) =>
        old?.map((p) =>
          String(p.id) === idStr
            ? { ...p, dislikes: Math.max(0, (p.dislikes ?? 0) - 1) }
            : p,
        ),
      );
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
    // Otimista: incrementa apenas na latestTweets
    queryClient.setQueryData<Post[]>(["latestTweets"], (old) =>
      old?.map((p) =>
        String(p.id) === idStr ? { ...p, retweets: (p.retweets ?? 0) + 1 } : p,
      ),
    );
    try {
      const apiUrl = import.meta.env.VITE_API_URL || "";
      const token = localStorage.getItem("token");
      const res = await fetch(`${apiUrl}/tweets/${id}/retweet`, {
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
        queryClient.setQueryData<Post[]>(["latestTweets"], (old) =>
          old?.map((p) =>
            String(p.id) === idStr
              ? { ...p, retweets: Math.max(0, (p.retweets ?? 0) - 1) }
              : p,
          ),
        );
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
      queryClient.setQueryData<Post[]>(["latestTweets"], (old) =>
        old?.map((p) =>
          String(p.id) === idStr
            ? { ...p, retweets: Math.max(0, (p.retweets ?? 0) - 1) }
            : p,
        ),
      );
    }
  };
  const addComment = async (id: string, comment: Comment) => {
    // Verifica se o tweet é do próprio usuário
    const tweet = queryClient
      .getQueryData<Post[]>(["latestTweets"])
      ?.find((p) => String(p.id) === id);
    const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

    if (tweet?.userName === currentUser.username) {
      // Não permite comentar no próprio tweet
      return;
    }

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
    queryClient.setQueryData<Post[]>(["latestTweets"], (old) =>
      old?.map((p) =>
        String(p.id) === id
          ? { ...p, comments: [...(p.comments ?? []), optimisticComment] }
          : p,
      ),
    );

    try {
      const apiUrl = import.meta.env.VITE_API_URL || "";
      const token = localStorage.getItem("token");
      const res = await fetch(`${apiUrl}/tweets/${id}/comment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ content: comment.content }),
      });

      if (res.ok) {
        // Sucesso: invalida queries para buscar dados reais do servidor
        queryClient.invalidateQueries({ queryKey: ["latestTweets"] });
        queryClient.invalidateQueries({ queryKey: ["tweetsForHome"] });

        // Invalida a query específica do usuário que postou o tweet
        if (tweet?.userName) {
          queryClient.invalidateQueries({
            queryKey: ["userTweetsByUsername", tweet.userName],
          });
        }
      } else {
        // Erro: reverte atualização otimista
        queryClient.setQueryData<Post[]>(["latestTweets"], (old) =>
          old?.map((p) =>
            String(p.id) === id
              ? {
                  ...p,
                  comments: (p.comments ?? []).filter(
                    (c) => c.id !== optimisticComment.id,
                  ),
                }
              : p,
          ),
        );

        // Poderia mostrar mensagem de erro para o usuário
      }
    } catch {
      // Erro de rede: reverte atualização otimista
      queryClient.setQueryData<Post[]>(["latestTweets"], (old) =>
        old?.map((p) =>
          String(p.id) === id
            ? {
                ...p,
                comments: (p.comments ?? []).filter(
                  (c) => c.id !== optimisticComment.id,
                ),
              }
            : p,
        ),
      );
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
