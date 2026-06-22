'use client';

import { useEffect, useMemo, useState } from 'react';
import NavigationButtons from '@/components/navigation-buttons';
import { useLanguage } from '@/lib/hooks/use-language';
import { Check, Copy, MessageSquareText, Search } from 'lucide-react';

type EmojiItem = {
  emoji: string;
  label: string;
  category: string;
  keywords: readonly string[];
};

async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // Fallback below
  }

  try {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', 'true');
    ta.style.position = 'fixed';
    ta.style.top = '0';
    ta.style.left = '0';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(ta);
    return ok;
  } catch {
    return false;
  }
}

export function CodeReviewEmojisPageClient() {
  const { t } = useLanguage();
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(
    t.codeReviewEmojiAllCategories || 'All'
  );
  const [copiedEmoji, setCopiedEmoji] = useState<string>('');
  const [copyError, setCopyError] = useState('');

  const items = useMemo(
    () => (t.codeReviewEmojiItems || []) as readonly EmojiItem[],
    [t.codeReviewEmojiItems]
  );

  const categories = useMemo(
    () => [t.codeReviewEmojiAllCategories || 'All', ...new Set(items.map((item) => item.category))],
    [items, t.codeReviewEmojiAllCategories]
  );

  useEffect(() => {
    const defaultCategory = t.codeReviewEmojiAllCategories || 'All';
    setSelectedCategory((previous) => {
      const available = new Set(categories);
      return available.has(previous) ? previous : defaultCategory;
    });
  }, [categories, t.codeReviewEmojiAllCategories]);

  const filteredItems = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return items.filter((item) => {
      const inCategory =
        selectedCategory === (t.codeReviewEmojiAllCategories || 'All') ||
        item.category === selectedCategory;

      if (!inCategory) return false;
      if (!normalizedQuery) return true;

      return (
        item.label.toLowerCase().includes(normalizedQuery) ||
        item.keywords.some((keyword) => keyword.toLowerCase().includes(normalizedQuery)) ||
        item.emoji.includes(normalizedQuery)
      );
    });
  }, [items, query, selectedCategory, t.codeReviewEmojiAllCategories]);

  const handleCopy = async (emoji: string) => {
    const ok = await copyToClipboard(emoji);
    if (!ok) {
      setCopyError(t.codeReviewEmojiCopyError || 'Failed to copy emoji.');
      return;
    }

    setCopyError('');
    setCopiedEmoji(emoji);
    window.setTimeout(() => {
      setCopiedEmoji((prev) => (prev === emoji ? '' : prev));
    }, 1400);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-white">
      <NavigationButtons levelUp="tools" showLanguageSwitcher showThemeSwitcher />

      <main id="main-content" className="container mx-auto px-4 py-14 md:py-16">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-indigo-600 dark:text-indigo-400">
              <MessageSquareText className="w-6 h-6" aria-hidden />
            </div>
            <h1 className="text-3xl font-bold">
              {t.codeReviewEmojiTitle || 'Code Review Emoji Picker'}
            </h1>
          </div>

          <p className="text-gray-600 dark:text-gray-400 mb-8">
            {t.codeReviewEmojiDesc ||
              'Hand-picked emoji for code review comments. Click any card to copy an emoji.'}
          </p>

          <section className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-5 md:p-6 mb-6">
            <h2 className="sr-only">{t.codeReviewEmojiFilterLabel || 'Category'}</h2>
            <div className="grid grid-cols-1 md:grid-cols-[1fr,260px] gap-4">
              <label className="block">
                <span className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  {t.codeReviewEmojiSearchLabel || 'Search'}
                </span>
                <div className="relative">
                  <Search
                    className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400"
                    aria-hidden
                  />
                  <input
                    type="search"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder={
                      t.codeReviewEmojiSearchPlaceholder || 'Search by name or keyword...'
                    }
                    className="w-full rounded-md bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 pl-9 pr-3 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </label>

              <label className="block">
                <span className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  {t.codeReviewEmojiFilterLabel || 'Category'}
                </span>
                <select
                  value={selectedCategory}
                  onChange={(event) => setSelectedCategory(event.target.value)}
                  className="w-full rounded-md bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 px-3 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </section>

          {copyError && (
            <div
              className="mb-4 rounded-lg border border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-950/30 px-4 py-3 text-sm text-red-700 dark:text-red-300"
              role="alert"
            >
              {copyError}
            </div>
          )}

          {filteredItems.length > 0 ? (
            <>
              <h2 className="sr-only">{t.codeReviewEmojiTitle || 'Code Review Emoji Picker'}</h2>
              <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {filteredItems.map((item) => {
                  const isCopied = copiedEmoji === item.emoji;
                  return (
                    <li key={`${item.emoji}-${item.label}`}>
                      <button
                        type="button"
                        onClick={() => void handleCopy(item.emoji)}
                        className="w-full h-full text-left rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 hover:border-indigo-300 dark:hover:border-indigo-600 hover:shadow-md transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-900"
                        aria-label={`${t.codeReviewEmojiCopy || 'Copy'} ${item.label} ${item.emoji}`}
                      >
                        <div className="text-3xl mb-2 leading-none" aria-hidden>
                          {item.emoji}
                        </div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                          {item.label}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                          {item.category}
                        </div>
                        <div className="text-xs text-indigo-600 dark:text-indigo-400 inline-flex items-center gap-1">
                          {isCopied ? (
                            <>
                              <Check className="w-3.5 h-3.5" aria-hidden />
                              {t.codeReviewEmojiCopied || 'Copied'}
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" aria-hidden />
                              {t.codeReviewEmojiCopy || 'Copy'}
                            </>
                          )}
                        </div>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </>
          ) : (
            <p className="rounded-lg border border-dashed border-gray-300 dark:border-gray-700 p-8 text-center text-gray-600 dark:text-gray-400">
              {t.codeReviewEmojiNoResults || 'No emoji found for this filter.'}
            </p>
          )}
        </div>
      </main>
    </div>
  );
}
