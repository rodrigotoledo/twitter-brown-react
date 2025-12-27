

import { usePosts } from '../context/PostsContext'
import PostActions from './PostActions'

import type { Post as Tweet } from '../context/PostsContext'

// ...existing code...

const SideBar = () => {
  const { posts: externalTweets, isLoading } = usePosts();

  return (
    <div className="w-full p-4 md:border-r border-vscode-border overflow-y-auto bg-vscode-sidebar sidebar-scroll">
      <h2 className="text-xl font-semibold mb-4 text-vscode-text">Latest Tweets</h2>
      {isLoading ? (
        <p className="text-vscode-text-muted">Loading...</p>
      ) : (
        externalTweets?.slice(0, 10).map((tweet: Tweet) => (
          <div
            key={tweet.id}
            className="mb-3 bg-vscode-input p-3 rounded border border-vscode-border hover:bg-vscode-hover transition hover:shadow-lg hover:-translate-y-1 will-change-transform will-change-shadow will-change-bg"
          >
            <div className="flex items-center gap-2 mb-1">
              <p className="text-sm font-semibold text-vscode-accent">@{tweet.userName || tweet.user}</p>
              {tweet.userFullName && <span className="text-xs text-vscode-text-muted">({tweet.userFullName})</span>}
            </div>
            <p
              className="text-sm text-vscode-text mt-1 truncate max-w-full block overflow-hidden text-ellipsis whitespace-nowrap"
              title={tweet.content}
            >
              {tweet.content}
            </p>
            <PostActions id={tweet.id} likes={tweet.likes} dislikes={tweet.dislikes} retweets={tweet.retweets} compact />
          </div>
        ))
      )}
    </div>
  )
}

export default SideBar
