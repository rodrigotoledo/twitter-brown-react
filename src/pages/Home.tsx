import { useUser } from '../context/UserContext'
import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { usePosts } from '../context/PostsContext'
import TopBar from '../components/TopBar'
import SideBar from '../components/SideBar'
import TweetForm from '../components/TweetForm'
import TweetCard from '../components/TweetCard'

import type { Post as Tweet } from '../context/PostsContext'

const Home = () => {
  const { user } = useUser()
  const navigate = useNavigate()

  const [myTweets, setMyTweets] = useState<Tweet[]>([])
  const { posts: externalPosts, isLoading: loadingPosts } = usePosts();

  useEffect(() => {
    if (!user) navigate('/')
  }, [user, navigate])

  if (!user) return null

  return (
    <div className="h-screen flex flex-col bg-vscode-bg text-vscode-text">
      <div className="sticky top-0 z-20 bg-vscode-sidebar px-6 py-3 shadow-lg border-b border-vscode-border flex justify-between items-center">
        <TopBar />
      </div>

      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        <div className="h-40 overflow-y-auto border-b border-vscode-border md:h-full md:w-1/3 lg:w-1/4 md:border-b-0 md:border-r">
          <SideBar />
        </div>

        <div className="flex-1 flex flex-col md:h-full overflow-hidden p-4">
          <h1 className='text-lg font-semibold mb-2'>My Tweets</h1>
          <div className="flex-1 overflow-y-auto py-4 space-y-4">
            {myTweets.map((tweet) => (
              <TweetCard
                key={tweet.id}
                id={tweet.id}
                user={tweet.user}
                userName={tweet.userName}
                userFullName={tweet.userFullName}
                content={tweet.content}
                title={tweet.title}
                tags={tweet.tags}
                likes={tweet.likes}
                dislikes={tweet.dislikes}
                views={tweet.views}
                retweets={tweet.retweets}
                comments={tweet.comments}
              />
            ))}
            {loadingPosts && <p className="text-vscode-text-muted">Carregando posts...</p>}
            {externalPosts && externalPosts.map((tweet: Tweet) => (
              <TweetCard
                key={tweet.id}
                id={tweet.id}
                user={tweet.user}
                userName={tweet.userName}
                userFullName={tweet.userFullName}
                content={tweet.content}
                title={tweet.title}
                tags={tweet.tags}
                likes={tweet.likes}
                dislikes={tweet.dislikes}
                views={tweet.views}
                retweets={tweet.retweets}
                comments={tweet.comments}
              />
            ))}
          </div>

          <div className="bg-vscode-sidebar px-4 py-3 shadow-md z-10 sticky bottom-0 mb-3 rounded border border-vscode-border">
            <TweetForm onPost={(tweet) => setMyTweets([tweet, ...myTweets])} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
