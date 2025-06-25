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
    if (!user) navigate('/')
  }, [user, navigate])

  if (!user) return null

  return (
    <div className="h-screen flex flex-col bg-brown-light text-white">
      {/* TopBar fixa */}
      <div className="sticky top-0 z-20 bg-brown px-6 py-4 shadow-md">
        <TopBar />
      </div>

      {/* Conteúdo principal */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Sidebar: topo no mobile, esquerda no desktop */}
        <div className="sm:h-40 h-full border-b border-brown-dark w-1/2">
          <SideBar />
        </div>

        {/* MainArea */}
        <div className="flex-1 flex flex-col relative order-2">
          {/* Lista de tweets com rolagem própria */}
          <div className="flex-1 overflow-y-auto px-4 pt-4 pb-28">
            {myTweets.map((tweet) => (
              <TweetCard key={tweet.id} user={tweet.user} content={tweet.content} />
            ))}
          </div>

          {/* Formulário fixo abaixo */}
          <div className="absolute bottom-0 left-0 right-0 bg-brown px-4 py-3 shadow-md">
            <TweetForm onPost={(tweet) => setMyTweets([tweet, ...myTweets])} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home