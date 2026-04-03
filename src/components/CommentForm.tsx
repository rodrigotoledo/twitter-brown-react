import { useState } from "react";
import { Send } from "lucide-react";

export type Comment = {
  id: string;
  user: string;
  content: string;
};

type Props = {
  onAdd: (comment: Comment) => void;
  user: string;
};

const CommentForm = ({ onAdd, user }: Props) => {
  const [text, setText] = useState("");

  const handleAdd = () => {
    if (text.trim()) {
      onAdd({
        id: crypto.randomUUID(),
        user,
        content: text.trim(),
      });
      setText("");
    }
  };

  return (
    <div className="flex gap-2 mt-2">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="flex-1 rounded-xl border border-vscode-border bg-vscode-input p-2 text-vscode-text outline-none placeholder-vscode-text-muted focus:border-vscode-accent focus:ring-1 focus:ring-vscode-accent/30"
        placeholder="Add a comment..."
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            handleAdd();
          }
        }}
      />
      <button
        type="button"
        onClick={handleAdd}
        className="inline-flex shrink-0 items-center gap-1 rounded-full bg-vscode-accent px-3 py-2 text-sm font-bold text-vscode-accent-ink transition hover:bg-vscode-accent-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-vscode-accent/50"
        title="Send comment"
      >
        <Send size={18} />
        Comment
      </button>
    </div>
  );
};

export default CommentForm;
