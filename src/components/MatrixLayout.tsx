import MatrixRain from 'react-matrix-rain';
import { ReactNode } from 'react';

export default function MatrixLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <MatrixRain
        color="#000000"
        backgroundColor="#252526"
        density={0.7}
        zIndex={0}
      />
      <div className="relative z-10 w-full ">
        {children}
      </div>
    </div>
  );
}
