import { Skeleton } from '@/components/ui/common/Skeleton';

const StreamActionsSkeleton = () => {
  return (
    <div className='mt-6 lg:mt-0'>
      <div className='items-center gap-x-4 space-y-4 lg:flex lg:space-y-0'>
        <Skeleton className='h-10 w-44 rounded-full' />
        <Skeleton className='size-10 rounded-full' />
      </div>
    </div>
  );
};

export default StreamActionsSkeleton;
