import PlansTable from '@/components/features/sponsorship/plans/table/PlansTable';
import { NO_INDEX_PAGE } from '@/shared/constants/seo.constants';
import { type Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('dashboard.plans.header');

  return {
    title: t('heading'),
    description: t('description'),
    ...NO_INDEX_PAGE,
  };
}

export default function PlansSettingsPage() {
  return <PlansTable />;
}
