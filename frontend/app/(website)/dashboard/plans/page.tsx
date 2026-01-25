import PlansTable from '@/components/features/sponsorship/plans/table/PlansTable';
import { type Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('dashboard.plans.header');

  return {
    title: t('heading'),
    description: t('description'),
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default function PlansSettingsPage() {
  return <PlansTable />;
}
