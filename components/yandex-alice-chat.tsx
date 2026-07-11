'use client';

import { FormEvent, KeyboardEvent, useEffect, useRef, useState } from 'react';
import { Bot, Loader2, RefreshCcw, Send, User } from 'lucide-react';
import NavigationButtons from '@/components/navigation-buttons';

interface ChatButton {
  title: string;
  payload?: Record<string, unknown>;
}

interface ChatMessage {
  id: number;
  role: 'user' | 'assistant';
  content: string;
}

interface ChatResponse {
  text: string;
  buttons: ChatButton[];
  endSession: boolean;
  sessionState?: Record<string, unknown>;
}

interface YandexAliceChatProps {
  skill: 'yandex-hub' | 'yandex-witcher';
  title: string;
  description: string;
  startText: string;
  infoText: string;
  accent: 'blue' | 'purple';
}

const accentStyles = {
  blue: {
    avatar: 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300',
    primary: 'bg-blue-600 hover:bg-blue-700 focus-visible:ring-blue-500',
    option:
      'border-blue-300 text-blue-700 hover:bg-blue-50 focus-visible:ring-blue-500 dark:border-blue-700 dark:text-blue-300 dark:hover:bg-blue-950',
    info: 'border-blue-200 bg-blue-50 text-blue-800 dark:border-blue-800 dark:bg-blue-900/20 dark:text-blue-200',
  },
  purple: {
    avatar: 'bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300',
    primary: 'bg-purple-600 hover:bg-purple-700 focus-visible:ring-purple-500',
    option:
      'border-purple-300 text-purple-700 hover:bg-purple-50 focus-visible:ring-purple-500 dark:border-purple-700 dark:text-purple-300 dark:hover:bg-purple-950',
    info: 'border-purple-200 bg-purple-50 text-purple-800 dark:border-purple-800 dark:bg-purple-900/20 dark:text-purple-200',
  },
} as const;

function createSessionId(): string {
  if (typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }

  const bytes = crypto.getRandomValues(new Uint8Array(16));
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('');
}

function isChatResponse(value: unknown): value is ChatResponse {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const candidate = value as Partial<ChatResponse>;
  return (
    typeof candidate.text === 'string' &&
    Array.isArray(candidate.buttons) &&
    candidate.buttons.every(
      (button) =>
        button &&
        typeof button === 'object' &&
        typeof button.title === 'string' &&
        (button.payload === undefined ||
          (typeof button.payload === 'object' &&
            button.payload !== null &&
            !Array.isArray(button.payload)))
    ) &&
    typeof candidate.endSession === 'boolean'
  );
}

