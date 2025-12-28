

import { usePosts } from '../context/usePosts'
import PostActions from './PostActions'

import type { Post as Tweet } from '../context/PostsContext'
import { Link } from 'react-router-dom';

// ...existing code...

const SideBar = () => {
  const { latestTweets, isLoadingLatest } = usePosts();

  // Debug: veja o que está vindo do backend
  return (
    <div className="w-full p-4 md:border-r border-vscode-border overflow-y-auto bg-vscode-sidebar sidebar-scroll">
      <h2 className="text-xl font-semibold mb-4 text-vscode-text">Latest Tweets</h2>
      {isLoadingLatest ? (
        <p className="text-vscode-text-muted">Loading...</p>
      ) : (
        latestTweets?.slice(0, 10).map((tweet: Tweet) => (
          <div
            key={tweet.id}
            className="mb-3 bg-vscode-input p-3 rounded border border-vscode-border hover:bg-vscode-hover transition hover:shadow-lg hover:-translate-y-1 will-change-transform will-change-shadow will-change-bg"
          >
            <div className="flex items-center gap-2 mb-1">
              <Link
                to={`/tweets/${tweet.userName || tweet.user}`}
                className="text-sm font-semibold text-vscode-accent hover:underline cursor-pointer"
              >
                @{tweet.userName || tweet.user}
              </Link>
              {tweet.userFullName && <span className="text-xs text-vscode-text-muted">({tweet.userFullName})</span>}
            </div>
            <p
              className="text-sm text-vscode-text mt-1 truncate max-w-full block overflow-hidden text-ellipsis whitespace-nowrap"
              title={typeof tweet.content === 'string' ? tweet.content : JSON.stringify(tweet.content)}
            >
              {typeof tweet.content === 'string' ? tweet.content : JSON.stringify(tweet.content)}
            </p>
            <PostActions id={tweet.id} likes={tweet.likes} dislikes={tweet.dislikes} retweets={tweet.retweets} compact userName={tweet.userName || tweet.user} />
          </div>
        ))
      )}
    </div>
  )
}

export default SideBar
