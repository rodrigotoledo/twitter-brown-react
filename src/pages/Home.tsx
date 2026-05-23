import { useEffect, useMemo, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import LeftNav from '../components/home/LeftNav'
import RightSidebar from '../components/home/RightSidebar'
import MobileTopNav from '../components/home/MobileTopNav'
import PostComposer from '../components/home/PostComposer'
import PostCard from '../components/home/PostCard'
import CommentInput from '../components/home/CommentInput'
import CommentSection from '../components/home/CommentSection'
import ShareMenu from '../components/home/ShareMenu'
import { POST_FILTER_OPTIONS, filterPosts, searchPosts } from '../utils/postFilters'
import { useToast } from '../context/ToastContext'
import { TOKEN_STORAGE_KEY, useUser } from '../context/UserContext'
import { usePostsQuery, useCommentsQuery } from '../hooks/usePostsQuery'
import { useCreatePostMutation, useLikePostMutation, useRepostMutation, useCreateCommentMutation } from '../hooks/usePostMutations'
import { useFollowMutation } from '../hooks/useUserMutations'
import type { PostFilter } from '../types/post'

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const getAvatarUrl = (avatarUrl?: string) => {
  if (!avatarUrl) return ''
  return avatarUrl.startsWith('http') ? avatarUrl : `${apiUrl}${avatarUrl}`
}

const Home = () => {
  const { toast } = useToast()
  const { user, logout, refreshUser } = useUser()
  const queryClient = useQueryClient()
  const [activeFilter, setActiveFilter] = useState<PostFilter>('latest50')
  const [searchQuery, setSearchQuery] = useState('')
  const [appliedSearch, setAppliedSearch] = useState('')
  const [expandedPostId, setExpandedPostId] = useState<string | null>(null)
  const [shareMenuPostId, setShareMenuPostId] = useState<string | null>(null)

  const { data: posts = [], isLoading: isLoadingFeed, error: postsError } = usePostsQuery()
  const { data: expandedComments = [] } = useCommentsQuery(expandedPostId || '')
  const createPostMutation = useCreatePostMutation()
  const likePostMutation = useLikePostMutation()
  const repostMutation = useRepostMutation()
  const createCommentMutation = useCreateCommentMutation()
  const followMutation = useFollowMutation()

  useEffect(() => {
    const handleWindowFocus = () => {
      queryClient.refetchQueries({ queryKey: ['posts'] })
      if (expandedPostId) {
        queryClient.refetchQueries({ queryKey: ['comments', expandedPostId] })
      }
    }

    window.addEventListener('focus', handleWindowFocus)
    return () => window.removeEventListener('focus', handleWindowFocus)
  }, [queryClient, expandedPostId])

  if (postsError) {
    toast.error(postsError instanceof Error ? postsError.message : 'Unable to load posts.')
  }

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

  const handleLike = (postId: string) => {
    const post = posts.find((p) => p.id === postId)
    if (!post) return

    likePostMutation.mutate(
      { postId, isLiked: post.likedByMe },
      {
        onSuccess: () => {
          toast.success(post.likedByMe ? 'Unlike!' : 'Liked!')
        },
        onError: (error) => {
          toast.error(error instanceof Error ? error.message : 'Unable to like this post.')
        },
      }
    )
  }

  const handleRepost = (postId: string) => {
    const post = posts.find((p) => p.id === postId)
    if (!post) return

    repostMutation.mutate(
      { postId, isReposted: post.repostedByMe },
      {
        onSuccess: () => {
          toast.success(post.repostedByMe ? 'Unreposted!' : 'Reposted!')
        },
        onError: (error) => {
          toast.error(error instanceof Error ? error.message : 'Unable to repost.')
        },
      }
    )
  }

  const handleFollow = (postId: string) => {
    const post = posts.find((p) => p.id === postId)
    if (!post || post.isOwnPost) return

    followMutation.mutate(
      { username: post.author.username, isFollowing: post.isFollowing },
      {
        onSuccess: async () => {
          toast.success(post.isFollowing ? 'Unfollowed!' : 'Following!')
          await refreshUser()
        },
        onError: (error) => {
          toast.error(error instanceof Error ? error.message : 'Unable to update follow.')
        },
      }
    )
  }

  const handleCreatePost = async (content: string, idempotencyKey: string) => {
    return new Promise<void>((resolve, reject) => {
      createPostMutation.mutate(
        { content, idempotencyKey },
        {
          onSuccess: () => {
            toast.success('Post published!')
            resolve()
          },
          onError: (error) => {
            toast.error(error instanceof Error ? error.message : 'Unable to publish your post.')
            reject(error)
          },
        }
      )
    })
  }

  const expandPost = (postId: string) => {
    if (expandedPostId === postId) {
      setExpandedPostId(null)
    } else {
      setExpandedPostId(postId)
    }
  }

  const handleCreateComment = (postId: string, content: string) => {
    createCommentMutation.mutate(
      { postId, content },
      {
        onSuccess: () => {
          toast.success('Comment posted!')
        },
        onError: (error) => {
          toast.error(error instanceof Error ? error.message : 'Unable to post comment.')
        },
      }
    )
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
              <div key={post.id} className="border-b border-cursor-border">
                <PostCard
                  post={post}
                  onLike={handleLike}
                  onRepost={handleRepost}
                  onComment={expandPost}
                  onShare={(id) => setShareMenuPostId(id)}
                  onFollow={handleFollow}
                />
                {expandedPostId === post.id && (
                  <>
                    {user && (
                      <CommentInput
                        onSubmit={(content) => handleCreateComment(post.id, content)}
                        isLoading={createCommentMutation.isPending}
                        userAvatar={getAvatarUrl(user.avatar_url)}
                      />
                    )}
                    <CommentSection
                      comments={expandedComments || []}
                      isLoadingComments={false}
                      showInput={expandedPostId === post.id}
                    />
                  </>
                )}
              </div>
            ))
          )}
        </div>
      </main>

      {shareMenuPostId && (() => {
        const post = posts.find((p) => p.id === shareMenuPostId)
        return post ? (
          <ShareMenu
            postUrl={`${window.location.origin}/home#${shareMenuPostId}`}
            postContent={post.content}
            isOpen={true}
            onClose={() => setShareMenuPostId(null)}
          />
        ) : null
      })()}
    </div>
  )
}

export default Home
