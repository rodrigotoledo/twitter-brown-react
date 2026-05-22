import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useToast } from '../context/ToastContext'

type Tweet = {
  id: string
  user: string
  content: string
}

const SideBar = () => {
  const { toast } = useToast()
  const { data: externalTweets, isLoading, isError } = useQuery<Tweet[]>({
    queryKey: ['externalTweets'],
    queryFn: async () => {
      const res = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=20')
      if (!res.ok) throw new Error('Failed to load tweets')
      const data = await res.json()
      return data.map((item: any) => ({
        id: item.id.toString(),
        user: `user${item.userId}`,
        content: item.body,
      }))
    },
  })

  useEffect(() => {
    if (isError) toast.error('Could not load latest tweets.')
  }, [isError, toast])

  return (
    <div className="w-full p-4 md:border-r border-cursor-dark overflow-y-auto">
      <h2 className="text-xl font-semibold mb-4">Latest Tweets</h2>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        externalTweets?.map((tweet: Tweet) => (
          <div key={tweet.id} className="mb-3 bg-cursor-dark p-2 rounded">
            <p className="text-sm font-semibold">@{tweet.user}</p>
            <p className="text-sm">{tweet.content}</p>
          </div>
        ))
      )}
    </div>
  )
}

export default SideBar
