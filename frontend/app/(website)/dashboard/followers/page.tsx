import FollowersTable from '@/components/features/followers/table/FollowersTable';
import { NO_INDEX_PAGE } from '@/shared/constants/seo.constants';
import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('dashboard.followers.header');

  return {
    title: t('heading'),
    description: t('description'),
    ...NO_INDEX_PAGE,
  };
}

export default function FollowersPage() {
  return <FollowersTable />;
}
