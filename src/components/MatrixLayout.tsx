import MatrixRain from "react-matrix-rain";
import { ReactNode } from "react";

/**
 * Matrix shell: animated rain + darkening overlay so foreground content stays readable.
 * Density is tuned below “full Matrix” so the layout stays usable.
 */
export default function MatrixLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-vscode-bg text-vscode-text">
      <MatrixRain
        color="#5cff89"
        backgroundColor="#020603"
        density={0.48}
        zIndex={0}
      />
      <div
        className="pointer-events-none absolute inset-0 z-10 bg-[radial-gradient(ellipse_100%_60%_at_50%_0%,rgba(92,255,137,0.11),transparent_45%),linear-gradient(180deg,rgba(1,3,2,0.2),rgba(1,3,2,0.82))]"
        aria-hidden
      />
      <div className="relative z-20 w-full">{children}</div>
    </div>
  );
}
