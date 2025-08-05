"use client";

import type React from "react";
import type { HTMLFormElement } from "react";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Send, Paperclip, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  input: string;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
  selectedContext: string;
  setSelectedContext: (value: string) => void;
}

const contextOptions = [
  { value: "none", label: "No context", group: "General" },
  { value: "documents/general", label: "General Documents", group: "General" },
  {
    value: "documents/technical",
    label: "Technical Documentation",
    group: "Technical",
  },
  { value: "documents/api", label: "API Reference", group: "Technical" },
  { value: "documents/code", label: "Code Examples", group: "Technical" },
  { value: "documents/support", label: "Support Articles", group: "Support" },
  { value: "documents/faq", label: "FAQ Database", group: "Support" },
  {
    value: "documents/troubleshooting",
    label: "Troubleshooting Guides",
    group: "Support",
  },
  { value: "documents/policies", label: "Company Policies", group: "Business" },
  {
    value: "documents/procedures",
    label: "Standard Procedures",
    group: "Business",
  },
  {
    value: "documents/training",
    label: "Training Materials",
    group: "Business",
  },
];

const groupedOptions = contextOptions.reduce((acc, option) => {
  if (!acc[option.group]) {
    acc[option.group] = [];
  }
  acc[option.group].push(option);
  return acc;
}, {} as Record<string, typeof contextOptions>);

export function ChatInput({
  input,
  handleInputChange,
  handleSubmit,
  isLoading,
  selectedContext,
  setSelectedContext,
}: ChatInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [showScrollbar, setShowScrollbar] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const checkScrollbar = () => {
    if (textareaRef.current) {
      const { scrollHeight, clientHeight } = textareaRef.current;
      setShowScrollbar(scrollHeight > clientHeight);
    }
  };

  useEffect(() => {
    checkScrollbar();
  }, [input]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!input.trim() || isLoading) return;

      // Create a synthetic form event
      const syntheticEvent = {
        preventDefault: () => {},
        currentTarget: e.currentTarget.form,
      } as React.FormEvent<HTMLFormElement>;

      handleSubmit(syntheticEvent);
    }
    // Shift+Enter will naturally create a new line in textarea
  };

  const selectedOption = contextOptions.find(
    (opt) => opt.value === selectedContext
  );

  const handleOptionSelect = (value: string) => {
    setSelectedContext(value);
    setIsDropdownOpen(false);
  };

  return (
    <div className="bg-white/50 backdrop-blur-sm p-2 sm:p-4 w-full transition-all duration-300 ease-in-out">
      <div className="w-full max-w-4xl mx-auto">
        {/* Context Selection - Custom Dropdown */}
        <div
          className="mb-2 sm:mb-3 animate-in fade-in duration-300 relative"
          ref={dropdownRef}
        >
          <button
            type="button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="w-32 sm:w-40 h-7 sm:h-8 text-xs border border-gray-300 focus:border-gray-400 focus:ring-1 focus:ring-gray-400 rounded-md transition-all duration-200 ease-in-out hover:shadow-sm bg-white flex items-center justify-between px-2"
          >
            <div className="flex items-center space-x-1 flex-1 min-w-0">
              <Paperclip className="w-3 h-3 text-gray-500 transition-colors duration-200 flex-shrink-0" />
              <span className="truncate">
                {selectedOption ? selectedOption.label : "Context"}
              </span>
            </div>
            <ChevronDown
              className={cn(
                "w-3 h-3 text-gray-500 transition-transform duration-200 flex-shrink-0",
                isDropdownOpen && "rotate-180"
              )}
            />
          </button>

          {/* Custom Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute bottom-full left-0 mb-1 w-56 bg-white/95 backdrop-blur-sm border border-gray-200/80 rounded-lg shadow-lg z-50 animate-in slide-in-from-bottom-smooth fade-in-smooth duration-[350ms] max-h-64 overflow-y-auto">
              {Object.entries(groupedOptions).map(([groupName, options]) => (
                <div key={groupName} className="py-1">
                  <div className="px-3 py-1 text-xs font-medium text-gray-500 uppercase tracking-wide">
                    {groupName}
                  </div>
                  {options.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => handleOptionSelect(option.value)}
                      className={cn(
                        "w-full text-left px-3 py-2 text-xs hover:bg-gray-100 transition-colors duration-150 flex items-center space-x-2",
                        selectedContext === option.value &&
                          "bg-gray-50 text-gray-900 font-medium"
                      )}
                    >
                      <span className="truncate">{option.label}</span>
                      {selectedContext === option.value && (
                        <div className="w-1.5 h-1.5 bg-gray-900 rounded-full flex-shrink-0 ml-auto" />
                      )}
                    </button>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Message Input */}
        <form
          onSubmit={handleSubmit}
          className="flex items-start space-x-2 sm:space-x-3 animate-in fade-in duration-400"
        >
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => handleInputChange(e as any)}
              onKeyDown={onKeyDown}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="Type your message..."
              disabled={isLoading}
              rows={1}
              className={cn(
                "w-full min-h-[40px] sm:min-h-[48px] max-h-24 sm:max-h-32 px-3 py-2 sm:px-4 sm:py-3 text-xs sm:text-sm border border-gray-300 rounded-lg transition-all duration-300 ease-in-out resize-none",
                "focus:border-gray-400 focus:ring-2 focus:ring-gray-400/20 focus:outline-none focus:shadow-md",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                "hover:shadow-sm hover:border-gray-400",
                showScrollbar ? "scrollbar-visible" : "scrollbar-hidden",
                isFocused && "shadow-md transform scale-[1.01]"
              )}
              style={{
                height: "auto",
                minHeight:
                  isClient && window.innerWidth < 640 ? "40px" : "48px",
                transition: "height 0.2s ease-in-out",
              }}
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = "auto";
                const maxHeight =
                  isClient && window.innerWidth < 640 ? 96 : 128;
                target.style.height =
                  Math.min(target.scrollHeight, maxHeight) + "px";
                checkScrollbar();
              }}
              onScroll={checkScrollbar}
              aria-label="Message input"
            />
          </div>

          <Button
            type="submit"
            disabled={!input.trim() || isLoading}
            size="sm"
            className={cn(
              "h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-gray-900 hover:bg-gray-800 disabled:opacity-50 flex items-center justify-center flex-shrink-0 mt-0",
              "transition-all duration-300 ease-in-out shadow-sm hover:shadow-lg transform hover:scale-105 active:scale-95",
              "focus:ring-2 focus:ring-gray-400/20 focus:ring-offset-2",
              isLoading && "animate-pulse"
            )}
            aria-label="Send message"
          >
            <Send
              className={cn(
                "w-3 h-3 sm:w-4 sm:h-4 transition-transform duration-200 ease-in-out",
                isLoading && "animate-spin"
              )}
            />
          </Button>
        </form>

        {/* Input Helper Text - Hidden on mobile */}
        <div className="hidden sm:flex mt-2 text-xs text-gray-500 items-center justify-between animate-in fade-in duration-500 opacity-70 hover:opacity-100 transition-opacity duration-200">
          <span>Press Enter to send, Shift+Enter for new line</span>
          {selectedContext && selectedContext !== "none" && (
            <span className="text-gray-600 animate-in slide-in-from-right duration-300">
              Context: {selectedOption?.label}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
