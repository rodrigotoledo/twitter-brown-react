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
  latestTweets: Post[] | undefined;
  isLoadingLatest: boolean;
  refetchLatest: () => void;
  userTweets: (userId: string) => Post[] | undefined;
  isLoadingUser: (userId: string) => boolean;
  refetchUser: (userId: string) => void;
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

  // Query global: últimos tweets
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const {
    data: latestTweets,
    isLoading: isLoadingLatest,
    refetch: refetchLatest
  } = useQuery<Post[]>({
    queryKey: ['latestTweets'],
    queryFn: async () => {
      const apiUrl = import.meta.env.VITE_API_URL || '';
      const headers = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };
      const res = await fetch(`${apiUrl}/tweets/latest`, { headers });
      if (!res.ok) throw new Error('Erro ao buscar latest tweets');
      const data = await res.json();
      const arr = Array.isArray(data) ? data : data.tweets || [];
      return arr.map((item: any) => ({
        ...item,
        user: typeof item.user === 'object' && item.user?.username ? item.user.username : item.user,
        userName: item.user?.username || undefined,
        userFullName: item.user?.name || undefined,
      }));
    },
    enabled: !!token,
    refetchInterval: 5000,
    refetchOnWindowFocus: true,
  });

  // Query dos tweets do usuário
  const userTweetsQuery = (userId: string) => useQuery<Post[]>({
    queryKey: ['userTweets'],
    queryFn: async () => {
      const apiUrl = import.meta.env.VITE_API_URL || '';
      const token = localStorage.getItem('token');
      const headers = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };
      // Não envia userId, backend pega do token
      const res = await fetch(`${apiUrl}/tweets`, { headers });
      if (!res.ok) throw new Error('Erro ao buscar tweets do usuário');
      const data = await res.json();
      const arr = Array.isArray(data) ? data : data.tweets || [];
      return arr.map((item: any) => ({
        ...item,
        user: typeof item.user === 'object' && item.user?.username ? item.user.username : item.user,
        userName: item.user?.username || undefined,
        userFullName: item.user?.name || undefined,
      }));
    },
    refetchInterval: 5000,
    refetchOnWindowFocus: true,
  });

  const userTweets = (userId: string) => {
    const { data } = userTweetsQuery(userId);
    return data;
  };
  const isLoadingUser = (userId: string) => {
    const { isLoading } = userTweetsQuery(userId);
    return isLoading;
  };
  const refetchUser = (userId: string) => {
    const { refetch } = userTweetsQuery(userId);
    return refetch();
  };

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
    <PostsContext.Provider value={{ latestTweets, isLoadingLatest, refetchLatest, userTweets, isLoadingUser, refetchUser, likePost, dislikePost, retweetPost, addComment }}>
      {children}
    </PostsContext.Provider>
  );
}

