import { Skeleton } from '@/components/ui/common/Skeleton';

const StreamCardSkeleton = () => {
  return (
    <div className='h-full w-full'>
      <Skeleton className='relative aspect-video rounded-xl' />
      <Skeleton className='mt-3 h-4 w-full' />
      <div className='flex gap-x-4'>
        <Skeleton className='mt-3 size-10 rounded-full' />
        <div className='mt-3.5 flex flex-col space-y-2'>
          <Skeleton className='h-3 w-20' />
          <Skeleton className='h-3 w-20' />
        </div>
      </div>
    </div>
  );
};

export default StreamCardSkeleton;
