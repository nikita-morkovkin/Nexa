'use client';

import { type FindChannelByUsernameQuery } from '@/graphql/gql/graphql';
import { LIVEKIT_SERVER_URL } from '@/shared/constants/url.constants';
import { useStreamToken } from '@/shared/hooks/useStreamToken';
import { LiveKitRoom } from '@livekit/components-react';
import LiveChat from '../../chat/live/LiveChat';
import StreamOverviewSkeleton from '../skeletons/StreamOverviewSkeleton';
import AboutChannel from './info/AboutChannel';
import ChannelSponsors from './info/ChannelSponsors';
import StreamInfo from './info/StreamInfo';
import StreamVideo from './player/StreamVideo';

interface StreamOverviewProps {
  channel: FindChannelByUsernameQuery['findChannelByUsername'];
}

const StreamOverview = ({ channel }: StreamOverviewProps) => {
  const { token, name, identity } = useStreamToken(channel.id);

  if (!token || !name || !identity) {
    return <StreamOverviewSkeleton />;
  }

  return (
    <LiveKitRoom
      token={token}
      serverUrl={LIVEKIT_SERVER_URL}
      className='mx-auto grid max-w-screen-7xl grid-cols-1 gap-y-4 lg:grid-cols-7 lg:gap-6'
    >
      <div className='order-1 col-span flex flex-col lg:col-span-5'>
        <StreamVideo channel={channel} />
        <StreamInfo channel={channel} />
        <AboutChannel channel={channel} />
        <ChannelSponsors channel={channel} />
      </div>
      <div className='order-2 col-span-1 flex h-80 flex-col space-y-6 lg:col-span-2'>
        <LiveChat
          channel={channel}
          isChatEnabled={channel.stream.isChatEnabled}
          isChatFollowersOnly={channel.stream.isChatFollowersOnly}
          isChatPremiumFollowersOnly={channel.stream.isChatPremiumFollowersOnly}
        />
      </div>
    </LiveKitRoom>
  );
};

export default StreamOverview;
