'use client';

import { Button } from '@/components/ui/common/Button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/common/Form';
import { Input } from '@/components/ui/common/Input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/common/Select';
import {
  ChangeStreamInfoDocument,
  FindAllCategoriesDocument,
  FindChannelByUsernameQuery,
} from '@/graphql/gql/graphql';
import {
  changeStreamInfoSchema,
  TypeChangeStreamInfoSchema,
} from '@/schemas/stream/change-stream-info.schema';
import { useMutation, useQuery } from '@apollo/client/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

interface ChangeInfoFormProps {
  stream: FindChannelByUsernameQuery['findChannelByUsername']['stream'];
}

const ChangeStreamInfoForm = ({ stream }: ChangeInfoFormProps) => {
  const t = useTranslations('stream.settings.info');
  const { data } = useQuery(FindAllCategoriesDocument);
  const categories = data?.findAllCategories ?? [];

  const [updateStreamInfo, { loading: isLoadingUpdateStreamInfo }] =
    useMutation(ChangeStreamInfoDocument, {
      onCompleted() {
        toast.success(t('successMessage'));
      },
      onError() {
        toast.error(t('errorMessage'));
      },
    });

  const form = useForm<TypeChangeStreamInfoSchema>({
    resolver: zodResolver(changeStreamInfoSchema),
    values: {
      title: stream.title ?? '',
      categoryId: stream.category.id ?? '',
    },
  });

  const handleSubmit = (data: TypeChangeStreamInfoSchema) => {
    updateStreamInfo({ variables: { data } });
  };

  const { isSubmitting, isValid } = form.formState;

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className='space-y-4 mt-4'
      >
        <FormField
          control={form.control}
          name='title'
          render={({ field }) => (
            <FormItem className={'pb-3'}>
              <FormLabel className='text-base font-semibold'>
                {t('titleLabel')}
              </FormLabel>
              <FormControl>
                <Input
                  placeholder={t('titlePlaceholder')}
                  disabled={isLoadingUpdateStreamInfo}
                  {...field}
                />
              </FormControl>
              <FormDescription>{t('titleDescription')}</FormDescription>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='categoryId'
          render={({ field }) => (
            <FormItem className={'pb-3'}>
              <FormLabel className='text-base font-semibold'>
                {t('categoryLabel')}
              </FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={t('categoryPlaceholder')} />
                    </SelectTrigger>
                  </FormControl>

                  <SelectContent className='p-0'>
                    {categories.map(category => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormDescription>{t('categoryDescription')}</FormDescription>
            </FormItem>
          )}
        />

        <Button
          disabled={isSubmitting || !isValid || isLoadingUpdateStreamInfo}
        >
          {t('submitButton')}
        </Button>
      </form>
    </Form>
  );
};

export default ChangeStreamInfoForm;
