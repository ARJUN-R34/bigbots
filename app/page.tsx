'use client'

import { useState, useRef, useEffect } from 'react'
import { useChat } from '../hooks/useChat'
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Send } from 'lucide-react'

const AI_MODELS = [
  { value: 'v0', label: 'v0 (OpenAI)' },
  { value: 'chatgpt', label: 'ChatGPT' },
  { value: 'gemini', label: 'Gemini' },
  { value: 'claude', label: 'Claude' },
]

export default function Home() {
  const [selectedModel, setSelectedModel] = useState(AI_MODELS[0].value)
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat(selectedModel)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
    <div className="relative flex flex-col min-h-screen bg-background">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="gradient-blob">
          <div className="blob blob-green"></div>
          <div className="blob blob-blue"></div>
          <div className="blob blob-purple"></div>
        </div>
      </div>

      <header className="sticky top-0 z-10 bg-background/40 backdrop-blur-xl border-b border-white/10">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-4xl font-bold text-center bigbots-text">
            BigBots
          </h1>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8 z-10">
        <div className="max-w-3xl mx-auto space-y-4">
          {messages.map((m, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg frosted-glass max-w-[85%] ${
                m.role === 'user' ? 'ml-auto bg-primary/10' : 'mr-auto bg-secondary/10'
              }`}
            >
              <div className="text-sm font-medium mb-1">
                {m.role === 'user' ? 'You' : 'AI'}
              </div>
              <div className="text-sm leading-relaxed whitespace-pre-wrap">
                {m.content}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </main>

      <footer className="sticky bottom-0 z-10 bg-background/40 backdrop-blur-xl border-t border-white/10">
        <div className="container mx-auto px-4 py-4">
          <form onSubmit={handleSubmit} className="max-w-3xl mx-auto flex gap-2">
            <div className="relative flex-1">
              <Select value={selectedModel} onValueChange={setSelectedModel}>
                <SelectTrigger className="absolute left-2 top-1/2 -translate-y-1/2 w-[120px] h-8 text-xs bg-background/50">
                  <SelectValue placeholder="Select Model" />
                </SelectTrigger>
                <SelectContent>
                  {AI_MODELS.map((model) => (
                    <SelectItem key={model.value} value={model.value}>
                      {model.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <input
                type="text"
                value={input}
                onChange={handleInputChange}
                placeholder="Ask me anything..."
                className="w-full h-12 pl-[140px] pr-4 rounded-lg bg-secondary/10 focus:ring-2 focus:ring-primary/20 border-0 placeholder:text-muted-foreground"
              />
            </div>
            <Button
              type="submit"
              size="icon"
              disabled={isLoading}
              className="h-12 w-12 shrink-0 rounded-lg"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Send className="h-5 w-5" />
              )}
              <span className="sr-only">Send message</span>
            </Button>
          </form>
        </div>
      </footer>
    </div>
  )
}

