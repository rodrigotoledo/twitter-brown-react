import { useUser } from '../context/UserContext'
import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { usePosts } from '../context/usePosts'
import TopBar from '../components/TopBar'
import SideBar from '../components/SideBar'
import TweetForm from '../components/TweetForm'
import TweetCard from '../components/TweetCard'

import type { Post as Tweet } from '../context/PostsContext'
import MatrixLayout from '../components/MatrixLayout'

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
    <MatrixLayout>
      <div className="flex flex-col h-screen w-full text-vscode-text">
        <div className="sticky top-0 z-20 bg-vscode-sidebar px-6 py-3 shadow-lg border-b border-vscode-border flex justify-between items-center">
          <TopBar />
        </div>

        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          <div className="h-40 overflow-y-auto border-b border-vscode-border md:h-full md:w-1/3 lg:w-1/4 md:border-b-0 md:border-r">
            <SideBar />
          </div>

          <div className="flex-1 flex flex-col md:h-full min-h-0 overflow-hidden p-4">
            <h1 className='text-lg font-semibold mb-2'>My Tweets</h1>
            <div className="bg-vscode-sidebar px-4 py-3 shadow-md z-10 mb-4 rounded border border-vscode-border sticky top-0">
              <TweetForm 
                onPost={(tweet) => setMyTweets([tweet, ...myTweets])}
                onError={(err) => alert(err)}
              />
            </div>
            <div className="flex-1 min-h-0 overflow-y-auto py-4 space-y-4">
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
                  // views prop removed (not supported by TweetCard)
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
                  // views prop removed (not supported by TweetCard)
                  retweets={tweet.retweets}
                  comments={tweet.comments}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </MatrixLayout>
  )
}

export default Home
