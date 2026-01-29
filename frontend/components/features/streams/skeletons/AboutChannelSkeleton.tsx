import { Card, CardContent, CardHeader } from '@/components/ui/common/Card';
import { Skeleton } from '@/components/ui/common/Skeleton';

const AboutChannelSkeleton = () => {
  return (
    <Card className='mt-6 pt-1 pb-5'>
      <CardHeader className='p-4'>
        <Skeleton className='h-7 w-48' />
      </CardHeader>
      <CardContent className='space-x-4 px-4'>
        <div className='flex items-center gap-x-2'>
          <Skeleton className='h-5 w-10' />
          <Skeleton className='h-5 w-24' />
        </div>

        <div className='mt-2 space-y-2'>
          <Skeleton className='h-4 w-[90%]' />
          <Skeleton className='h-4 w-[60%]' />
        </div>

        <div className='mt-5 grid gap-x-3 gap-y-2 md:grid-cols-3 xl:grid-cols-8'>
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className='flex items-center gap-x-2'>
              <Skeleton className='size-6 rounded-md' />
              <Skeleton className='h-4 w-20' />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AboutChannelSkeleton;
