import { NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const lemonfoxApiKey = process.env.LEMONFOX_API_KEY;
    const lemonfoxApiBaseUrl = process.env.LEMONFOX_API_ENDPOINT;

    if (!lemonfoxApiKey || !lemonfoxApiBaseUrl) {
      console.error('API Key or Base URL is not configured in .env.local');
      return NextResponse.json({ error: 'Server configuration error: API keys are missing.' }, { status: 500 });
    }

    const openai = new OpenAI({
      apiKey: lemonfoxApiKey,
      baseURL: lemonfoxApiBaseUrl,
    });

    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a helpful English language tutor. Your primary function is to answer questions strictly related to English grammar, vocabulary, sentence structure, pronunciation, and other language-learning topics. If a user asks a question that is *not* about the English language, you must politely decline to answer and state that you can only assist with English-related queries. Do not answer questions outside of this scope. Examples of acceptable questions: 'How to use past perfect tense?', 'What are the V1, V2, V3 forms of 'go'?', 'Explain the difference between 'affect' and 'effect'.'. Examples of unacceptable questions: 'What is the capital of France?', 'Tell me about the latest news.', 'Can you tell me a joke?'.",
        },
        { role: "user", content: message },
      ],
      model: "llama-8b-chat", 
      temperature: 0.7,
      max_tokens: 500,
    });

    const assistantMessage = completion.choices[0]?.message?.content;

    if (assistantMessage) {
      return NextResponse.json({ message: assistantMessage }, { status: 200 });
    } else {
      console.error('Unexpected API response structure:', completion);
      return NextResponse.json({ error: 'Could not get a valid response from Lemonfox AI.' }, { status: 500 });
    }

  } catch (error: any) {
    console.error('Lemonfox AI API Error:', error);

    if (error.response?.status) {
      return NextResponse.json(
        { error: `Lemonfox API Error: ${error.response.data.message || error.response.statusText}` },
        { status: error.response.status }
      );
    } else if (error.message.includes('Invalid Authentication')) {
      return NextResponse.json({ error: 'Unauthorized: Invalid Lemonfox API Key. Please check your .env.local.' }, { status: 401 });
    } else {
      return NextResponse.json({ error: `An unexpected error occurred: ${error.message}` }, { status: 500 });
    }
  }
}