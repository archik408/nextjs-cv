'use client';

import { useMemo } from 'react';
import { Share2, Linkedin, Twitter, Mail, Facebook, Send } from 'lucide-react';
import { VkIcon } from '@/components/icons/vk';
import { ThreadsIcon } from '@/components/icons/threads';

type SharePanelProps = {
  title: string;
  url?: string;
  summary?: string;
  className?: string;
};

export function SharePanel({ title, url, summary, className }: SharePanelProps) {
  const shareUrl = useMemo(() => {
    if (typeof window !== 'undefined') {
      return url || window.location.href;
    }
    return url || '';
  }, [url]);

  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedTitle = encodeURIComponent(title);
  const encodedSummary = encodeURIComponent(summary || '');

  const links = [
    {
      name: 'Telegram',
      href: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,
      Icon: Send,
    },
    {
      name: 'LinkedIn',
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      Icon: Linkedin,
    },
    {
      name: 'Threads',
      href: `https://www.threads.net/intent/post?text=${encodedTitle}%20${encodedUrl}`,
      Icon: ThreadsIcon as any,
    },
    {
      name: 'VK',
      href: `https://vk.com/share.php?url=${encodedUrl}&title=${encodedTitle}&comment=${encodedSummary}`,
      Icon: VkIcon as any,
    },
    {
      name: 'X',
      href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      Icon: Twitter,
    },
    {
      name: 'Facebook',
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      Icon: Facebook,
    },
    {
      name: 'Email',
      href: `mailto:?subject=${encodedTitle}&body=${encodedTitle}%0A${encodedUrl}`,
      Icon: Mail,
    },
  ];

  const handleWebShare = async () => {
    if (typeof window === 'undefined') return;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (navigator.share) {
      try {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        await navigator.share({ title, text: summary || title, url: shareUrl });
      } catch (error) {
        console.error(error);
      }
    } else {
      window.open(shareUrl, '_blank');
    }
  };

  return (
    <div className={`flex flex-wrap items-center gap-2 ${className || ''}`}>
      <button
        type="button"
        onClick={handleWebShare}
        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 transition-colors"
        aria-label="Share via device"
      >
        <Share2 className="w-4 h-4" />
        <span className="text-sm">Share</span>
      </button>
      {links.map(({ name, href, Icon }) => (
        <a
          key={name}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 transition-colors"
          aria-label={`Share to ${name}`}
        >
          {name === 'VK' ? (
            <VkIcon className="w-4 h-4" />
          ) : name === 'Threads' ? (
            <ThreadsIcon className="w-4 h-4" />
          ) : (
            <Icon className="w-4 h-4" />
          )}
          <span className="text-sm">{name}</span>
        </a>
      ))}
    </div>
  );
}
