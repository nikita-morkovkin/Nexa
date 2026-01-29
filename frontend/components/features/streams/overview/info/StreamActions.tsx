import { FindChannelByUsernameQuery } from '@/graphql/gql/graphql';
import FollowButton from './buttons/FollowButton';
import SupportButton from './buttons/SupportButton';

interface StreamActionsProps {
  channel: FindChannelByUsernameQuery['findChannelByUsername'];
}

const StreamActions = ({ channel }: StreamActionsProps) => {
  const hasSponsorsPlans =
    channel.isVerified && Boolean(channel.sponsorshipPlans.length);

  return (
    <div className='mt-5 lg:flex lg:space-y-0 items-center space-x-3 space-y-4 lg:mt-0'>
      <FollowButton channel={channel} />
      {hasSponsorsPlans && <SupportButton channel={channel} />}
    </div>
  );
};

export default StreamActions;
