import { openai } from '@ai-sdk/openai'
import { streamText } from 'ai'
import OpenAI from 'openai'

export const runtime = 'edge'

const openAIClient = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(req: Request) {
  const { messages, model } = await req.json()

  try {
    switch (model) {
      case 'v0':
        return handleV0(messages)
      case 'chatgpt':
        return handleChatGPT(messages)
      case 'gemini':
        return handleGemini(messages)
      case 'claude':
        return handleClaude(messages)
      default:
        return new Response('Invalid model selected', { status: 400 })
    }
  } catch (error) {
    console.error('Error in chat API:', error)
    return new Response('An error occurred while processing your request', { status: 500 })
  }
}

async function handleV0(messages: any[]) {
  const result = streamText({
    model: openai('gpt-4-turbo'),
    messages,
  })
  return result.toDataStreamResponse()
}

async function handleChatGPT(messages: any[]) {
  const stream = await openAIClient.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages,
    stream: true,
  })

  const encoder = new TextEncoder()
  const decoder = new TextDecoder()

  return new Response(
    new ReadableStream({
      async start(controller) {
        for await (const chunk of stream) {
          const content = chunk.choices[0]?.delta?.content || ''
          controller.enqueue(encoder.encode(content))
        }
        controller.close()
      },
    }),
    {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
      },
    }
  )
}

async function handleGemini(messages: any[]) {
  // Placeholder for Gemini API
  // Replace this with actual Gemini API call when you have the credentials
  await new Promise(resolve => setTimeout(resolve, 1000)) // Simulating API delay
  return new Response('This is a placeholder response from Gemini. Replace with actual API integration.', { status: 200 })
}

async function handleClaude(messages: any[]) {
  // Placeholder for Claude API
  // Replace this with actual Claude API call when you have the credentials
  await new Promise(resolve => setTimeout(resolve, 1000)) // Simulating API delay
  return new Response('This is a placeholder response from Claude. Replace with actual API integration.', { status: 200 })
}

