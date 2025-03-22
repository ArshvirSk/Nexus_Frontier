import { ReactNode } from "react";

interface FontProviderProps {
  children: ReactNode;
}

export function FontProvider({ children }: FontProviderProps) {
  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700&display=swap"
        rel="stylesheet"
      />
      {children}
    </>
  );
}
