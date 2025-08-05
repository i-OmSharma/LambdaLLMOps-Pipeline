"use client"

import { useEffect, useRef } from "react"
import { MessageBubble } from "./message-bubble"
import { LoadingIndicator } from "./loading-indicator"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

interface MessageListProps {
  messages: Message[]
  isLoading: boolean
}

export function MessageList({ messages, isLoading }: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isLoading])

  return (
    <div ref={containerRef} className="flex-1 overflow-y-auto px-2 sm:px-4 py-4 sm:py-6 w-full chat-scrollbar">
      <div className="w-full max-w-4xl mx-auto min-h-full flex flex-col justify-end">
        {/* Empty state - only show when no messages */}
        {messages.length === 0 && (
          <div className="flex items-center justify-center flex-1 min-h-[60vh]">
            <div className="text-center space-y-3">
              <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center">
                <svg
                  className="w-6 h-6 sm:w-8 sm:h-8 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </div>
              <h3 className="text-base sm:text-lg font-medium text-gray-900">Start a conversation</h3>
              <p className="text-xs sm:text-sm text-gray-500 max-w-xs sm:max-w-sm px-4">
                Send a message to begin chatting. Select a context from the dropdown to provide additional information.
              </p>
            </div>
          </div>
        )}

        {/* Messages container - starts from bottom */}
        {messages.length > 0 && (
          <div className="space-y-3 sm:space-y-4 py-4">
            {messages.map((message, index) => (
              <MessageBubble key={message.id} message={message} isLast={index === messages.length - 1} />
            ))}

            {isLoading && <LoadingIndicator />}
          </div>
        )}

        {/* Scroll anchor */}
        <div ref={messagesEndRef} />
      </div>
    </div>
  )
}
