'use client';

import { Button } from '@/components/ui/common/Button';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/common/Dialog';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/common/Tabs';
import {
  FindChannelByUsernameQuery,
  FindSponsorsByChannelDocument,
  MakePaymentDocument,
} from '@/graphql/gql/graphql';
import { useAuth } from '@/shared/hooks/useAuth';
import { useCurrentProfile } from '@/shared/hooks/useCurrentProfile';
import { convertPrice } from '@/shared/utils/convert-price.util';
import { useMutation, useQuery } from '@apollo/client/react';
import { DialogDescription } from '@radix-ui/react-dialog';
import { Medal } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface SupportButtonProps {
  channel: FindChannelByUsernameQuery['findChannelByUsername'];
}

const SupportButton = ({ channel }: SupportButtonProps) => {
  const t = useTranslations('stream.actions.support');
  const router = useRouter();
  const { isAuth } = useAuth();
  const { user, isLoadingProfile } = useCurrentProfile();

  const { data } = useQuery(FindSponsorsByChannelDocument, {
    variables: {
      channelId: channel.id,
    },
  });
  const sponsors = data?.findSponsorsByChannel;

  const [makePayment, { loading: isLoadingMakePayment }] = useMutation(
    MakePaymentDocument,
    {
      onCompleted(data) {
        router.push(data.makePayment.url);
      },
      onError() {
        toast.error(t('errorMessage'));
      },
    },
  );

  const isSponsor = sponsors?.some(sponsor => sponsor.user.id === user?.id);
  const isOurChannel = user?.id === channel.id;

  if (isOurChannel || isLoadingProfile) {
    return null;
  }

  if (isSponsor) {
    return (
      <Button variant={'secondary'} disabled>
        <Medal className='size-4' />
        {t('alreadySponsor')}
      </Button>
    );
  }

  return isAuth ? (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={'secondary'}>
          <Medal className='size-4' /> {t('supportAuthor')}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <Tabs defaultValue={channel.sponsorshipPlans[0].id}>
          <TabsList className='mb-1'>
            {channel.sponsorshipPlans.map((plan, index) => (
              <TabsTrigger key={index} value={plan.id}>
                {plan.title}
              </TabsTrigger>
            ))}
          </TabsList>
          {channel.sponsorshipPlans.map((plan, index) => (
            <TabsContent key={index} value={plan.id}>
              <DialogTitle className='text-2xl'>
                {convertPrice(plan.price)}
                {plan.description && (
                  <DialogDescription className='mt-2 text-sm'>
                    {plan.description}
                  </DialogDescription>
                )}
              </DialogTitle>
              <Button
                onClick={() => makePayment({ variables: { planId: plan.id } })}
                className='mt-5 w-full'
                disabled={isLoadingMakePayment}
              >
                {t('choose')}
              </Button>
            </TabsContent>
          ))}
        </Tabs>
      </DialogContent>
    </Dialog>
  ) : (
    <Button onClick={() => router.push('/account/login')} variant={'secondary'}>
      <Medal className='size-4' /> {t('supportAuthor')}
    </Button>
  );
};

export default SupportButton;
