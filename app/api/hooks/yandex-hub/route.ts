import { NextRequest, NextResponse } from 'next/server';
import { handleYandexAliceRequest } from '@/lib/yandex-hub/handler';
import type { YandexAliceRequest } from '@/lib/yandex-hub/types';
import { YANDEX_DIALOGS_VERSION } from '@/lib/yandex-hub/types';
import { RateLimiter, secureHeaders } from '@/lib/security';

const rateLimiter = new RateLimiter(60000, 120);

function getClientIp(request: NextRequest): string {
  return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
}

function isValidAliceRequest(body: unknown): body is YandexAliceRequest {
  if (!body || typeof body !== 'object') {
    return false;
  }

  const candidate = body as Partial<YandexAliceRequest>;

  return (
    candidate.version === YANDEX_DIALOGS_VERSION &&
    typeof candidate.session === 'object' &&
    candidate.session !== null &&
    typeof candidate.session.session_id === 'string' &&
    typeof candidate.session.skill_id === 'string' &&
    typeof candidate.request === 'object' &&
    candidate.request !== null &&
    typeof candidate.request.type === 'string'
  );
}

function verifyWebhookAuth(request: NextRequest, body: YandexAliceRequest): string | null {
  const expectedSkillId = process.env.YANDEX_HUB_SKILL_ID;
  if (expectedSkillId && body.session.skill_id !== expectedSkillId) {
    return 'Invalid skill id';
  }

  const webhookSecret = process.env.YANDEX_HUB_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return null;
  }

  const authorization = request.headers.get('authorization') || '';
  const expected = `Bearer ${webhookSecret}`;
  if (authorization !== expected) {
    return 'Unauthorized';
  }

  return null;
}

export async function GET() {
  return NextResponse.json(
    {
      ok: true,
      service: 'microbit',
      skill: 'Мой microbit',
      protocol: 'yandex-dialogs-alice',
      version: YANDEX_DIALOGS_VERSION,
      endpoint: '/api/hooks/yandex-hub',
    },
    { headers: secureHeaders }
  );
}

export async function POST(request: NextRequest) {
  try {
    const clientIp = getClientIp(request);

    if (!rateLimiter.isAllowed(clientIp)) {
      return NextResponse.json(
        { error: 'Too Many Requests' },
        { status: 429, headers: { ...secureHeaders, 'Retry-After': '60' } }
      );
    }

    const body: unknown = await request.json().catch(() => null);
    if (!isValidAliceRequest(body)) {
      return NextResponse.json(
        { error: 'Invalid Yandex Dialogs request' },
        { status: 400, headers: secureHeaders }
      );
    }

    const authError = verifyWebhookAuth(request, body);
    if (authError) {
      return NextResponse.json({ error: authError }, { status: 401, headers: secureHeaders });
    }

    const response = await handleYandexAliceRequest(body);

    return NextResponse.json(response, {
      status: 200,
      headers: {
        ...secureHeaders,
        'Content-Type': 'application/json; charset=utf-8',
      },
    });
  } catch (error) {
    console.error('Yandex hub webhook error:', error);

    return NextResponse.json(
      {
        version: YANDEX_DIALOGS_VERSION,
        response: {
          text: 'Произошла ошибка на сервере. Попробуйте ещё раз.',
          tts: 'Произошла ошибка на сервере. Попробуйте ещё раз.',
          end_session: false,
        },
      },
      { status: 500, headers: secureHeaders }
    );
  }
}
