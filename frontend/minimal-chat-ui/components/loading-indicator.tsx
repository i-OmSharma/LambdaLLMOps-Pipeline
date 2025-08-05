export function LoadingIndicator() {
  return (
    <div className="flex justify-start animate-in slide-in-from-bottom-smooth duration-400 ease-out">
      <div className="max-w-[80%] sm:max-w-[70%] md:max-w-[60%] rounded-2xl rounded-bl-md px-4 py-3 bg-white border border-gray-200 shadow-sm transition-all duration-300 ease-in-out">
        <div className="flex items-center space-x-2">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce-smooth [animation-delay:-0.3s]"></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce-smooth [animation-delay:-0.15s]"></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce-smooth"></div>
          </div>
        </div>
      </div>
    </div>
  )
}
