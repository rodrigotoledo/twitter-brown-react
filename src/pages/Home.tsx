import { useEffect, useMemo, useRef, useState } from 'react'
import LeftNav from '../components/home/LeftNav'
import RightSidebar from '../components/home/RightSidebar'
import MobileTopNav from '../components/home/MobileTopNav'
import PostComposer from '../components/home/PostComposer'
import PostCard from '../components/home/PostCard'
import { POST_FILTER_OPTIONS, filterPosts, searchPosts } from '../utils/postFilters'
import { useToast } from '../context/ToastContext'
import { TOKEN_STORAGE_KEY, useUser } from '../context/UserContext'
import type { Post, PostFilter } from '../types/post'

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000'

type ApiPost = {
  id: string
  content: string
  created_at: string
  likes_count: number
  reposts_count: number
  comments_count: number
  liked_by_me: boolean
  reposted_by_me: boolean
  is_own_post: boolean
  is_following_author: boolean
  user: {
    name: string
    username: string
    avatar_url?: string
  }
}

const getAvatarUrl = (avatarUrl?: string) => {
  if (!avatarUrl) return ''
  return avatarUrl.startsWith('http') ? avatarUrl : `${apiUrl}${avatarUrl}`
}

const mapApiPost = (post: ApiPost): Post => ({
  id: post.id,
  author: {
    name: post.user.name,
    username: post.user.username,
    avatar: getAvatarUrl(post.user.avatar_url),
  },
  content: post.content,
  createdAt: new Date(post.created_at),
  likes: post.likes_count,
  reposts: post.reposts_count,
  comments: post.comments_count,
  likedByMe: post.liked_by_me,
  repostedByMe: post.reposted_by_me,
  isOwnPost: post.is_own_post,
  isFollowing: post.is_following_author,
})

