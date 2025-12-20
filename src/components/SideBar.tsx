import { useQuery } from '@tanstack/react-query'

type Tweet = {
  id: string
  user: string
  content: string
}

type ExternalPost = {
  id: number
  userId: number
  body: string
}

const SideBar = () => {
  const { data: externalTweets, isLoading } = useQuery<Tweet[]>({
    queryKey: ['externalTweets'],
    queryFn: async () => {
      const res = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=20')
      const data: ExternalPost[] = await res.json()
      return data.map((item: ExternalPost) => ({
        id: item.id.toString(),
        user: `user${item.userId}`,
        content: item.body,
      }))
    },
  })

  return (
    <div className="w-full p-4 md:border-r border-vscode-border overflow-y-auto bg-vscode-sidebar">
      <h2 className="text-xl font-semibold mb-4 text-vscode-text">Latest Tweets</h2>
      {isLoading ? (
        <p className="text-vscode-text-muted">Loading...</p>
      ) : (
        externalTweets?.map((tweet: Tweet) => (
          <div key={tweet.id} className="mb-3 bg-vscode-input p-3 rounded border border-vscode-border hover:bg-vscode-hover transition">
            <p className="text-sm font-semibold text-vscode-accent">@{tweet.user}</p>
            <p className="text-sm text-vscode-text mt-1">{tweet.content}</p>
          </div>
        ))
      )}
    </div>
  )
}

export default SideBar