export function YandexAliceChat({
  skill,
  title,
  description,
  startText,
  infoText,
  accent,
}: YandexAliceChatProps) {
  const styles = accentStyles[accent];
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [options, setOptions] = useState<ChatButton[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const [isEnded, setIsEnded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const sessionIdRef = useRef('');
  const sessionStateRef = useRef<Record<string, unknown> | undefined>(undefined);
  const messageIdRef = useRef(0);
  const localMessageIdRef = useRef(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView?.({ behavior: 'smooth', block: 'nearest' });
  }, [messages, options, isLoading]);

  const appendMessage = (role: ChatMessage['role'], content: string) => {
    localMessageIdRef.current += 1;
    const message: ChatMessage = {
      id: localMessageIdRef.current,
      role,
      content,
    };
    setMessages((current) => [...current, message]);
  };

  const sendTurn = async (
    command: string,
    payload?: Record<string, unknown>,
    isNew = false,
    showUserMessage = true
  ) => {
    const normalizedCommand = command.trim();
    if (isLoading || (!isNew && !normalizedCommand)) {
      return;
    }

    if (showUserMessage) {
      appendMessage('user', normalizedCommand);
    }
    setInput('');
    setOptions([]);
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch(`/api/yandex-chat/${skill}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          command: normalizedCommand,
          sessionId: sessionIdRef.current,
          messageId: messageIdRef.current,
          isNew,
          ...(payload ? { payload } : {}),
          ...(sessionStateRef.current ? { sessionState: sessionStateRef.current } : {}),
        }),
      });
      const result: unknown = await response.json().catch(() => null);

      if (!response.ok) {
        const errorMessage =
          result && typeof result === 'object' && 'error' in result
            ? String(result.error)
            : 'Не удалось получить ответ.';
        throw new Error(errorMessage);
      }
      if (!isChatResponse(result)) {
        throw new Error('Сервер вернул ответ в неизвестном формате.');
      }

      messageIdRef.current += 1;
      sessionStateRef.current = result.sessionState;
      appendMessage('assistant', result.text);
      setOptions(result.endSession ? [] : result.buttons);
      setIsEnded(result.endSession);

      if (!result.endSession) {
        window.setTimeout(() => inputRef.current?.focus(), 0);
      }
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'Не удалось получить ответ. Попробуйте ещё раз.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const startSession = () => {
    sessionIdRef.current = createSessionId();
    sessionStateRef.current = undefined;
    messageIdRef.current = 0;
    localMessageIdRef.current = 0;
    setMessages([]);
    setOptions([]);
    setError(null);
    setIsEnded(false);
    setIsStarted(true);
    void sendTurn('', undefined, true, false);
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    void sendTurn(input);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      if (input.trim() && !isLoading && !isEnded) {
        void sendTurn(input);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 text-gray-900 dark:from-gray-900 dark:to-gray-800 dark:text-white">
      <NavigationButtons
        levelUp="tools"
        locale="ru"
        showLanguageSwitcher={false}
        showThemeSwitcher
      />

      <main id="main-content" className="container mx-auto px-4 py-14 md:py-8">
        <div className="mx-auto max-w-4xl">
          <header className="mb-8 text-center">
            <h1 className="mb-4 text-4xl font-bold">{title}</h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">{description}</p>
          </header>

          <section
            aria-label={`Текстовый диалог с навыком «${title}»`}
            className="flex h-[620px] min-h-[500px] max-h-[72vh] flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800"
          >
            <div
              role="log"
              aria-live="polite"
              aria-busy={isLoading}
              aria-relevant="additions text"
              className="flex-1 space-y-5 overflow-y-auto p-4 sm:p-6"
            >
              {!isStarted ? (
                <div className="flex h-full items-center justify-center text-center">
                  <div className="max-w-md">
                    <div
                      className={`mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full ${styles.avatar}`}
                    >
                      <Bot aria-hidden="true" className="h-8 w-8" />
                    </div>
                    <p className="mb-6 text-lg text-gray-600 dark:text-gray-300">{startText}</p>
                    <button
                      type="button"
                      onClick={startSession}
                      className={`rounded-lg px-5 py-3 font-medium text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-800 ${styles.primary}`}
                    >
                      Начать сессию
                    </button>
                  </div>
                </div>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${
                      message.role === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    {message.role === 'assistant' && (
                      <div
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${styles.avatar}`}
                      >
                        <Bot aria-hidden="true" className="h-5 w-5" />
                        <span className="sr-only">Алиса</span>
                      </div>
                    )}
                    <div
                      className={`max-w-[82%] rounded-2xl px-4 py-3 ${
                        message.role === 'user'
                          ? `${styles.primary.split(' ')[0]} text-white`
                          : 'bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-white'
                      }`}
                    >
                      <p className="whitespace-pre-wrap break-words">{message.content}</p>
                    </div>
                    {message.role === 'user' && (
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                        <User aria-hidden="true" className="h-5 w-5" />
                        <span className="sr-only">Вы</span>
                      </div>
                    )}
                  </div>
                ))
              )}

              {isLoading && isStarted && (
                <div className="flex gap-3" role="status">
                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${styles.avatar}`}
                  >
                    <Bot aria-hidden="true" className="h-5 w-5" />
                  </div>
                  <div className="rounded-2xl bg-gray-100 px-4 py-3 dark:bg-gray-700">
                    <Loader2 aria-hidden="true" className="h-5 w-5 animate-spin" />
                    <span className="sr-only">Алиса отвечает</span>
                  </div>
                </div>
              )}

              {options.length > 0 && !isLoading && (
                <div aria-label="Варианты ответа" className="flex flex-wrap gap-2 pl-0 sm:pl-12">
                  {options.map((option, index) => (
                    <button
                      key={`${option.title}-${index}`}
                      type="button"
                      onClick={() => void sendTurn(option.title, option.payload)}
                      className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-800 ${styles.option}`}
                    >
                      {option.title}
                    </button>
                  ))}
                </div>
              )}

              {error && (
                <div
                  role="alert"
                  className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800 dark:border-red-800 dark:bg-red-900/20 dark:text-red-200"
                >
                  {error}
                </div>
              )}

              {isEnded && (
                <div className="text-center">
                  <p className="mb-3 text-sm text-gray-600 dark:text-gray-400">
                    Сессия завершена.
                  </p>
                  <button
                    type="button"
                    onClick={startSession}
                    className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 font-medium text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-800 ${styles.primary}`}
                  >
                    <RefreshCcw aria-hidden="true" className="h-4 w-4" />
                    Начать новую сессию
                  </button>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <form
              onSubmit={handleSubmit}
              className="border-t border-gray-200 p-4 dark:border-gray-700"
            >
              <div className="flex gap-2">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  onKeyDown={handleKeyDown}
                  aria-label="Ваше сообщение"
                  placeholder={isStarted ? 'Введите сообщение…' : 'Сначала начните сессию'}
                  rows={1}
                  maxLength={1000}
                  disabled={!isStarted || isLoading || isEnded}
                  className="min-h-11 max-h-32 flex-1 resize-none rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 placeholder:text-gray-400 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-500"
                  onInput={(event) => {
                    const target = event.currentTarget;
                    target.style.height = 'auto';
                    target.style.height = `${Math.min(target.scrollHeight, 128)}px`;
                  }}
                />
                <button
                  type="submit"
                  disabled={!input.trim() || !isStarted || isLoading || isEnded}
                  aria-label="Отправить сообщение"
                  className={`flex min-h-11 min-w-11 items-center justify-center rounded-lg px-4 text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-gray-400 dark:focus-visible:ring-offset-gray-800 ${styles.primary}`}
                >
                  {isLoading ? (
                    <Loader2 aria-hidden="true" className="h-5 w-5 animate-spin" />
                  ) : (
                    <Send aria-hidden="true" className="h-5 w-5" />
                  )}
                </button>
                {isStarted && !isEnded && (
                  <button
                    type="button"
                    onClick={startSession}
                    disabled={isLoading}
                    aria-label="Начать сессию заново"
                    className="flex min-h-11 min-w-11 items-center justify-center rounded-lg bg-gray-200 px-4 text-gray-700 transition-colors hover:bg-gray-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 dark:focus-visible:ring-offset-gray-800"
                  >
                    <RefreshCcw aria-hidden="true" className="h-5 w-5" />
                  </button>
                )}
              </div>
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                Enter — отправить, Shift+Enter — новая строка
              </p>
            </form>
          </section>

          <aside className={`mt-8 rounded-lg border p-5 text-sm ${styles.info}`}>
            <h2 className="mb-2 text-base font-semibold">О текстовом режиме</h2>
            <p>{infoText}</p>
          </aside>
        </div>
      </main>
    </div>
  );
}
