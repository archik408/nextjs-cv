'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ScanText, Home, ChevronLeft } from 'lucide-react';
import { useLanguage } from '@/lib/use-language';
import { useState } from 'react';

export function SidebarMenu() {
  const pathname = usePathname();
  const { t } = useLanguage();
  const [isHovered, setIsHovered] = useState(false);

  const menuItems = [
    {
      href: '/',
      icon: Home,
      label: t.home,
      isActive: pathname === '/',
    },
    {
      href: '/ocr',
      icon: ScanText,
      label: 'OCR',
      isActive: pathname === '/ocr',
    },
  ];

  return (
    <>
      <div
        className="fixed top-0 right-0 w-4 h-full z-[60] bg-transparent"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      />
      <div
        className={`fixed top-0 right-0 h-full w-16 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-l border-gray-200 dark:border-gray-700 shadow-xl z-50 transition-transform duration-300 ease-in-out ${
          isHovered ? 'translate-x-0' : 'translate-x-12'
        }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-full">
          <div
            className={`bg-white/95 dark:bg-gray-900/95 backdrop-blur-md rounded-l-lg border border-r-0 border-gray-200 dark:border-gray-700 p-1 transition-transform duration-300 ${
              isHovered ? 'translate-x-0' : 'translate-x-2'
            }`}
          >
            <ChevronLeft
              className={`w-4 h-4 text-gray-600 dark:text-gray-400 transition-transform duration-300 ${
                isHovered ? 'rotate-180' : 'rotate-0'
              }`}
            />
          </div>
        </div>
        <div className="flex flex-col items-center justify-center h-full gap-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group relative flex items-center justify-center w-12 h-12 rounded-lg transition-all duration-200 ${
                  item.isActive
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                }`}
                title={item.label}
              >
                <Icon className="w-5 h-5" />
                <div
                  className={`absolute right-full mr-2 px-2 py-1 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs rounded whitespace-nowrap opacity-0 pointer-events-none transition-opacity duration-200 ${
                    isHovered ? 'group-hover:opacity-100' : ''
                  }`}
                >
                  {item.label}
                  <div className="absolute left-full top-1/2 -translate-y-1/2 border-4 border-transparent border-l-gray-900 dark:border-l-gray-100" />
                </div>
              </Link>
            );
          })}
        </div>
        <div className="absolute inset-0 bg-gradient-to-l from-blue-500/5 to-transparent pointer-events-none" />
      </div>
    </>
  );
}
