import { type FindChannelByUsernameQuery } from '@/graphql/gql/graphql';
import StreamSettings from '../../settings/StreamSettings';
import FollowButton from './buttons/FollowButton';
import SupportButton from './buttons/SupportButton';
import ShareActions from './ShareActions';

interface StreamActionsProps {
  channel: FindChannelByUsernameQuery['findChannelByUsername'];
}

const StreamActions = ({ channel }: StreamActionsProps) => {
  const hasSponsorsPlans =
    channel.isVerified && Boolean(channel.sponsorshipPlans.length);

  return (
    <div className='flex items-center gap-x-3 mb-1'>
      <FollowButton channel={channel} />
      {hasSponsorsPlans && <SupportButton channel={channel} />}
      <StreamSettings channel={channel} />
      <ShareActions channel={channel} />
    </div>
  );
};

export default StreamActions;
