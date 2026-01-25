'use client';

import { Button } from '@/components/ui/common/Button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/common/Dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/common/Form';
import { Input } from '@/components/ui/common/Input';
import { Textarea } from '@/components/ui/common/Textarea';
import {
  CreateSponsorshipPlanDocument,
  FindMySponsorshipPlansDocument,
} from '@/graphql/gql/graphql';
import {
  createPlanSchema,
  type TypeCreatePlanSchema,
} from '@/schemas/plan/create-plan.schema';
import { useMutation, useQuery } from '@apollo/client/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

const CreatePlanForm = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const t = useTranslations('dashboard.plans.createForm');
  const { refetch } = useQuery(FindMySponsorshipPlansDocument);

  const [createPlan, { loading: isLoadingCreatePlan }] = useMutation(
    CreateSponsorshipPlanDocument,
    {
      onCompleted() {
        setIsOpen(false);
        refetch();
        toast.success(t('successMessage'));
      },
      onError() {
        toast.error(t('errorMessage'));
      },
    },
  );

  const form = useForm<TypeCreatePlanSchema>({
    resolver: zodResolver(createPlanSchema),
    defaultValues: {
      title: '',
      description: '',
      price: 0,
    },
  });

  const { isValid } = form.formState;

  const handleSubmit = (data: TypeCreatePlanSchema) => {
    createPlan({ variables: { data: data } });
  };

  const handleOpen = () => {
    setIsOpen(!isOpen);
    form.reset();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpen}>
      <DialogTrigger asChild>
        <Button>{t('trigger')}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('heading')}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className='space-y-6'
          >
            <FormField
              control={form.control}
              name='title'
              render={({ field }) => (
                <FormItem className='mt-1'>
                  <FormLabel className='text-sm'>{t('titleLabel')}</FormLabel>
                  <FormControl className='w-full'>
                    <Input
                      placeholder={t('titlePlaceholder')}
                      disabled={isLoadingCreatePlan}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className='mt-2'>
                    {t('titleDescription')}
                  </FormDescription>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='description'
              render={({ field }) => (
                <FormItem className='mt-1'>
                  <FormLabel className='text-sm'>
                    {t('descriptionLabel')}
                  </FormLabel>
                  <FormControl className='w-full'>
                    <Textarea
                      placeholder={t('descriptionPlaceholder')}
                      disabled={isLoadingCreatePlan}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className='mt-2'>
                    {t('descriptionDescription')}
                  </FormDescription>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='price'
              render={({ field }) => (
                <FormItem className='mt-1'>
                  <FormLabel className='text-sm'>{t('priceLabel')}</FormLabel>
                  <FormControl className='w-full'>
                    <Input
                      type='number'
                      placeholder={t('pricePlaceholder')}
                      disabled={isLoadingCreatePlan}
                      {...field}
                      onChange={e => field.onChange(e.target.valueAsNumber)}
                    />
                  </FormControl>
                  <FormDescription className='mt-2'>
                    {t('priceDescription')}
                  </FormDescription>
                </FormItem>
              )}
            />
            <div className='flex justify-end'>
              <Button disabled={!isValid}>{t('submitButton')}</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePlanForm;
