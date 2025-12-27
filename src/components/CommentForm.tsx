import { useState } from 'react'
import { Send } from 'lucide-react'

export type Comment = {
  id: string
  user: string
  content: string
}

type Props = {
  onAdd: (comment: Comment) => void
  user: string
}

const CommentForm = ({ onAdd, user }: Props) => {
  const [text, setText] = useState('')

  const handleAdd = () => {
    if (text.trim()) {
      onAdd({
        id: crypto.randomUUID(),
        user,
        content: text.trim(),
      })
      setText('')
    }
  }

  return (
    <div className="flex gap-2 mt-2">
      <input
        type="text"
        value={text}
        onChange={e => setText(e.target.value)}
        className="flex-1 p-2 rounded bg-vscode-input text-vscode-text border border-vscode-border focus:border-vscode-border placeholder-vscode-text-muted outline-none"
        placeholder="Add a comment..."
        onKeyDown={e => {
          if (e.key === 'Enter') {
            e.preventDefault();
            handleAdd();
          }
        }}
      />
      <button
        type="button"
        onClick={handleAdd}
        className="flex items-center gap-1 px-3 py-2 rounded font-semibold text-vscode-text bg-vscode-sidebar border border-vscode-border hover:bg-vscode-hover focus:outline-none focus:border-vscode-border transition shadow"
        title="Enviar comentário"
      >
        <Send size={18} />
        Comentar
      </button>
    </div>
  )
}

export default CommentForm
