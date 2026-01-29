'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/common/Card';
import ChannelAvatar from '@/components/ui/elements/ChannelAvatar';
import {
  FindChannelByUsernameQuery,
  FindSponsorsByChannelDocument,
} from '@/graphql/gql/graphql';
import { useQuery } from '@apollo/client/react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

interface ChannelSponsorsProps {
  channel: FindChannelByUsernameQuery['findChannelByUsername'];
}

const ChannelSponsors = ({ channel }: ChannelSponsorsProps) => {
  const t = useTranslations('stream.sponsors');

  const { data, loading: isLoadingSponsors } = useQuery(
    FindSponsorsByChannelDocument,
    {
      variables: {
        channelId: channel.id,
      },
    },
  );
  const sponsors = data?.findSponsorsByChannel ?? [];

  if (!sponsors.length || isLoadingSponsors) return null;

  return (
    <Card className='mt-6'>
      <CardHeader className='p-4'>
        <CardTitle className='text-xl'>
          {t('heading')} {channel.displayName}
        </CardTitle>
      </CardHeader>
      <CardContent className='grid grid-cols-12 px-4'>
        {sponsors.map((sponsor, index) => (
          <Link key={index} href={`/${sponsor.user.username}`}>
            <ChannelAvatar channel={channel} size={'large'} />
          </Link>
        ))}
      </CardContent>
    </Card>
  );
};

export default ChannelSponsors;
