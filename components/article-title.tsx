'use client';

import { ETheme } from '@/constants/enums';
import { useTheme } from '@/lib/use-theme';
import { useMemo, ReactNode } from 'react';

type Props = {
  text: string | ReactNode;
  small?: boolean;
};

export function ArticleTitle({ text, small }: Props) {
  const { theme } = useTheme();
  const calcStyles = useMemo(
    () =>
      theme === ETheme.dark
        ? {
            lineHeight: '1.25',
            backgroundImage:
              'linear-gradient(-90deg, #395171 0, #35c3ff 30%, #a07cfb 50%, #b179bc 70%, #cc7fe0 90%, #fbadc6 100%)',
            backgroundSize: '100%',
            backgroundRepeat: 'repeat',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            MozBackgroundClip: 'text',
            filter: 'drop-shadow(0 0 2rem #000)',
            textShadow: 'none',
          }
        : {
            lineHeight: '1.25',
            backgroundImage:
              'linear-gradient(-90deg,rgb(176, 194, 218) 0, #007cb1 30%, #55389e 50%, #752884 70%, #4e1f5b 90%, #492530 100%)',
            backgroundSize: '100%',
            backgroundRepeat: 'repeat',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            MozBackgroundClip: 'text',
            textShadow: 'none',
          },
    [theme]
  );

  if (small) {
    return (
      <h3 className="text-lg md:text-xl font-bold mb-4 transition-all ease-in" style={calcStyles}>
        {text}
      </h3>
    );
  }

  return (
    <h1 className="text-4xl md:text-5xl font-bold mb-4 transition-all ease-in" style={calcStyles}>
      {text}
    </h1>
  );
}

export default ArticleTitle;
