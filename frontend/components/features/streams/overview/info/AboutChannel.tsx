'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/common/Card';
import { FindChannelByUsernameQuery } from '@/graphql/gql/graphql';
import { getSocialIcon } from '@/shared/utils/get-social-icon.util';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

interface AboutChannelProps {
  channel: FindChannelByUsernameQuery['findChannelByUsername'];
}

const AboutChannel = ({ channel }: AboutChannelProps) => {
  const t = useTranslations('stream.aboutChannel');

  return (
    <Card className='mt-4 lg:mt-6 pt-1 pb-5'>
      <CardHeader className='p-4'>
        <CardTitle className='text-xl'>
          {t('heading')} {channel.displayName}
        </CardTitle>
      </CardHeader>
      <CardContent className='space-x-4 px-4'>
        <div className='text-[15px] text-foreground'>
          <span className='font-semibold'>{channel.followings.length} </span>
          {t('followersCount')}
        </div>
        <div className='w-[90%] text-[15px] mt-2 text-muted-foreground'>
          {channel.bio ?? t('noDescription')}
        </div>
        {channel.socialLinks.length ? (
          <div className='mt-5 grid gap-x-3 md:grid-cols-3 xl:grid-cols-8'>
            {channel.socialLinks.map((socialLink, index) => {
              const Icon = getSocialIcon(socialLink.url);

              return (
                <Link
                  key={index}
                  href={socialLink.url}
                  className='flex items-center pr-1 text-[15px] hover:text-primary'
                  target='_blank'
                >
                  <Icon className='size-6 mr-2' />
                  {socialLink.title}
                </Link>
              );
            })}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
};

export default AboutChannel;
