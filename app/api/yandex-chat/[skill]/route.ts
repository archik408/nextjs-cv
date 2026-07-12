import { NextRequest, NextResponse } from 'next/server';
import { RateLimiter, secureHeaders } from '@/lib/security';
import {
  parseWebChatTurnRequest,
  simulateWebChatTurn,
  type WebChatSkill,
} from '@/lib/yandex-chat/web-adapter';

const rateLimiter = new RateLimiter(60000, 120);
const supportedSkills = new Set<WebChatSkill>(['yandex-hub', 'yandex-witcher']);

function getClientIp(request: NextRequest): string {
  return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
}

function isSupportedSkill(value: string): value is WebChatSkill {
  return supportedSkills.has(value as WebChatSkill);
}

export async function POST(request: NextRequest, context: { params: Promise<{ skill: string }> }) {
  try {
    const { skill } = await context.params;
    if (!isSupportedSkill(skill)) {
      return NextResponse.json(
        { error: 'Неизвестный навык.' },
        { status: 404, headers: secureHeaders }
      );
    }

    if (!rateLimiter.isAllowed(getClientIp(request))) {
      return NextResponse.json(
        { error: 'Слишком много запросов. Попробуйте через минуту.' },
        { status: 429, headers: { ...secureHeaders, 'Retry-After': '60' } }
      );
    }

    const body = parseWebChatTurnRequest(await request.json().catch(() => null));
    if (!body) {
      return NextResponse.json(
        { error: 'Некорректный запрос чата.' },
        { status: 400, headers: secureHeaders }
      );
    }

    const response = await simulateWebChatTurn(skill, body);
    return NextResponse.json(response, {
      status: 200,
      headers: {
        ...secureHeaders,
        'Content-Type': 'application/json; charset=utf-8',
      },
    });
  } catch (error) {
    console.error('Yandex web chat error:', error);
    return NextResponse.json(
      { error: 'Не удалось получить ответ. Попробуйте ещё раз.' },
      { status: 500, headers: secureHeaders }
    );
  }
}
