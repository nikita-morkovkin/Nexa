import ChannelAvatar from '@/components/ui/elements/ChannelAvatar';
import ChannelVerified from '@/components/ui/elements/ChannelVerified';
import { type FindRandomStreamsQuery } from '@/graphql/gql/graphql';
import Link from 'next/link';
import StreamThumbnail from './StreamThumbnail';

interface StreamCardProps {
  stream: FindRandomStreamsQuery['getRandomFourStreams'][0];
}

const StreamCard = ({ stream }: StreamCardProps) => {
  return (
    <div className='h-full w-full'>
      <Link href={`/${stream.user?.username}`}>
        <StreamThumbnail
          previewUrl={stream.thumbnailUrl}
          // It works, but there is a type problem with GraphQL
          user={stream.user!}
          isLive={stream.isLive}
        />
        <h2 className='mt-3 truncate text-base font-semibold text-foreground hover:text-primary'>
          {stream.title}
        </h2>
      </Link>
      <div className='mt-3 flex gap-x-3'>
        <div className='flex gap-5 items-center'>
          <ChannelAvatar channel={stream.user!} isLive={stream.isLive} />
          <div className='flex flex-col justify-center'>
            <h2 className='flex items-center gap-x-2 font-semibold text-foreground'>
              {stream.user?.username}
              {stream.user?.isVerified && <ChannelVerified size={'sm'} />}
            </h2>
            {stream.category && (
              <Link
                className='text-muted-foreground hover:text-primary'
                href={`/categories/${stream.category.slug}`}
              >
                {stream.category.title}
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StreamCard;
