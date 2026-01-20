'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';

const Logo = () => {
  const t = useTranslations('layout.logo');

  return (
    <Link
      href={'/'}
      className='flex ml-6 items-center gap-x-4 transition-opacity hover:opacity-75'
    >
      <Image
        src={'icons/logo.svg'}
        alt='MorkovkinStream'
        width={35}
        height={35}
      />
      <div className='hidden leading-tight lg:block'>
        <h2 className='text-lg font-semibold tracking-wider text-accent-foreground'>
          MorkovkinStream
        </h2>
        <p className='text-sm text-muted-foreground'>{t('platform')}</p>
      </div>
    </Link>
  );
};

export default Logo;
