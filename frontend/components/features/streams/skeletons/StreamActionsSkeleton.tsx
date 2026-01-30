import { Skeleton } from '@/components/ui/common/Skeleton';

const StreamActionsSkeleton = () => {
  return (
    <div className='flex w-full items-center gap-x-4 lg:w-auto'>
      <Skeleton className='h-10 w-44 rounded-full' />
      <Skeleton className='size-10 rounded-full' />
    </div>
  );
};

export default StreamActionsSkeleton;
