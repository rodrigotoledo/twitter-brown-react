type Props = {
  /** Without @ prefix; displayed as @handle */
  username: string;
};

/** Readable timeline title: solid panel, no glow on text, wraps long handles. */
export default function PageHeading({ username }: Props) {
  if (!username?.trim()) return null;
  const handle = `@${username.trim()}`;
  return (
    <header className="mb-5 rounded-2xl border border-vscode-border bg-vscode-sidebar/95 px-4 py-4 shadow-[inset_0_1px_0_0_rgba(92,255,137,0.12)] sm:px-5 sm:py-5">
      <h1 className="flex flex-col gap-2">
        <span className="text-sm font-medium leading-normal text-vscode-text-muted">
          Tweets by
        </span>
        <span
          className="max-w-full wrap-break-word text-2xl font-bold leading-tight tracking-normal text-vscode-accent sm:text-[1.65rem]"
          title={handle}
        >
          {handle}
        </span>
      </h1>
    </header>
  );
}
