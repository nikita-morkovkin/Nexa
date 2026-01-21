import { Separator } from '@/components/ui/common/Separator';
import {
  FindNotificationsByUserDocument,
  FindUnreadNotificationsCountDocument,
} from '@/graphql/gql/graphql';
import { getNotificationIcon } from '@/shared/utils/get-notification-icon.util';
import { useQuery } from '@apollo/client/react';
import parse from 'html-react-parser';
import { Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Fragment, useEffect } from 'react';

const NotificationsList = () => {
  const t = useTranslations('layout.headerMenu.profileMenu.notifications');
  const { refetch } = useQuery(FindUnreadNotificationsCountDocument);
  const { data, loading: isLoadingNotifications } = useQuery(
    FindNotificationsByUserDocument,
  );
  const notifications = data?.findNotificationsByUser || [];

  useEffect(() => {
    if (data) {
      refetch();
    }
  }, [data, refetch]);

  return (
    <>
      <h2 className='text-center text-lg font-semibold'>{t('heading')}</h2>
      <Separator className='my-3' />
      {isLoadingNotifications ? (
        <div className='flex items-center justify-center gap-x-2 text-sm text-foreground'>
          <Loader2 className='animate-spin size-5' />
          {t('loading')}
        </div>
      ) : (
        <div>
          {notifications.length ? (
            notifications.map((notification, index) => {
              const Icon = getNotificationIcon(notification.type);

              return (
                <Fragment key={index}>
                  <div className='flex items-center gap-x-3 text-sm'>
                    <div className='rounded-full bg-foreground p-2'>
                      <Icon className='size-6 text-secondary' />
                    </div>
                    <div>{parse(notification.message)}</div>
                  </div>
                  {index < notifications.length - 1 && (
                    <Separator className='my-3' />
                  )}
                </Fragment>
              );
            })
          ) : (
            <div className='text-center text-muted-foreground'>
              {t('empty')}
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default NotificationsList;
