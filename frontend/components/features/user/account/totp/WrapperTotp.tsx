'use client';

import CardContainer from '@/components/ui/elements/CardContainer';
import { useCurrentProfile } from '@/shared/hooks/useCurrentProfile';
import { useTranslations } from 'next-intl';
import WrapperTotpSkeleton from '../skeletons/WrapperTotpSkeleton';
import EnableTotp from './EnableTotp';
import DisableTotp from './DisableTotp';

const WrapperTotp = () => {
  const t = useTranslations('dashboard.settings.account.twoFactor');
  const { user, isLoadingProfile } = useCurrentProfile();

  return isLoadingProfile ? (
    <WrapperTotpSkeleton />
  ) : (
    <CardContainer
      heading={t('heading')}
      description={t('description')}
      rightContent={
        <div className='gap-x-4 flex items-center'>
          {!user?.isTotpEnabled ? <EnableTotp /> : <DisableTotp />}
        </div>
      }
    />
  );
};

export default WrapperTotp;
