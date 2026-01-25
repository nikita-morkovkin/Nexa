'use client';

import { Button } from '@/components/ui/common/Button';
import { DataTable } from '@/components/ui/common/DataTable';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/common/DropdownMenu';
import ChannelAvatar from '@/components/ui/elements/ChannelAvatar';
import ChannelVerified from '@/components/ui/elements/ChannelVerified';
import Heading from '@/components/ui/elements/Heading';
import DataTableSkeleton from '@/components/ui/skeletons/DataTableSkeleton';
import {
  FindAllMyFollowersDocument,
  type FindAllMyFollowersQuery,
} from '@/graphql/gql/graphql';
import { useFormatDateWithTranslations } from '@/shared/hooks/useFormatDateWithTranslations';
import { useQuery } from '@apollo/client/react';
import { type ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal, User } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

const FollowersTable = () => {
  const t = useTranslations('dashboard.followers');
  const formatDate = useFormatDateWithTranslations();

  const { data, loading: isLoadingFollowers } = useQuery(
    FindAllMyFollowersDocument,
  );
  const followers = data?.findAllMyFollowers ?? [];

  const followersColumns: ColumnDef<
    FindAllMyFollowersQuery['findAllMyFollowers'][0]
  >[] = [
    {
      accessorKey: 'createdAt',
      header: t('columns.date'),
      cell: ({ row }) => formatDate(row.original.createdAt),
    },
    {
      accessorKey: 'followerUser.username',
      header: t('columns.user'),
      cell: ({ row }) => (
        <div className='flex items-center gap-x-2'>
          <ChannelAvatar channel={row.original.followerUser} size={'sm'} />
          <h2>{row.original.followerUser.username}</h2>
          {row.original.followerUser.isVerified && (
            <ChannelVerified size={'sm'} />
          )}
        </div>
      ),
    },
    {
      accessorKey: 'actions',
      header: t('columns.actions'),
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant={'ghost'} className='size-8 p-0'>
              <MoreHorizontal className='size-4' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent side='right'>
            <Link
              target='_blank'
              href={`/${row.original.followerUser.username}`}
            >
              <DropdownMenuItem>
                <User className='mr-2 size-4' />
                {t('columns.viewChannel')}
              </DropdownMenuItem>
            </Link>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
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
        {isLoadingFollowers ? (
          <DataTableSkeleton />
        ) : (
          <DataTable columns={followersColumns} data={followers} />
        )}
      </div>
    </div>
  );
};

export default FollowersTable;
