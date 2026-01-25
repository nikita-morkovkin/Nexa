'use client';

import { Button } from '@/components/ui/common/Button';
import { DataTable } from '@/components/ui/common/DataTable';
import Heading from '@/components/ui/elements/Heading';
import DataTableSkeleton from '@/components/ui/skeletons/DataTableSkeleton';
import {
  FindAllMyTransactionsDocument,
  type FindAllMyTransactionsQuery,
} from '@/graphql/gql/graphql';
import { useFormatDateWithTranslations } from '@/shared/hooks/useFormatDateWithTranslations';
import { convertPrice } from '@/shared/utils/convert-price.util';
import { getTransactionStatusColor } from '@/shared/utils/get-transaction-status-color.util';
import { useQuery } from '@apollo/client/react';
import { type ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';
import { useTranslations } from 'next-intl';

const TransactionsTable = () => {
  const t = useTranslations('dashboard.transactions');
  const formatDate = useFormatDateWithTranslations();

  const { data, loading: isLoadingTransactions } = useQuery(
    FindAllMyTransactionsDocument,
  );
  const transactions = data?.findMyTransactions ?? [];

  const transactionsColumns: ColumnDef<
    FindAllMyTransactionsQuery['findMyTransactions'][0]
  >[] = [
    {
      accessorKey: 'createdAt',
      header: ({ column }) => {
        return (
          <Button
            variant='ghost'
            className='h-auto pl-5 hover:bg-transparent'
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            <span className='font-semibold'>{t('columns.date')}</span>
            <ArrowUpDown className='ml-2 size-4' />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className='pl-5'>{formatDate(row.original.createdAt)}</div>
      ),
    },
    {
      accessorKey: 'status',
      header: ({ column }) => {
        return (
          <Button
            variant='ghost'
            className='h-auto p-0 hover:bg-transparent'
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            <span className='font-semibold'>{t('columns.status')}</span>
            <ArrowUpDown className='ml-2 size-4' />
          </Button>
        );
      },
      cell: ({ row }) => (
        <span
          className={`font-semibold ${getTransactionStatusColor(
            row.original.status,
          )}`}
        >
          {row.original.status}
        </span>
      ),
    },
    {
      accessorKey: 'amount',
      header: t('columns.amount'),
      cell: ({ row }) => convertPrice(row.original.amount),
    },
  ];

  return (
    <div className='lg:px-10'>
      <Heading
        title={t('header.heading')}
        description={t('header.description')}
        size={'large'}
      />
      <div className='mt-6'>
        {isLoadingTransactions ? (
          <DataTableSkeleton />
        ) : (
          <DataTable
            columns={transactionsColumns}
            data={transactions}
            filterKeys={[
              { id: 'createdAt', title: t('columns.date') },
              { id: 'status', title: t('columns.status') },
            ]}
          />
        )}
      </div>
    </div>
  );
};

export default TransactionsTable;
