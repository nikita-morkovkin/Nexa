'use client';

import ChannelAvatar from '@/components/ui/elements/ChannelAvatar';
import ChannelVerified from '@/components/ui/elements/ChannelVerified';
import { type FindChannelByUsernameQuery } from '@/graphql/gql/graphql';
import { useMediaQuery } from '@/shared/hooks/useMediaQuery';
import { useParticipants } from '@livekit/components-react';
import { User } from 'lucide-react';
import { useTranslations } from 'next-intl';
import StreamActions from './StreamActions';

interface StreamInfoProps {
  channel: FindChannelByUsernameQuery['findChannelByUsername'];
}

const StreamInfo = ({ channel }: StreamInfoProps) => {
  const isMobile = useMediaQuery('(max-width: 640px)');
  const t = useTranslations('stream.info');
  const participants = useParticipants();

  const participantCount = participants.length - 1;

  return (
    <div className='space-y-5'>
      <h1 className='text-xl font-semibold'>
        {channel.stream.title}{' '}
        {channel.stream.category && ` | ${channel.stream.category.title}`}
      </h1>
      <div className={'flex items-center gap-y-3 justify-between'}>
        <div className='flex items-center gap-x-3 px-1'>
          <ChannelAvatar
            channel={channel}
            isLive={channel.stream.isLive}
            size={isMobile ? 'md' : 'large'}
            textSize='2xl'
          />
          <div className='space-y-1'>
            <h2 className='flex items-center gap-x-2 text-lg font-semibold'>
              {channel.displayName}
              {channel.isVerified && <ChannelVerified />}
            </h2>
            {channel.stream.isLive ? (
              <div className='flex items-center gap-x-1 text-xs font-semibold text-rose-500'>
                <User className='size-4' />
                <p>
                  {participantCount} {t('viewers')}
                </p>
              </div>
            ) : (
              <p className='text-sm font-semibold text-muted-foreground'>
                {t('offline')}
              </p>
            )}
          </div>
        </div>
        <StreamActions channel={channel} />
      </div>
    </div>
  );
};

export default StreamInfo;
