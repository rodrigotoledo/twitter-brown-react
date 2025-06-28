import { useQuery } from '@tanstack/react-query'

type Tweet = {
  id: string
  user: string
  content: string
}

const SideBar = () => {
  const { data: externalTweets, isLoading } = useQuery<Tweet[]>({
    queryKey: ['externalTweets'],
    queryFn: async () => {
      const res = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=20')
      const data = await res.json()
      return data.map((item: any) => ({
        id: item.id.toString(),
        user: `user${item.userId}`,
        content: item.body,
      }))
    },
  })

  return (
    <div className="w-full p-4 md:border-r border-brown-dark overflow-y-auto">
      <h2 className="text-xl font-semibold mb-4">Latest Tweets</h2>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        externalTweets?.map((tweet: Tweet) => (
          <div key={tweet.id} className="mb-3 bg-brown-dark p-2 rounded">
            <p className="text-sm font-semibold">@{tweet.user}</p>
            <p className="text-sm">{tweet.content}</p>
          </div>
        ))
      )}
    </div>
  )
}

export default SideBar
