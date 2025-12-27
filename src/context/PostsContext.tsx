import { createContext, useContext, ReactNode } from 'react';
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

const PostsContext = createContext<PostsContextType | undefined>(undefined);

export const usePosts = () => {
  const ctx = useContext(PostsContext);
  if (!ctx) throw new Error('usePosts must be used within PostsProvider');
  return ctx;
};

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

  // Busca posts
  const { data: posts, isLoading, refetch } = useQuery<Post[]>({
    queryKey: ['externalPosts', users],
    queryFn: async () => {
      const res = await fetch('https://dummyjson.com/posts');
      const data = await res.json();
      return data.posts.map((item: any) => {
        const userData = users?.[item.userId];
        return {
          id: `ext-${item.id}`,
          user: userData ? userData.username : `user${item.userId ?? ''}`,
          userName: userData?.username,
          userFullName: userData ? `${userData.firstName} ${userData.lastName}` : undefined,
          content: item.body,
          title: item.title,
          tags: item.tags,
          likes: item.reactions?.likes,
          dislikes: item.reactions?.dislikes,
          views: item.views,
        };
      });
    },
    enabled: !!users,
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
};
