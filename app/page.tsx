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
    <div className="flex flex-col h-screen bg-background text-foreground">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="gradient-blob">
          <div className="blob blob-green"></div>
          <div className="blob blob-blue"></div>
          <div className="blob blob-purple"></div>
        </div>
      </div>

      <header className="bg-background/50 backdrop-blur-md p-4 shadow-md z-10">
        <h1 className="text-5xl font-bold text-center bigbots-text">
          BigBots
        </h1>
      </header>

      <main className="flex-grow overflow-auto p-4 space-y-4">
        <div className="space-y-4 max-w-3xl mx-auto">
          {messages.map((m, index) => (
            <div
              key={index}
              className={`p-3 rounded-lg frosted-glass ${
                m.role === 'user'
                  ? 'ml-auto bg-primary text-primary-foreground'
                  : 'mr-auto bg-secondary text-secondary-foreground'
              } max-w-md`}
            >
              <strong>{m.role === 'user' ? 'You: ' : 'AI: '}</strong>
              {m.content}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </main>

      <footer className="bg-background/50 backdrop-blur-md p-4 z-10">
        <form onSubmit={handleSubmit} className="flex items-center gap-2 max-w-3xl mx-auto">
          <div className="flex-grow relative">
            <Select onValueChange={setSelectedModel} defaultValue={selectedModel}>
              <SelectTrigger className="w-[120px] absolute left-2 top-1/2 transform -translate-y-1/2 z-20 bg-muted/50 backdrop-blur-lg text-foreground border-none h-8">
                <SelectValue placeholder="AI Model" />
              </SelectTrigger>
              <SelectContent className="bg-background text-foreground border-border">
                {AI_MODELS.map((model) => (
                  <SelectItem key={model.value} value={model.value} className="hover:bg-muted">
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
              className="w-full h-10 px-3 bg-background/50 backdrop-blur-lg text-foreground placeholder-muted-foreground border-none focus:ring-2 focus:ring-ring rounded-md pl-[140px] transition-all duration-300 ease-in-out"
            />
          </div>
          <Button 
            type="submit" 
            disabled={isLoading} 
            className="bg-primary hover:bg-primary/90 text-primary-foreground p-2 rounded-full h-10 w-10 flex items-center justify-center"
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Send className="h-5 w-5" />
            )}
            <span className="sr-only">Send</span>
          </Button>
        </form>
      </footer>
    </div>
  )
}

