'use client';

import { Button } from '@/components/ui/common/Button';
import { Card } from '@/components/ui/common/Card';
import { Form, FormField } from '@/components/ui/common/Form';
import ChannelAvatar from '@/components/ui/elements/ChannelAvatar';
import ConfirmModal from '@/components/ui/elements/ConfirmModal';
import {
  RemoveStreamThumbnailDocument,
  UpdateStreamThumbnailDocument,
  type FindChannelByUsernameQuery,
} from '@/graphql/gql/graphql';
import {
  TypeUploadFileSchema,
  uploadFileSchema,
} from '@/schemas/file/upload-file.schema';
import { useCurrentProfile } from '@/shared/hooks/useCurrentProfile';
import { getMediaSource } from '@/shared/utils/get-media-source.util';
import { useMutation } from '@apollo/client/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Trash } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useRef, type ChangeEvent } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

interface ChangeThumbnailFormProps {
  stream: FindChannelByUsernameQuery['findChannelByUsername']['stream'];
}

const ChangeThumbnailForm = ({ stream }: ChangeThumbnailFormProps) => {
  const t = useTranslations('stream.settings.thumbnail');
  const { user } = useCurrentProfile();
  const inputRef = useRef<HTMLInputElement>(null);

  const form = useForm<TypeUploadFileSchema>({
    resolver: zodResolver(uploadFileSchema),
    values: {
      file: getMediaSource(stream.thumbnailUrl),
    },
  });

  const [updateThumbnail, { loading: isLoadingUpdateThumbnail }] = useMutation(
    UpdateStreamThumbnailDocument,
    {
      onCompleted() {
        toast.success(t('successUpdateMessage'));
      },
      onError() {
        toast.error(t('errorUpdateMessage'));
      },
    },
  );

  const [removeThumbnail, { loading: isLoadingRemoveThumbnail }] = useMutation(
    RemoveStreamThumbnailDocument,
    {
      onCompleted() {
        toast.success(t('successRemoveMessage'));
      },
      onError() {
        toast.error(t('errorRemoveMessage'));
      },
    },
  );

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      event.preventDefault();
      form.setValue('file', file);
      updateThumbnail({ variables: { file: file } });
    }
  };

  return (
    <Form {...form}>
      <form>
        <FormField
          control={form.control}
          name='file'
          render={({ field }) => (
            <>
              <div className='flex items-center space-x-6'>
                {stream.thumbnailUrl ? (
                  <Image
                    src={
                      field.value instanceof File
                        ? URL.createObjectURL(field.value)
                        : field.value!
                    }
                    alt={stream.title}
                    width={190}
                    height={80}
                    className='aspect-video rounded-lg'
                  />
                ) : (
                  <Card className='flex h-28 w-full flex-col items-center justify-center rounded-lg'>
                    <ChannelAvatar channel={user!} />
                  </Card>
                )}
                <div className='flex w-full items-center gap-x-3'>
                  <input
                    type='file'
                    ref={inputRef}
                    className='hidden'
                    onChange={handleImageChange}
                  />
                  <Button
                    type='button'
                    variant={'secondary'}
                    onClick={() => inputRef.current?.click()}
                    disabled={
                      isLoadingUpdateThumbnail || isLoadingRemoveThumbnail
                    }
                  >
                    {t('updateButton')}
                  </Button>
                  {stream.thumbnailUrl && (
                    <ConfirmModal
                      heading={t('confirmModal.heading')}
                      message={t('confirmModal.message')}
                      onConfirm={() => removeThumbnail()}
                    >
                      <Button
                        type='button'
                        variant={'ghost'}
                        size={'icon'}
                        disabled={
                          isLoadingUpdateThumbnail || isLoadingRemoveThumbnail
                        }
                      >
                        <Trash className='size-4' />
                      </Button>
                    </ConfirmModal>
                  )}
                </div>
              </div>
              <p className='text-muted-foreground mt-5 text-sm'>{t('info')}</p>
            </>
          )}
        />
      </form>
    </Form>
  );
};

export default ChangeThumbnailForm;
