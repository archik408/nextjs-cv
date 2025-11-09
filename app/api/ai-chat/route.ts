import { NextRequest } from 'next/server';
import { secureHeaders, sanitizeInput, RateLimiter } from '@/lib/security';

// Rate limiter: 30 requests per minute per IP
const rateLimiter = new RateLimiter(60000, 30);

// Using Hugging Face Inference API (free tier)
// You can replace this with any other free AI API that supports streaming
const AI_API_URL = 'https://router.huggingface.co/hf-inference/models/microsoft/DialoGPT-medium';
const AI_API_KEY = process.env.HUGGINGFACE_API_KEY || '';

// Alternative: Groq API (also free tier)
// const AI_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
// const AI_API_KEY = process.env.GROQ_API_KEY || '';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    // Get client IP for rate limiting
    const clientIP =
      req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';

    // Rate limiting
    if (!rateLimiter.isAllowed(clientIP)) {
      return new Response('Too Many Requests', {
        status: 429,
        headers: {
          ...secureHeaders,
          'Retry-After': '60',
        },
      });
    }

    // Parse request body
    const body = await req.json().catch(() => null);
    if (!body || typeof body !== 'object') {
      return new Response('Invalid request body', {
        status: 400,
        headers: secureHeaders,
      });
    }

    const { message, conversationHistory = [] } = body;

    // Validate and sanitize message
    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return new Response('Message is required', {
        status: 400,
        headers: secureHeaders,
      });
    }

    const sanitizedMessage = sanitizeInput(message.trim());

    // Limit message length
    if (sanitizedMessage.length > 2000) {
      return new Response('Message too long (max 2000 characters)', {
        status: 400,
        headers: secureHeaders,
      });
    }

    // Prepare request to AI API
    // For Hugging Face DialoGPT
    const requestBody = {
      inputs: {
        past_user_inputs: conversationHistory
          .filter((msg: any) => msg.role === 'user')
          .slice(-5)
          .map((msg: any) => msg.content),
        generated_responses: conversationHistory
          .filter((msg: any) => msg.role === 'assistant')
          .slice(-5)
          .map((msg: any) => msg.content),
        text: sanitizedMessage,
      },
      parameters: {
        max_new_tokens: 200,
        return_full_text: false,
      },
    };

    // Make request to AI API
    const response = await fetch(AI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(AI_API_KEY && { Authorization: `Bearer ${AI_API_KEY}` }),
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      // If API key is not set or rate limited, return a helpful message
      if (response.status === 401 || response.status === 403) {
        return new Response(
          JSON.stringify({
            error: 'AI API authentication failed. Please configure API key.',
          }),
          {
            status: 503,
            headers: {
              ...secureHeaders,
              'Content-Type': 'application/json',
            },
          }
        );
      }

      if (response.status === 503) {
        // Model is loading, wait a bit
        return new Response(
          JSON.stringify({
            error: 'AI model is loading. Please try again in a few seconds.',
          }),
          {
            status: 503,
            headers: {
              ...secureHeaders,
              'Content-Type': 'application/json',
            },
          }
        );
      }

      const errorText = await response.text().catch(() => 'Unknown error');
      return new Response(
        JSON.stringify({
          error: `AI API error: ${errorText}`,
        }),
        {
          status: response.status,
          headers: {
            ...secureHeaders,
            'Content-Type': 'application/json',
          },
        }
      );
    }

    const data = await response.json();

    // Extract response text from Hugging Face format
    let responseText = '';
    if (data && typeof data === 'object') {
      if (Array.isArray(data) && data[0]?.generated_text) {
        responseText = data[0].generated_text;
      } else if (data.generated_text) {
        responseText = data.generated_text;
      } else if (data.text) {
        responseText = data.text;
      }
    }

    // Fallback if no response
    if (!responseText || responseText.trim().length === 0) {
      responseText = "I'm sorry, I couldn't generate a response. Please try again.";
    }

    // Return streaming response
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        // Simulate streaming by sending response in chunks
        const words = responseText.split(' ');
        for (let i = 0; i < words.length; i++) {
          const chunk = (i === 0 ? '' : ' ') + words[i];
          controller.enqueue(encoder.encode(chunk));
          // Small delay to simulate streaming
          await new Promise((resolve) => setTimeout(resolve, 30));
        }

        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        ...secureHeaders,
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache, no-transform',
        Connection: 'keep-alive',
      },
    });
  } catch (error) {
    console.error('AI chat error:', error);

    return new Response(
      JSON.stringify({
        error: 'Internal server error',
      }),
      {
        status: 500,
        headers: {
          ...secureHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  }
}
