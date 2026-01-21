'use client';

import { Separator } from '@/components/ui/common/Separator';
import { FindRecommendedChannelsDocument } from '@/graphql/gql/graphql';
import { useSidebar } from '@/shared/hooks/useSidebar';
import { useQuery } from '@apollo/client/react';
import { useTranslations } from 'next-intl';
import ChannelItem from './ChannelItem';
import { ChannelItemSkeleton } from './ChannelItemSkeleton';

const RecommendedChannels = () => {
  const t = useTranslations('recommended');
  const { isOpen } = useSidebar();
  const { data, loading: isLoadingRecommended } = useQuery(
    FindRecommendedChannelsDocument,
  );

  const channels = data?.findRecommendedChannels || [];

  return (
    <div>
      <Separator className='mb-3' />
      {isOpen && (
        <h2 className='text-lg mb-2 px-2 font-semibold text-foreground'>
          {t('heading')}
        </h2>
      )}
      {isLoadingRecommended
        ? Array.from({ length: 7 }).map((_, index) => (
            <ChannelItemSkeleton key={index} />
          ))
        : channels.map((channel, index) => (
            <ChannelItem key={index} channel={channel} />
          ))}
    </div>
  );
};

export default RecommendedChannels;
