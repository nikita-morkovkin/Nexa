'use client';

import { Form, FormField } from '@/components/ui/common/Form';
import ToggleCard from '@/components/ui/elements/ToggleCard';
import ToggleCardSkeleton from '@/components/ui/skeletons/ToggleCardSkeleton';
import { ChangeNotificationsSettingsDocument } from '@/graphql/gql/graphql';
import {
  changeNotificationsSettingsSchema,
  TypeChangeNotificationsSettingsSchema,
} from '@/schemas/user/change-notifications.settings.schema';
import { useNotificationsSettings } from '@/shared/hooks/useNotificationsSettings';
import { useMutation } from '@apollo/client/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

const ChangeNotificationsSettingsForm = () => {
  const t = useTranslations('dashboard.settings.notifications');
  const { settings, isLoadingSettings } = useNotificationsSettings();

  const form = useForm<TypeChangeNotificationsSettingsSchema>({
    resolver: zodResolver(changeNotificationsSettingsSchema),
    values: {
      siteNotifications: settings?.siteNotifications ?? false,
      telegramNotifications: settings?.telegramNotifications ?? false,
    },
  });

  const [updateNotificationsSettings, { loading: isLoadingUpdate }] =
    useMutation(ChangeNotificationsSettingsDocument, {
      onCompleted(data) {
        toast.success(t('successMessage'));

        if (data.changeNotificationsSettings.telegramAuthToken) {
          window.open(
            `https://t.me/NexaBot?start=${data.changeNotificationsSettings.telegramAuthToken}`,
            '_blank',
          );
        }
      },
      onError() {
        toast.error(t('errorMessage'));
      },
    });

  const onChange = (
    field: keyof TypeChangeNotificationsSettingsSchema,
    value: boolean,
  ) => {
    form.setValue(field, value);

    updateNotificationsSettings({
      variables: { data: { ...form.getValues(), [field]: value } },
    });
  };

  return isLoadingSettings ? (
    Array.from({ length: 2 }).map((_, index) => (
      <ToggleCardSkeleton key={index} />
    ))
  ) : (
    <Form {...form}>
      <FormField
        control={form.control}
        name='siteNotifications'
        render={({ field }) => (
          <ToggleCard
            heading={t('siteNotifications.heading')}
            description={t('siteNotifications.description')}
            isDisabled={isLoadingUpdate}
            value={field.value}
            onChange={value => onChange('siteNotifications', value)}
          />
        )}
      />

      <FormField
        control={form.control}
        name='telegramNotifications'
        render={({ field }) => (
          <ToggleCard
            heading={t('telegramNotifications.heading')}
            description={t('telegramNotifications.description')}
            isDisabled={isLoadingUpdate}
            value={field.value}
            onChange={value => onChange('telegramNotifications', value)}
          />
        )}
      />
    </Form>
  );
};

export default ChangeNotificationsSettingsForm;
