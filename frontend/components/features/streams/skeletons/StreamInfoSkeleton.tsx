import { Skeleton } from '@/components/ui/common/Skeleton';
import StreamActionsSkeleton from './StreamActionsSkeleton';

const StreamInfoSkeleton = () => {
  return (
    <div className='space-y-5'>
      <Skeleton className='h-7 w-[60%]' />
      <div className='flex flex-col items-start gap-y-3 lg:flex-row lg:items-center lg:justify-between'>
        <div className='flex items-center gap-x-3 px-1'>
          <Skeleton className='size-14 rounded-full' />
          <div className='space-y-2.5'>
            <Skeleton className='h-4 w-32' />
            <Skeleton className='h-3 w-20' />
          </div>
        </div>
        <StreamActionsSkeleton />
      </div>
    </div>
  );
};

export default StreamInfoSkeleton;
