type Props = {
  user: string
  content: string
}

const TweetCard = ({ user, content }: Props) => {
  return (
    <div className="bg-brown-dark p-4 rounded shadow flex flex-col">
      <p className="text-sm font-semibold">@{user}</p>
      <p className="text-sm">{content}</p>
      <div className="flex mt-2 space-x-4 text-xs text-brown-100">
        <span>💬 Comment</span>
        <span>🔁 0</span>
        <span>❤️ 0</span>
      </div>
    </div>
  )
}

export default TweetCard
