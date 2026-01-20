import { FindCurrentProfileQuery } from '@/graphql/gql/graphql';
import { getMediaSource } from '@/utils/get-media-source.util';
import { cn } from '@/utils/tw-merge.util';
import { cva, type VariantProps } from 'class-variance-authority';
import { Avatar, AvatarFallback, AvatarImage } from '../common/Avatar';

const avatarSizes = cva('', {
  variants: {
    size: {
      sm: 'size-7',
      default: 'size-9',
      large: 'size-14',
    },
  },
  defaultVariants: {
    size: 'default',
  },
});

interface ChannelAvatarProps extends VariantProps<typeof avatarSizes> {
  channel: Pick<
    FindCurrentProfileQuery['findCurrentProfile'],
    'username' | 'avatar'
  >;
  isLive?: boolean;
}

const ChannelAvatar = ({
  channel,
  size,
  isLive = false,
}: ChannelAvatarProps) => {
  return (
    <div className='relative'>
      <Avatar
        className={cn(avatarSizes({ size }), isLive && 'ring-2 ring-rose-500')}
      >
        <AvatarImage
          src={getMediaSource(channel.avatar)}
          className='object-cover'
        />
        <AvatarFallback className='flex items-center justify-center'>
          <p className='font-semibold mb-[5px]'>{channel.username?.[0]}</p>
        </AvatarFallback>
      </Avatar>
    </div>
  );
};

export default ChannelAvatar;
