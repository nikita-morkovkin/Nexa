'use client';

import { Card } from '@/components/ui/common/Card';
import { Loader } from 'lucide-react';
import { useTranslations } from 'next-intl';

const LoadingChat = () => {
  const t = useTranslations('stream.chat');

  return (
    <Card className='lg:fixed flex h-[82%] w-[21.5%] overview-y-auto flex-col xl:mt-0'>
      <div className='w-full h-full flex flex-col gap-y-5 items-center justify-center'>
        <Loader className='size-10 animate-spin text-muted-foreground' />
        <p className='text-lg mt-3 text-muted-foreground'>{t('loading')}</p>
      </div>
    </Card>
  );
};

export default LoadingChat;
