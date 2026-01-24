'use client';

import { Button } from '@/components/ui/common/Button';
import ConfirmModal from '@/components/ui/elements/ConfirmModal';
import SessionCardContainer from '@/components/ui/elements/SessionCardContainer';
import {
  FindSessionsByUserDocument,
  RemoveSessionDocument,
  type FindCurrentSessionQuery,
  type FindSessionsByUserQuery,
} from '@/graphql/gql/graphql';
import { getBrowserIcon } from '@/shared/utils/get-browser-icon.util';
import { useMutation, useQuery } from '@apollo/client/react';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import SessionModal from './SessionModal';

interface SessionItemProps {
  session:
    | FindSessionsByUserQuery['findSessionsByUser'][0]
    | FindCurrentSessionQuery['findCurrentSession'];
  isCurrentSession?: boolean;
}

const SessionItem = ({ session, isCurrentSession }: SessionItemProps) => {
  const t = useTranslations('dashboard.settings.sessions.sessionItem');
  const { refetch } = useQuery(FindSessionsByUserDocument);

  const [removeSession, { loading: isLoadingRemoveSession }] = useMutation(
    RemoveSessionDocument,
    {
      onCompleted() {
        refetch();
        toast.success(t('successMessage'));
      },
      onError() {
        toast.error(t('errorMessage'));
      },
    },
  );

  const Icon = getBrowserIcon(session.metadata.device.browser);

  return (
    <SessionCardContainer
      heading={`${session.metadata.device.browser}, ${session.metadata.device.os}`}
      description={`${session.metadata.location.country}, ${session.metadata.location.city}`}
      Icon={Icon}
      rightContent={
        <div className='flex items-center gap-x-4'>
          {!isCurrentSession && (
            <ConfirmModal
              heading={t('confirmModal.heading')}
              message={t('confirmModal.message')}
              onConfirm={() => removeSession({ variables: { id: session.id } })}
            >
              <Button variant={'secondary'} disabled={isLoadingRemoveSession}>
                {t('deleteButton')}
              </Button>
            </ConfirmModal>
          )}
          <SessionModal session={session}>
            <Button>{t('detailsButton')}</Button>
          </SessionModal>
        </div>
      }
    />
  );
};

export default SessionItem;
