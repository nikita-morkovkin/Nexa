'use client';

import { Button } from '@/components/ui/common/Button';
import { useAuth } from '@/hooks/useAuth';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import ProfileMenu from './ProfileMenu';

const HeaderMenu = () => {
  const t = useTranslations('layout.headerMenu');
  const { isAuth } = useAuth();

  return (
    <div className='ml-auto flex items-center gap-x-4 mr-6'>
      {isAuth ? (
        <ProfileMenu />
      ) : (
        <>
          <Link href={'account/login'}>
            <Button variant={'secondary'}>{t('login')}</Button>
          </Link>
          <Link href={'account/create'}>
            <Button>{t('register')}</Button>
          </Link>
        </>
      )}
    </div>
  );
};

export default HeaderMenu;
