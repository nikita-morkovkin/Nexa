'use client';

import Heading from '@/components/ui/elements/Heading';
import { type FindCategoryBySlugQuery } from '@/graphql/gql/graphql';
import { getMediaSource } from '@/shared/utils/get-media-source.util';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import StreamsList from '../../streams/list/StreamsList';

interface CategoryOverviewProps {
  category: FindCategoryBySlugQuery['findCategoryBySlug'];
}

const CategoryOverview = ({ category }: CategoryOverviewProps) => {
  const t = useTranslations('categories.overview');

  return (
    <div className='space-y-8'>
      <div className='gap-x-10 lg:items-center lg:flex lg:space-y-6'>
        <Image
          src={getMediaSource(category.thumbnailUrl)}
          alt={category.title}
          width={192}
          height={256}
          className='rounded-xl object-cover'
        />
        <div className='mb-5 lg:hidden' />
        <Heading
          title={category.title}
          description={category.description || ''}
          size={'xl'}
        />
      </div>
      <StreamsList heading={t('heading')} streams={category.streams} />
    </div>
  );
};

export default CategoryOverview;
