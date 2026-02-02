import Link from 'next/link';

type Props = {
  tag: string;
  variant?: 'badge' | 'list';
  active?: boolean;
};

const baseClasses =
  'rounded text-xs transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900';

const badgeClasses =
  'inline-block px-2 py-0.5 bg-neutral-100 text-neutral-700 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700';

const listClasses =
  'block w-full px-3 py-2 text-left rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800';

const activeListClasses =
  'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 font-medium';

export function GardenTagLink({ tag, variant = 'badge', active }: Props) {
  const href = `/garden?tag=${encodeURIComponent(tag)}`;
  const isList = variant === 'list';

  return (
    <Link
      href={href}
      className={`${baseClasses} ${isList ? listClasses : badgeClasses} ${isList && active ? activeListClasses : ''}`}
      aria-current={active ? 'true' : undefined}
    >
      #{tag}
    </Link>
  );
}
