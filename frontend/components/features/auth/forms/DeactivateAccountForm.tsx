'use client';

import { Button } from '@/components/ui/common/Button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/common/Form';
import { Input } from '@/components/ui/common/Input';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/common/InputOTP';
import { DeactivateAccountDocument } from '@/graphql/gql/graphql';
import {
  deactivateAccountSchema,
  type TypeDeactivateAccountSchema,
} from '@/schemas/auth/deactivate-account.schema';
import { useAuth } from '@/shared/hooks/useAuth';
import { useMutation } from '@apollo/client/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import AuthWrapper from '../AuthWrapper';

const LoginForm = () => {
  const t = useTranslations('auth.deactivate');
  const router = useRouter();
  const { exit } = useAuth();
  const [isShowConfirm, setIsShowConfirm] = useState<boolean>(false);
  const [deactivateAccount, { loading: isLoadingDeactivate }] = useMutation(
    DeactivateAccountDocument,
    {
      onCompleted(data) {
        if (data.deactivateAccount.message) {
          setIsShowConfirm(true);
        } else {
          exit();
          toast.success(t('successMessage'));
          router.push('/');
        }
      },
      onError() {
        toast.error(t('errorMessage'));
      },
    },
  );

  const form = useForm<TypeDeactivateAccountSchema>({
    resolver: zodResolver(deactivateAccountSchema),
    mode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
      pin: '',
    },
  });

  const { isValid } = form.formState;

  const handleSubmit = async (data: TypeDeactivateAccountSchema) => {
    await deactivateAccount({
      variables: {
        data: {
          email: data.email,
          password: data.password,
          pin: data.pin!,
        },
      },
    });
  };

  return (
    <AuthWrapper
      heading={t('heading')}
      backButtonLabel={t('backButtonLabel')}
      backButtonHref='/dashboard/settings'
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className='grid gap-y-6'
        >
          {isShowConfirm ? (
            <FormField
              control={form.control}
              name='pin'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='font-semibold text-md'>
                    {t('pinLabel')}
                  </FormLabel>
                  <FormControl>
                    <InputOTP maxLength={6} {...field}>
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>
                  <FormMessage className='text-red-700' />
                </FormItem>
              )}
            />
          ) : (
            <>
              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='font-semibold text-md'>
                      {t('emailLabel')}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder='nikita.example@gmail.com'
                        type='email'
                        disabled={isLoadingDeactivate}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className='text-red-700' />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='password'
                render={({ field }) => (
                  <FormItem>
                    <div className='flex items-center justify-between'>
                      <FormLabel className='font-semibold text-md'>
                        {t('passwordLabel')}
                      </FormLabel>
                    </div>
                    <FormControl>
                      <Input
                        placeholder='********'
                        type='password'
                        disabled={isLoadingDeactivate}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className='text-red-700' />
                  </FormItem>
                )}
              />
            </>
          )}
          <Button
            className='mt-2 w-full'
            disabled={!isValid || isLoadingDeactivate}
            type='submit'
          >
            {t('submitButton')}
          </Button>
        </form>
      </Form>
    </AuthWrapper>
  );
};

export default LoginForm;
