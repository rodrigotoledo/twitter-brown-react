import { createContext, ReactNode, useEffect, useState } from 'react';
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

// Types
type ApiTweet = {
  id: string;
  content: string;
  user: string | { username: string; name: string };
  likes?: number | { id: string }[];
  dislikes?: number | { id: string }[];
  retweets?: number | { id: string }[];
  createdAt?: string;
};

// Context type
interface PostsContextType {
  latestTweets: Post[] | undefined;
  isLoadingLatest: boolean;
  refetchLatest: () => void;
  userInteractions: Record<string, { liked?: boolean; disliked?: boolean; retweeted?: boolean }>;
  likePost: (id: string) => void;
  dislikePost: (id: string) => void;
  retweetPost: (id: string) => void;
  addComment: (id: string, comment: Comment) => void;
}

export const PostsContext = createContext<PostsContextType | undefined>(undefined);

export const PostsProvider = ({ children }: { children: ReactNode }) => {
  const queryClient = useQueryClient();
  const [userInteractions, setUserInteractions] = useState<Record<string, { liked?: boolean; disliked?: boolean; retweeted?: boolean }>>(() => {
    const stored = localStorage.getItem('userInteractions');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        // ignore invalid stored data
      }
    }
    return {};
  });

  // Salvar interações no localStorage quando mudar
  useEffect(() => {
    localStorage.setItem('userInteractions', JSON.stringify(userInteractions));
  }, [userInteractions]);

  // Salvar interações no localStorage quando mudar
  useEffect(() => {
    localStorage.setItem('userInteractions', JSON.stringify(userInteractions));
  }, [userInteractions]);

  // Listener para refetch após login/signup
  useEffect(() => {
    const handleTokenSet = () => {
      queryClient.refetchQueries({ queryKey: ['latestTweets'] });
    };
    window.addEventListener('tokenSet', handleTokenSet);
    return () => window.removeEventListener('tokenSet', handleTokenSet);
  }, [queryClient]);

  // Query global: últimos tweets
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const {
    data: latestTweets,
    isLoading: isLoadingLatest,
    refetch: refetchLatest,
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
      return arr.map((item: ApiTweet) => ({
        ...item,
        likes: Array.isArray(item.likes) ? item.likes.length : (typeof item.likes === 'number' ? item.likes : 0),
        dislikes: Array.isArray(item.dislikes)
          ? item.dislikes.length
          : typeof item.dislikes === 'number'
          ? item.dislikes
          : 0,
        retweets: Array.isArray(item.retweets)
          ? item.retweets.length
          : typeof item.retweets === 'number'
          ? item.retweets
          : 0,
        user: typeof item.user === 'object' && item.user?.username ? item.user.username : item.user,
        userName: typeof item.user === 'object' && item.user?.username ? item.user.username : undefined,
        userFullName: typeof item.user === 'object' && item.user?.name ? item.user.name : undefined,
      }));
    },
    enabled: !!token,
    refetchInterval: 5000,
    refetchOnWindowFocus: true,
  });

  const likePost = async (id: string) => {
    if (userInteractions[id]?.liked) return;
    setUserInteractions(prev => ({ ...prev, [id]: { ...prev[id], liked: true } }));
    const idStr = String(id);
    // Otimista: incrementa apenas na latestTweets
    queryClient.setQueryData<Post[]>(['latestTweets'], (old) =>
      old?.map((p) => (String(p.id) === idStr ? { ...p, likes: (p.likes ?? 0) + 1 } : p))
    );
    try {
      const apiUrl = import.meta.env.VITE_API_URL || '';
      const token = localStorage.getItem('token');
      const res = await fetch(`${apiUrl}/tweets/${id}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      if (res.ok) {
        // Invalida todas as queries relacionadas para garantir consistência
        queryClient.invalidateQueries({ queryKey: ['latestTweets'] });
        queryClient.invalidateQueries({ queryKey: ['tweetsForHome'] });
        
        // Invalida a query específica do usuário que postou o tweet
        const tweet = queryClient.getQueryData<Post[]>(['latestTweets'])?.find(p => String(p.id) === idStr);
        if (tweet?.userName) {
          queryClient.invalidateQueries({ queryKey: ['userTweetsByUsername', tweet.userName] });
        }
      } else {
        // Reverte se erro
        setUserInteractions(prev => ({ ...prev, [id]: { ...prev[id], liked: false } }));
        queryClient.setQueryData<Post[]>(['latestTweets'], (old) =>
          old?.map((p) => (String(p.id) === idStr ? { ...p, likes: Math.max(0, (p.likes ?? 0) - 1) } : p))
        );
      }
    } catch {
      // Reverte se erro
      setUserInteractions(prev => ({ ...prev, [id]: { ...prev[id], liked: false } }));
      queryClient.setQueryData<Post[]>(['latestTweets'], (old) =>
        old?.map((p) => (String(p.id) === idStr ? { ...p, likes: Math.max(0, (p.likes ?? 0) - 1) } : p))
      );
    }
  };
  const dislikePost = async (id: string) => {
    if (userInteractions[id]?.disliked) return;
    setUserInteractions(prev => ({ ...prev, [id]: { ...prev[id], disliked: true } }));
    const idStr = String(id);
    // Otimista: incrementa apenas na latestTweets
    queryClient.setQueryData<Post[]>(['latestTweets'], (old) =>
      old?.map((p) => (String(p.id) === idStr ? { ...p, dislikes: (p.dislikes ?? 0) + 1 } : p))
    );
    try {
      const apiUrl = import.meta.env.VITE_API_URL || '';
      const token = localStorage.getItem('token');
      const res = await fetch(`${apiUrl}/tweets/${id}/dislike`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      if (res.ok) {
        // Invalida todas as queries relacionadas
        queryClient.invalidateQueries({ queryKey: ['latestTweets'] });
        queryClient.invalidateQueries({ queryKey: ['tweetsForHome'] });
        
        // Invalida a query específica do usuário que postou o tweet
        const tweet = queryClient.getQueryData<Post[]>(['latestTweets'])?.find(p => String(p.id) === idStr);
        if (tweet?.userName) {
          queryClient.invalidateQueries({ queryKey: ['userTweetsByUsername', tweet.userName] });
        }
      } else {
        // Reverte se erro
        setUserInteractions(prev => ({ ...prev, [id]: { ...prev[id], disliked: false } }));
        queryClient.setQueryData<Post[]>(['latestTweets'], (old) =>
          old?.map((p) => (String(p.id) === idStr ? { ...p, dislikes: Math.max(0, (p.dislikes ?? 0) - 1) } : p))
        );
      }
    } catch {
      // Reverte se erro
      setUserInteractions(prev => ({ ...prev, [id]: { ...prev[id], disliked: false } }));
      queryClient.setQueryData<Post[]>(['latestTweets'], (old) =>
        old?.map((p) => (String(p.id) === idStr ? { ...p, dislikes: Math.max(0, (p.dislikes ?? 0) - 1) } : p))
      );
    }
  };
  const retweetPost = async (id: string) => {
    if (userInteractions[id]?.retweeted) return;
    setUserInteractions(prev => ({ ...prev, [id]: { ...prev[id], retweeted: true } }));
    const idStr = String(id);
    // Otimista: incrementa apenas na latestTweets
    queryClient.setQueryData<Post[]>(['latestTweets'], (old) =>
      old?.map((p) => (String(p.id) === idStr ? { ...p, retweets: (p.retweets ?? 0) + 1 } : p))
    );
    try {
      const apiUrl = import.meta.env.VITE_API_URL || '';
      const token = localStorage.getItem('token');
      const res = await fetch(`${apiUrl}/tweets/${id}/retweet`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      if (res.ok) {
        // Invalida todas as queries relacionadas
        queryClient.invalidateQueries({ queryKey: ['latestTweets'] });
        queryClient.invalidateQueries({ queryKey: ['tweetsForHome'] });
        
        // Invalida a query específica do usuário que postou o tweet
        const tweet = queryClient.getQueryData<Post[]>(['latestTweets'])?.find(p => String(p.id) === idStr);
        if (tweet?.userName) {
          queryClient.invalidateQueries({ queryKey: ['userTweetsByUsername', tweet.userName] });
        }
      } else {
        // Reverte se erro
        setUserInteractions(prev => ({ ...prev, [id]: { ...prev[id], retweeted: false } }));
        queryClient.setQueryData<Post[]>(['latestTweets'], (old) =>
          old?.map((p) => (String(p.id) === idStr ? { ...p, retweets: Math.max(0, (p.retweets ?? 0) - 1) } : p))
        );
      }
    } catch {
      // Reverte se erro
      setUserInteractions(prev => ({ ...prev, [id]: { ...prev[id], retweeted: false } }));
      queryClient.setQueryData<Post[]>(['latestTweets'], (old) =>
        old?.map((p) => (String(p.id) === idStr ? { ...p, retweets: Math.max(0, (p.retweets ?? 0) - 1) } : p))
      );
    }
  };
  const addComment = async (id: string, comment: Comment) => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || '';
      const token = localStorage.getItem('token');
      const res = await fetch(`${apiUrl}/tweets/${id}/comment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ content: comment.content }),
      });
      if (res.ok) {
        // Invalida queries para atualizar comentários
        queryClient.invalidateQueries({ queryKey: ['latestTweets'] });
        queryClient.invalidateQueries({ queryKey: ['tweetsForHome'] });
        
        // Invalida a query específica do usuário que postou o tweet
        const tweet = queryClient.getQueryData<Post[]>(['latestTweets'])?.find(p => String(p.id) === id);
        if (tweet?.userName) {
          queryClient.invalidateQueries({ queryKey: ['userTweetsByUsername', tweet.userName] });
        }
      }
    } catch {
      // Handle error silently or show user feedback
    }
  };

  return (
    <PostsContext.Provider value={{ latestTweets, isLoadingLatest, refetchLatest, userInteractions, likePost, dislikePost, retweetPost, addComment }}>
      {children}
    </PostsContext.Provider>
  );
}

