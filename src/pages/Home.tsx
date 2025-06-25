import { useUser } from '../context/UserContext'
import { useNavigate } from 'react-router-dom';
import { useState, useEffect  } from 'react'
import TopBar from '../components/TopBar'
import SideBar from '../components/SideBar'
import TweetForm from '../components/TweetForm'
import TweetCard from '../components/TweetCard'

type Tweet = {
  id: string
  user: string
  content: string
}

const Home = () => {
  const { user } = useUser()
  const navigate = useNavigate()
  const [myTweets, setMyTweets] = useState<Tweet[]>([])

  useEffect(() => {
    if (!user) {
      navigate('/')
    }
  }, [user, navigate])
  
  if (!user) return null

  return (
    <div className="h-screen flex bg-brown-light text-white">
      <SideBar />
      <main className="flex-1 p-6 flex flex-col overflow-y-auto">
        <TopBar />
        <TweetForm onPost={(tweet) => setMyTweets([tweet, ...myTweets])} />
        <div className="space-y-4">
          {myTweets.map((tweet) => (
            <TweetCard key={tweet.id} user={tweet.user} content={tweet.content} />
          ))}
        </div>
      </main>
    </div>
  )
}

export default Home
