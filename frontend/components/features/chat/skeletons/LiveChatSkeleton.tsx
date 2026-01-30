import { Skeleton } from '@/components/ui/common/Skeleton';

const LiveChatSkeleton = () => {
  return (
    <Skeleton className='flex h-full w-full flex-col lg:fixed lg:h-[87.5%] lg:w-[21.5%] xl:mt-0' />
  );
};

export default LiveChatSkeleton;