const Home = () => {
  const { toast } = useToast()
  const { user, logout, refreshUser } = useUser()
  const didLoadFeed = useRef(false)
  const pendingPostActions = useRef(new Set<string>())
  const pendingFollowActions = useRef(new Set<string>())
  const [posts, setPosts] = useState<Post[]>([])
  const [isLoadingFeed, setIsLoadingFeed] = useState(true)
  const [activeFilter, setActiveFilter] = useState<PostFilter>('latest50')
  const [searchQuery, setSearchQuery] = useState('')
  const [appliedSearch, setAppliedSearch] = useState('')

  useEffect(() => {
    if (didLoadFeed.current) return
    didLoadFeed.current = true

    const loadFeed = async () => {
      const token = localStorage.getItem(TOKEN_STORAGE_KEY)
      const headers: HeadersInit = token ? { Authorization: `Bearer ${token}` } : {}

      try {
        const response = await fetch(`${apiUrl}/api/posts/?limit=200`, { headers })
        const body = await response.json().catch(() => null)

        if (!response.ok) {
          throw new Error(body?.error?.message || 'Unable to load posts.')
        }

        setPosts((body?.data || []).map(mapApiPost))
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Unable to load posts.')
      } finally {
        setIsLoadingFeed(false)
      }
    }

    void loadFeed()
  }, [toast])

  const visiblePosts = useMemo(() => {
    const filtered = filterPosts(posts, activeFilter)
    return searchPosts(filtered, appliedSearch)
  }, [posts, activeFilter, appliedSearch])

  const filterCounts = useMemo(
    () =>
      POST_FILTER_OPTIONS.reduce(
        (counts, { value }) => ({
          ...counts,
          [value]: filterPosts(posts, value).length,
        }),
        {} as Record<PostFilter, number>
      ),
    [posts]
  )

  const userStats = useMemo(() => {
    if (!user) return { postCount: 0, likeCount: 0 }
    const ownPosts = posts.filter((post) => post.author.username === user.username)
    return {
      postCount: ownPosts.length,
      likeCount: ownPosts.reduce((total, post) => total + post.likes, 0),
    }
  }, [posts, user])

  const updatePost = (id: string, updater: (post: Post) => Post) => {
    setPosts((current) => current.map((p) => (p.id === id ? updater(p) : p)))
  }

  const replacePost = (post: Post) => {
    setPosts((current) => current.map((item) => (item.id === post.id ? post : item)))
  }

  const updatePostReaction = async (postId: string, action: 'like' | 'repost') => {
    const token = localStorage.getItem(TOKEN_STORAGE_KEY)
    if (!token) {
      toast.error('Sign in to continue.')
      return
    }

    const post = posts.find((item) => item.id === postId)
    if (!post) return

    const pendingKey = `${action}:${postId}`
    if (pendingPostActions.current.has(pendingKey)) return
    pendingPostActions.current.add(pendingKey)

    const isActive = action === 'like' ? post.likedByMe : post.repostedByMe
    try {
      const response = await fetch(`${apiUrl}/api/posts/${postId}/${action}`, {
        method: isActive ? 'DELETE' : 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      const body = await response.json().catch(() => null)

      if (!response.ok) {
        toast.error(body?.error?.message || `Unable to ${action} this post.`)
        return
      }

      if (body?.data) {
        replacePost(mapApiPost(body.data))
      }
    } catch {
      toast.error(`Unable to ${action} this post.`)
    } finally {
      pendingPostActions.current.delete(pendingKey)
    }
  }

  const updateAuthorFollow = async (postId: string) => {
    const token = localStorage.getItem(TOKEN_STORAGE_KEY)
    if (!token) {
      toast.error('Sign in to continue.')
      return
    }

    const post = posts.find((item) => item.id === postId)
    if (!post || post.isOwnPost) return

    const username = post.author.username
    if (pendingFollowActions.current.has(username)) return
    pendingFollowActions.current.add(username)

    try {
      const response = await fetch(`${apiUrl}/api/users/${username}/follow`, {
        method: post.isFollowing ? 'DELETE' : 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      const body = await response.json().catch(() => null)

      if (!response.ok) {
        toast.error(body?.error?.message || 'Unable to update follow.')
        return
      }

      const isFollowing = Boolean(body?.data?.is_following)
      setPosts((current) =>
        current.map((item) =>
          item.author.username === username ? { ...item, isFollowing } : item
        )
      )
      await refreshUser()
    } catch {
      toast.error('Unable to update follow.')
    } finally {
      pendingFollowActions.current.delete(username)
    }
  }

  const handleCreatePost = async (content: string, idempotencyKey: string) => {
    const token = localStorage.getItem(TOKEN_STORAGE_KEY)
    if (!token) throw new Error('Sign in to post.')

    const response = await fetch(`${apiUrl}/api/posts/`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Idempotency-Key': idempotencyKey,
      },
      body: JSON.stringify({ content }),
    })
    const body = await response.json().catch(() => null)

    if (!response.ok) {
      throw new Error(body?.error?.message || 'Unable to publish your post.')
    }

    if (!body?.data) {
      throw new Error('Post response was missing data.')
    }

    const post = mapApiPost(body.data)
    setPosts((current) => {
      const withoutDuplicate = current.filter((item) => item.id !== post.id)
      return [post, ...withoutDuplicate]
    })
    return post
  }

  const handleSearch = () => {
    setAppliedSearch(searchQuery)
    toast.info(
      searchQuery.trim()
        ? `Showing posts matching "${searchQuery.trim()}"`
        : 'Showing all posts.'
    )
  }

  return (
    <div className="h-screen overflow-hidden bg-cursor-light text-cursor-foreground">
      <LeftNav
        user={user}
        postCount={userStats.postCount}
        likeCount={userStats.likeCount}
        onLogout={logout}
      />
      <MobileTopNav
        user={user}
        postCount={userStats.postCount}
        likeCount={userStats.likeCount}
        onLogout={logout}
      />

      <RightSidebar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSearch={handleSearch}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        filterCounts={filterCounts}
      />

      {/* Center column: full width between sidebars; only the feed scrolls */}
      <main className="fixed bottom-0 left-0 right-0 top-[104px] z-10 flex flex-col bg-cursor-light lg:inset-y-0 lg:left-20 xl:left-64 xl:right-80">
        <div className="shrink-0 border-b border-cursor-border bg-cursor-light">
          <header className="px-4 py-3">
            <h1 className="text-xl font-bold">Home</h1>
          </header>
          {user && (
            <PostComposer
              user={user}
              onPost={handleCreatePost}
            />
          )}
        </div>

        <div className="flex-1 overflow-y-auto">
          {isLoadingFeed ? (
            <p className="px-4 py-8 text-center text-cursor-muted">
              Loading posts...
            </p>
          ) : visiblePosts.length === 0 ? (
            <p className="px-4 py-8 text-center text-cursor-muted">
              No posts found for this filter.
            </p>
          ) : (
            visiblePosts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onLike={(id) => void updatePostReaction(id, 'like')}
                onRepost={(id) => void updatePostReaction(id, 'repost')}
                onComment={(id) => {
                  updatePost(id, (p) => ({ ...p, comments: p.comments + 1 }))
                  toast.info('Comments coming soon.')
                }}
                onShare={(id) => {
                  navigator.clipboard?.writeText(
                    `${window.location.origin}/home#${id}`
                  )
                  toast.success('Post link copied.')
                }}
                onFollow={(id) => void updateAuthorFollow(id)}
              />
            ))
          )}
        </div>
      </main>
    </div>
  )
}

export default Home
