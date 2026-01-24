'use client';

import Heading from '@/components/ui/elements/Heading';
import ToggleCardSkeleton from '@/components/ui/skeletons/ToggleCardSkeleton';
import {
  FindCurrentSessionDocument,
  FindSessionsByUserDocument,
} from '@/graphql/gql/graphql';
import { useQuery } from '@apollo/client/react';
import { useTranslations } from 'next-intl';
import SessionItem from './SessionItem';

const SessionsList = () => {
  const t = useTranslations('dashboard.settings.sessions');

  const { data: sessionData, loading: isLoadingSession } = useQuery(
    FindCurrentSessionDocument,
  );
  const currentSession = sessionData?.findCurrentSession;

  const { data: sessionsData, loading: isLoadingSessions } = useQuery(
    FindSessionsByUserDocument,
  );
  const sessions = sessionsData?.findSessionsByUser;

  let activeSessionsElement;

  if (isLoadingSessions) {
    activeSessionsElement = Array.from({ length: 3 }).map((_, index) => (
      <ToggleCardSkeleton key={index} />
    ));
  } else if (sessions?.length) {
    activeSessionsElement = sessions.map((session, index) => (
      <SessionItem key={index} session={session} />
    ));
  } else {
    activeSessionsElement = (
      <div className='text-muted-foreground'>{t('info.notFound')}</div>
    );
  }

  return (
    <div className='space-y-6'>
      <Heading title={t('info.current')} size={'sm'} />
      {isLoadingSession ? (
        <ToggleCardSkeleton />
      ) : (
        currentSession && (
          <SessionItem session={currentSession} isCurrentSession />
        )
      )}

      <Heading title={t('info.active')} size={'sm'} />
      {activeSessionsElement}
    </div>
  );
};

export default SessionsList;
