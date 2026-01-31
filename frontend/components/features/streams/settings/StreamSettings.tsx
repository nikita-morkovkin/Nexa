'use client';

import { Button } from '@/components/ui/common/Button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/common/Dialog';
import { type FindChannelByUsernameQuery } from '@/graphql/gql/graphql';
import { useCurrentProfile } from '@/shared/hooks/useCurrentProfile';
import { Pencil } from 'lucide-react';
import { useTranslations } from 'next-intl';
import ChangeStreamInfoForm from './forms/ChangeStreamInfoForm';
import ChangeThumbnailForm from './forms/ChangeThumbnailForm';

interface StreamSettingsProps {
  channel: FindChannelByUsernameQuery['findChannelByUsername'];
}

const StreamSettings = ({ channel }: StreamSettingsProps) => {
  const t = useTranslations('stream.settings');
  const { user } = useCurrentProfile();
  const isOurChannel = user?.id === channel.id;

  if (!isOurChannel) {
    return null;
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={'ghost'} size={'lgIcon'}>
          <Pencil className='size-5' />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('heading')}</DialogTitle>
        </DialogHeader>
        <ChangeThumbnailForm stream={channel.stream} />
        <ChangeStreamInfoForm stream={channel.stream} />
      </DialogContent>
    </Dialog>
  );
};

export default StreamSettings;
