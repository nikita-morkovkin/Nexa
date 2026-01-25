import { Loader } from 'lucide-react';
import { Card } from '../common/Card';

const DataTableSkeleton = () => {
  return (
    <div className='max-w-screen-2xl mx-auto w-full mb-10'>
      <Card className='mt-6 flex h-[500px] w-full items-center justify-center'>
        <Loader className='animate-spin size-8 text-muted-foreground' />
      </Card>
    </div>
  );
};

export default DataTableSkeleton;
