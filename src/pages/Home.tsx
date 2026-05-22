import { useMemo, useState } from 'react'
import LeftNav from '../components/home/LeftNav'
import RightSidebar from '../components/home/RightSidebar'
import PostComposer from '../components/home/PostComposer'
import PostCard from '../components/home/PostCard'
import { generatePosts } from '../utils/generatePosts'
import { filterPosts, searchPosts } from '../utils/postFilters'
import { useToast } from '../context/ToastContext'
import type { Post, PostFilter } from '../types/post'

const initialPosts = generatePosts(50)

const Home = () => {
  const { toast } = useToast()
  const [posts, setPosts] = useState<Post[]>(initialPosts)
  const [activeFilter, setActiveFilter] = useState<PostFilter>('latest50')
  const [searchQuery, setSearchQuery] = useState('')
  const [appliedSearch, setAppliedSearch] = useState('')

  const visiblePosts = useMemo(() => {
    const filtered = filterPosts(posts, activeFilter)
    return searchPosts(filtered, appliedSearch)
  }, [posts, activeFilter, appliedSearch])

  const updatePost = (id: string, updater: (post: Post) => Post) => {
    setPosts((current) => current.map((p) => (p.id === id ? updater(p) : p)))
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
      <LeftNav />

      <RightSidebar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSearch={handleSearch}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
      />

      {/* Center column: full width between sidebars; only the feed scrolls */}
      <main className="fixed inset-y-0 left-0 right-0 z-10 flex flex-col bg-cursor-light lg:left-20 xl:left-64 xl:right-80">
        <div className="shrink-0 border-b border-cursor-border bg-cursor-light">
          <header className="px-4 py-3">
            <h1 className="text-xl font-bold">Home</h1>
          </header>
          <PostComposer onPost={(post) => setPosts((current) => [post, ...current])} />
        </div>

        <div className="flex-1 overflow-y-auto">
          {visiblePosts.length === 0 ? (
            <p className="px-4 py-8 text-center text-cursor-muted">
              No posts found for this filter.
            </p>
          ) : (
            visiblePosts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onLike={(id) =>
                  updatePost(id, (p) => ({ ...p, likes: p.likes + 1 }))
                }
                onRepost={(id) =>
                  updatePost(id, (p) => ({ ...p, reposts: p.reposts + 1 }))
                }
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
                onFollow={(id) =>
                  updatePost(id, (p) => ({ ...p, isFollowing: !p.isFollowing }))
                }
              />
            ))
          )}
        </div>
      </main>
    </div>
  )
}

export default Home
