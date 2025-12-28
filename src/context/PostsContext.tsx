import { createContext, ReactNode } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';

// Types
export type Comment = {
  id: string;
  user: string;
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

// Context type
interface PostsContextType {
  posts: Post[] | undefined;
  isLoading: boolean;
  refetch: () => void;
  likePost: (id: string) => void;
  dislikePost: (id: string) => void;
  retweetPost: (id: string) => void;
  addComment: (id: string, comment: Comment) => void;
}

export const PostsContext = createContext<PostsContextType | undefined>(undefined);

export const PostsProvider = ({ children }: { children: ReactNode }) => {
  const queryClient = useQueryClient();

  // Busca usuários
  const { data: users } = useQuery({
    queryKey: ['dummyUsers'],
    queryFn: async () => {
      const res = await fetch('https://dummyjson.com/users');
      const data = await res.json();
      return data.users.reduce((acc: Record<number, any>, user: any) => {
        acc[user.id] = user;
        return acc;
      }, {});
    },
  });

  // Busca posts do backend autenticado
  const { data: posts, isLoading, refetch } = useQuery<Post[]>({
    queryKey: ['externalPosts'],
    queryFn: async () => {
      const apiUrl = import.meta.env.VITE_API_URL || '';
      const token = localStorage.getItem('token');
      const headers = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };
      try {
        const res = await fetch(`${apiUrl}/tweets`, { headers });
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          console.error('[PostsContext] Erro ao buscar tweets:', err);
          throw new Error(err.message || 'Erro ao buscar tweets');
        }
        const data = await res.json();
        // Ajuste: sempre retorna user como string (username)
        if (Array.isArray(data)) {
          console.log('[PostsContext] Tweets recebidos:', data);
          return data.map((item: any) => ({
            ...item,
            user: typeof item.user === 'object' && item.user?.username ? item.user.username : item.user,
            userName: item.user?.username || undefined,
            userFullName: item.user?.name || undefined,
          }));
        }
        if (Array.isArray(data.tweets)) {
          console.log('[PostsContext] Tweets recebidos:', data.tweets);
          return data.tweets.map((item: any) => ({
            ...item,
            user: typeof item.user === 'object' && item.user?.username ? item.user.username : item.user,
            userName: item.user?.username || undefined,
            userFullName: item.user?.name || undefined,
          }));
        }
        console.warn('[PostsContext] Nenhum tweet encontrado. Resposta:', data);
        return [];
      } catch (error) {
        console.error('[PostsContext] Erro inesperado ao buscar tweets:', error);
        throw error;
      }
    },
  });

  // Mutations locais (mock)
  const likePost = (id: string) => {
    const liked = localStorage.getItem(`like_${id}`);
    if (liked) return;
    localStorage.setItem(`like_${id}`, '1');
    queryClient.setQueryData<Post[]>(['externalPosts', users], (old) =>
      old?.map((p) => (p.id === id ? { ...p, likes: (p.likes ?? 0) + 1 } : p))
    );
  };
  const dislikePost = (id: string) => {
    const disliked = localStorage.getItem(`dislike_${id}`);
    if (disliked) return;
    localStorage.setItem(`dislike_${id}`, '1');
    queryClient.setQueryData<Post[]>(['externalPosts', users], (old) =>
      old?.map((p) => (p.id === id ? { ...p, dislikes: (p.dislikes ?? 0) + 1 } : p))
    );
  };
  const retweetPost = (id: string) => {
    const retweeted = localStorage.getItem(`retweet_${id}`);
    if (retweeted) return;
    localStorage.setItem(`retweet_${id}`, '1');
    queryClient.setQueryData<Post[]>(['externalPosts', users], (old) =>
      old?.map((p) => (p.id === id ? { ...p, retweets: (p.retweets ?? 0) + 1 } : p))
    );
  };
  const addComment = (id: string, comment: Comment) => {
    queryClient.setQueryData<Post[]>(['externalPosts', users], (old) =>
      old?.map((p) =>
        p.id === id
          ? { ...p, comments: [comment, ...(p.comments ?? [])] }
          : p
      )
    );
  };

  return (
    <PostsContext.Provider value={{ posts, isLoading, refetch, likePost, dislikePost, retweetPost, addComment }}>
      {children}
    </PostsContext.Provider>
  );
}

