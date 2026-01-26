'use client';

import { Card } from '@/components/ui/common/Card';
import ChannelAvatar from '@/components/ui/elements/ChannelAvatar';
import LiveBadge from '@/components/ui/elements/LiveBadge';
import { FindCurrentProfileQuery } from '@/graphql/gql/graphql';
import { getMediaSource } from '@/shared/utils/get-media-source.util';
import { getRandomColor } from '@/shared/utils/get-random-color';
import Image from 'next/image';

interface StreamThumbnailProps {
  previewUrl: string | null | undefined;
  user: Pick<
    FindCurrentProfileQuery['findCurrentProfile'],
    'username' | 'avatar' | 'isVerified'
  >;
  isLive?: boolean;
}

const StreamThumbnail = ({
  previewUrl,
  user,
  isLive,
}: StreamThumbnailProps) => {
  const randomColor = getRandomColor(user.username);

  return (
    <div className='group relative aspect-video cursor-pointer rounded-xl'>
      <div
        className='absolute inset-0 flex items-center justify-center rounded-xl opacity-0 transition-opacity group-hover:opacity-100'
        style={{ backgroundColor: randomColor }}
      />
      {previewUrl ? (
        <Image
          src={getMediaSource(previewUrl)}
          alt={user.username}
          fill
          className={`rounded-xl object-cover transition-transform
          group-hover:-translate-y-2 group-hover:translate-x-2`}
        />
      ) : (
        <Card
          className={`flex flex-col h-full w-full items-center 
          justify-center gap-x-4 rounded-xl transition-transform 
          group-hover:-translate-y-2 group-hover:translate-x-2`}
        >
          <ChannelAvatar channel={user} isLive={isLive} />
        </Card>
      )}
      {isLive && (
        <div
          className={`absolute right-2 top-2 transition-transform 
          group-hover:-translate-y-2 group-hover:translate-x-2
        `}
        >
          <LiveBadge />
        </div>
      )}
    </div>
  );
};

export default StreamThumbnail;
