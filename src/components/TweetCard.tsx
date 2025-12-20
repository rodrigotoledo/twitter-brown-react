type Props = {
  user: string
  content: string
}

const TweetCard = ({ user, content }: Props) => {
  return (
    <div className="bg-vscode-sidebar p-4 rounded shadow-lg border border-vscode-border hover:border-vscode-accent transition flex flex-col">
      <p className="text-sm font-semibold text-vscode-accent">@{user}</p>
      <p className="text-sm text-vscode-text mt-2">{content}</p>
      <div className="flex mt-3 space-x-4 text-xs text-vscode-text-muted">
        <span className="hover:text-vscode-accent cursor-pointer transition">💬 Comment</span>
        <span className="hover:text-vscode-accent cursor-pointer transition">🔁 0</span>
        <span className="hover:text-vscode-accent cursor-pointer transition">❤️ 0</span>
      </div>
    </div>
  )
}

export default TweetCard
