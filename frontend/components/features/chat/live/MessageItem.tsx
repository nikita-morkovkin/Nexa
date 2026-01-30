import { type FindAllMessagesByStreamQuery } from '@/graphql/gql/graphql';
import { stringToColor } from '@/shared/utils/string-to-color.util';
import { Medal } from 'lucide-react';

interface MessageItemProps {
  message: FindAllMessagesByStreamQuery['findAllMessagesByStream'][0];
  isSponsor: boolean;
}

const MessageItem = ({ message, isSponsor }: MessageItemProps) => {
  const color = stringToColor(message.user.username ?? '');
  const formattedTime = new Date(message.createdAt).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className='flex gap-2 rounded-md p-2 hover:bg-accent'>
      <p className='text-sm text-muted-foreground'>{formattedTime}</p>
      <div className='flex grow flex-wrap items-baseline gap-1'>
        <p className='flex items-center whitespace-nowrap text-sm font-semibold'>
          <span className='truncate' style={{ color }}>
            {message.user.username}
            {isSponsor && <Medal className='m;-1 size-3.5' style={{ color }} />}
          </span>
        </p>
        <p className='break-all text-sm'>{message.text}</p>
      </div>
    </div>
  );
};

export default MessageItem;
