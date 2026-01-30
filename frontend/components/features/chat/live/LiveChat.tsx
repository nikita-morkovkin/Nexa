'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/common/Card';
import {
  FindAllMyFollowingsDocument,
  FindSponsorsByChannelDocument,
  type FindChannelByUsernameQuery,
} from '@/graphql/gql/graphql';
import { useAuth } from '@/shared/hooks/useAuth';
import { useCurrentProfile } from '@/shared/hooks/useCurrentProfile';
import { useQuery } from '@apollo/client/react';
import {
  useConnectionState,
  useRemoteParticipant,
} from '@livekit/components-react';
import { ConnectionState } from 'livekit-client';
import { MessageSquareOff } from 'lucide-react';
import { useTranslations } from 'next-intl';
import ChatInfo from './ChatInfo';
import SendMessageForm from './forms/SendMessageForm';
import LoadingChat from './LoadingChat';
import MessagesList from './MessagesList';

interface LiveChatProps {
  channel: FindChannelByUsernameQuery['findChannelByUsername'];
  isChatEnabled: boolean;
  isChatFollowersOnly: boolean;
  isChatPremiumFollowersOnly: boolean;
}

const LiveChat = ({
  channel,
  isChatEnabled,
  isChatFollowersOnly,
  isChatPremiumFollowersOnly,
}: LiveChatProps) => {
  const { isAuth } = useAuth();
  const t = useTranslations('stream.chat');
  const connectionState = useConnectionState();
  const participant = useRemoteParticipant(channel.id);
  const { user, isLoadingProfile } = useCurrentProfile();

  const { data: followingsData, loading: isLoadingFollowings } = useQuery(
    FindAllMyFollowingsDocument,
    {
      skip: !isAuth,
    },
  );
  const followings = followingsData?.findAllMyFollowings ?? [];

  const { data: sponsorsData, loading: isLoadingSponsors } = useQuery(
    FindSponsorsByChannelDocument,
    {
      variables: {
        channelId: channel.id,
      },
    },
  );
  const sponsors = sponsorsData?.findSponsorsByChannel ?? [];

  const isOurChannel = user?.id === channel.stream.id;
  const isFollower = followings.some(
    following => following.followingId === channel.id,
  );
  const isSponsor = sponsors.some(sponsor => sponsor.user.id === user?.id);
  const isOnline = participant && connectionState === ConnectionState.Connected;
  const isDisabled =
    isChatEnabled ||
    !isOnline ||
    !isAuth ||
    (isChatFollowersOnly && !isFollower && !isOurChannel) ||
    (isChatPremiumFollowersOnly && !isSponsor && isOurChannel);

  if (
    connectionState === ConnectionState.Connecting ||
    isLoadingProfile ||
    isLoadingFollowings ||
    isLoadingSponsors
  ) {
    return <LoadingChat />;
  }

  return (
    <Card className='lg:fixed flex h-[87.5%] w-[21.5%] overview-y-auto flex-col xl:mt-0'>
      <CardHeader className='border-b'>
        <CardTitle className='text-center text-xl'>{t('heading')}</CardTitle>
      </CardHeader>
      <CardContent className='flex h-full flex-col overflow-y-auto p-4'>
        {!isOnline ? (
          <>
            <MessagesList channel={channel} />
            <ChatInfo
              isOurChannel={isOurChannel}
              isChatEnabled={isChatEnabled}
              isChatFollowersOnly={isChatFollowersOnly}
              isChatPremiumFollowersOnly={isChatPremiumFollowersOnly}
              isSponsor={isSponsor}
            />
            <SendMessageForm channel={channel} isDisabled={isDisabled} />
          </>
        ) : (
          <div className='flex h-full flex-col items-center justify-center'>
            <MessageSquareOff className='size-10 text-muted-foreground' />
            <h2 className='mt-3 text-xl font-medium'>{t('unavailable')}</h2>
            <p className='mt-1 w-full text-center text-muted-foreground'>
              {t('unavailableMessage')}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LiveChat;
