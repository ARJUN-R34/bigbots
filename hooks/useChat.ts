import { useState, useCallback, useEffect, useRef } from 'react'
import { useChat as useAIChat } from 'ai/react'

export function useChat(initialModel: string) {
  const [selectedModel, setSelectedModel] = useState(initialModel)
  const [isLoading, setIsLoading] = useState(false)

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit: aiHandleSubmit,
    setMessages,
  } = useAIChat({
    api: '/api/chat',
    body: { model: selectedModel },
    onResponse: () => {
      setIsLoading(false)
    },
  })

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      setIsLoading(true)
      aiHandleSubmit(e)
    },
    [aiHandleSubmit]
  )

  useEffect(() => {
    setMessages([])
  }, [selectedModel, setMessages])

  const scrollToBottom = useCallback(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  const messagesEndRef = useRef<HTMLDivElement>(null)

  return {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    setSelectedModel,
    isLoading,
    messagesEndRef,
  }
}

