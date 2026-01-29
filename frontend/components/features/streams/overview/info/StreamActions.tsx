import { FindChannelByUsernameQuery } from '@/graphql/gql/graphql';
import FollowButton from './FollowButton';

interface StreamActionsProps {
  channel: FindChannelByUsernameQuery['findChannelByUsername'];
}

const StreamActions = ({ channel }: StreamActionsProps) => {
  return (
    <div className='mt-5 lg:flex lg:space-y-0 items-center space-x-3 space-y-4 lg:mt-0'>
      <FollowButton channel={channel} />
    </div>
  );
};

export default StreamActions;
