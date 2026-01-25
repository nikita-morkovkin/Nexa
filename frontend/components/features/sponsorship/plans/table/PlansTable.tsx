'use client';

import { Button } from '@/components/ui/common/Button';
import { DataTable } from '@/components/ui/common/DataTable';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/common/DropdownMenu';
import Heading from '@/components/ui/elements/Heading';
import DataTableSkeleton from '@/components/ui/skeletons/DataTableSkeleton';
import {
  FindMySponsorshipPlansDocument,
  RemoveSponsorshipPlanDocument,
  type FindMySponsorshipPlansQuery,
} from '@/graphql/gql/graphql';
import { useCurrentProfile } from '@/shared/hooks/useCurrentProfile';
import { useFormatDateWithTranslations } from '@/shared/hooks/useFormatDateWithTranslations';
import { convertPrice } from '@/shared/utils/convert-price.util';
import { useMutation, useQuery } from '@apollo/client/react';
import { type ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, MoreHorizontal, Trash } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import VerifiedChannelAlert from '../alert/VerifiedChannelAlert';
import CreatePlanForm from '../forms/CreatePlanForm';

const PlansTable = () => {
  const t = useTranslations('dashboard.plans');
  const { user } = useCurrentProfile();
  const formatDate = useFormatDateWithTranslations();
  const {
    data,
    loading: isLoadingPlans,
    refetch,
  } = useQuery(FindMySponsorshipPlansDocument);
  const plans = data?.findMySponsorshipPlans ?? [];

  const [removePlan, { loading: isLoadingRemovePlan }] = useMutation(
    RemoveSponsorshipPlanDocument,
    {
      onCompleted() {
        refetch();
        toast.success(t('columns.successMessage'));
      },
      onError() {
        toast.error(t('columns.errorMessage'));
      },
    },
  );

  const plansColumns: ColumnDef<
    FindMySponsorshipPlansQuery['findMySponsorshipPlans'][0]
  >[] = [
    {
      accessorKey: 'createdAt',
      header: ({ column }) => {
        return (
          <Button
            variant='ghost'
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            <span className='font-semibold'>{t('columns.date')}</span>
            <ArrowUpDown className='ml-2 size-4' />
          </Button>
        );
      },
      cell: ({ row }) => formatDate(row.original.createdAt),
    },
    {
      accessorKey: 'title',
      header: t('columns.title'),
      cell: ({ row }) => row.original.title,
    },
    {
      accessorKey: 'price',
      header: ({ column }) => {
        return (
          <Button
            variant='ghost'
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            <span className='font-semibold'>{t('columns.price')}</span>
            <ArrowUpDown className='ml-2 size-4' />
          </Button>
        );
      },
      cell: ({ row }) => convertPrice(row.original.price),
    },
    {
      accessorKey: 'actions',
      header: t('columns.actions'),
      cell: ({ row }) => {
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant={'ghost'} className='size-8 p-0'>
                <MoreHorizontal className='size-4' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side='right'>
              <DropdownMenuItem
                asChild
                className='cursor-pointer text-red-500 focus:text-red-500'
                onClick={() =>
                  removePlan({ variables: { planId: row.original.id } })
                }
                disabled={isLoadingRemovePlan}
              >
                <Trash className='mr-2 size-4' />
                {t('columns.remove')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return user?.isVerified ? (
    <div className='lg:px-10'>
      <div className='block items-center justify-between space-y-3 lg:flex lg:space-y-0'>
        <Heading
          title={t('header.heading')}
          description={t('header.description')}
          size={'large'}
        />
        <CreatePlanForm />
      </div>
      <div className='mt-7'>
        {isLoadingPlans ? (
          <DataTableSkeleton />
        ) : (
          <DataTable
            columns={plansColumns}
            data={plans}
            filterKeys={[
              { id: 'createdAt', title: t('columns.date') },
              { id: 'price', title: t('columns.price') },
            ]}
          />
        )}
      </div>
    </div>
  ) : (
    <VerifiedChannelAlert />
  );
};

export default PlansTable;
