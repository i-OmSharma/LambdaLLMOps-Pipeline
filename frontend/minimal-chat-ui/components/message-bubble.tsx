"use client"

import { cn } from "@/lib/utils"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

interface MessageBubbleProps {
  message: Message
  isLast: boolean
}

export function MessageBubble({ message, isLast }: MessageBubbleProps) {
  const isUser = message.role === "user"

  return (
    <div
      className={cn(
        "flex w-full animate-in slide-in-from-bottom-smooth duration-500 ease-out px-1 sm:px-0",
        isUser ? "justify-end" : "justify-start",
      )}
    >
      <div
        className={cn(
          "max-w-[85%] sm:max-w-[80%] md:max-w-[70%] lg:max-w-[60%] rounded-2xl px-3 py-2 sm:px-4 sm:py-3 shadow-sm transition-all duration-300 ease-in-out hover:shadow-lg transform hover:scale-[1.02]",
          isUser
            ? "bg-gray-900 text-white rounded-br-md"
            : "bg-white text-gray-900 border border-gray-200 rounded-bl-md",
        )}
      >
        <div className="whitespace-pre-wrap break-words text-xs sm:text-sm leading-relaxed">{message.content}</div>
        <div
          className={cn(
            "text-[9px] sm:text-[10px] mt-1 opacity-60 transition-opacity duration-200",
            isUser ? "text-gray-300 text-right" : "text-gray-500 text-left",
          )}
        >
          {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </div>
      </div>
    </div>
  )
}
