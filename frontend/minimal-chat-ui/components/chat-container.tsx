import type { ReactNode } from "react"

interface ChatContainerProps {
  children: ReactNode
}

export function ChatContainer({ children }: ChatContainerProps) {
  return <div className="flex flex-col h-full w-full">{children}</div>
}
