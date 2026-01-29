'use client';

import { Button } from '@/components/ui/common/Button';
import ConfirmModal from '@/components/ui/elements/ConfirmModal';
import {
  FindAllMyFollowingsDocument,
  FindChannelByUsernameQuery,
  SubscribeToChannelDocument,
  UnsubscribeFromChannelDocument,
} from '@/graphql/gql/graphql';
import { useAuth } from '@/shared/hooks/useAuth';
import { useCurrentProfile } from '@/shared/hooks/useCurrentProfile';
import { useMutation, useQuery } from '@apollo/client/react';
import { Heart, HeartOff } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface FollowButtonProps {
  channel: FindChannelByUsernameQuery['findChannelByUsername'];
}

const FollowButton = ({ channel }: FollowButtonProps) => {
  const t = useTranslations('stream.actions.follow');
  const router = useRouter();
  const { isAuth } = useAuth();
  const { user, isLoadingProfile } = useCurrentProfile();

  const {
    data,
    loading: isLoadingFollowings,
    refetch,
  } = useQuery(FindAllMyFollowingsDocument, {
    skip: !isAuth,
  });
  const followings = data?.findAllMyFollowings || [];

  const [subscribeChannel, { loading: isLoadingSubscribe }] = useMutation(
    SubscribeToChannelDocument,
    {
      onCompleted() {
        refetch();
        toast.success(t('successFollowMessage'));
      },
      onError() {
        toast.error(t('errorFollowMessage'));
      },
    },
  );

  const [unsubscribeChannel, { loading: isLoadingUnsubscribe }] = useMutation(
    UnsubscribeFromChannelDocument,
    {
      onCompleted() {
        refetch();
        toast.success(t('successUnfollowMessage'));
      },
      onError() {
        toast.error(t('errorUnfollowMessage'));
      },
    },
  );

  const isOurChannel = user?.id === channel.id;
  const isExistingFollow = followings.some(
    following => following.followingId === channel.id,
  );

  if (isOurChannel || isLoadingProfile) {
    return null;
  }

  const handleSubscribeClick = () => {
    if (isAuth) {
      subscribeChannel({ variables: { channelId: channel.id } });
    } else {
      router.push('/account/login');
    }
  };

  const handleUnsubscribeClick = () => {
    unsubscribeChannel({ variables: { channelId: channel.id } });
  };

  return isExistingFollow ? (
    <ConfirmModal
      heading={t('confirmUnfollowHeading')}
      message={t('confirmUnfollowMessage')}
      onConfirm={handleUnsubscribeClick}
    >
      <Button
        disabled={isLoadingFollowings || isLoadingUnsubscribe}
        variant='outline'
      >
        <HeartOff className='size-4 fill-white' />
        {t('unfollowButton')}
      </Button>
    </ConfirmModal>
  ) : (
    <Button
      onClick={handleSubscribeClick}
      disabled={isLoadingFollowings || isLoadingSubscribe}
    >
      <Heart className='size-4' />
      {t('followButton')}
    </Button>
  );
};

export default FollowButton;
