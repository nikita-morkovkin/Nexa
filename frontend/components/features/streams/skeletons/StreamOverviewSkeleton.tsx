import LiveChatSkeleton from '../../chat/skeletons/LiveChatSkeleton';
import AboutChannelSkeleton from './AboutChannelSkeleton';
import StreamInfoSkeleton from './StreamInfoSkeleton';
import StreamVideoSkeleton from './StreamVideoSkeleton';

const StreamOverviewSkeleton = () => {
  return (
    <div className='mx-auto grid max-w-screen-7xl gird-cols-1 gap-6 lg:grid-cols-7'>
      <div className='order-1 col-span flex flex-col lg:col-span-5'>
        <StreamVideoSkeleton />
        <StreamInfoSkeleton />
        <AboutChannelSkeleton />
      </div>
      <div className='order-2 col-span-1 flex h-80 flex-col space-y-6 lg:col-span-2'>
        <LiveChatSkeleton />
      </div>
    </div>
  );
};

export default StreamOverviewSkeleton;
