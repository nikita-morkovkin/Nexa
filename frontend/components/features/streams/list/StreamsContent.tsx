'use client';

import Heading from '@/components/ui/elements/Heading';
import {
  FindAllStreamsDocument,
  type FindAllStreamsQuery,
} from '@/graphql/gql/graphql';
import { useQuery } from '@apollo/client/react';
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import StreamCardSkeleton from '../skeletons/StreamCardSkeleton';
import StreamsList from './StreamsList';

interface StreamsContentProps {
  streams: FindAllStreamsQuery['findAllStreams'];
}

const StreamsContent = ({ streams }: StreamsContentProps) => {
  const take = 12;
  const [hasMore, setHasMore] = useState<boolean>(true);
  const t = useTranslations('streams');
  const searchParams = useSearchParams();
  const [streamsList, setStreamsList] = useState<
    FindAllStreamsQuery['findAllStreams']
  >(streams ?? []);
  const searchTerm = searchParams.get('searchTerm');

  const { data, fetchMore } = useQuery(FindAllStreamsDocument, {
    variables: {
      filters: {
        searchTerm,
        take,
        skip: 0,
      },
    },
    fetchPolicy: 'network-only',
  });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  // The current functional works, but I don't know how to correct the problem with useEffect hook
  useEffect(() => {
    const list = data?.findAllStreams;

    if (!Array.isArray(list)) {
      setHasMore(false);
      return;
    }

    if (list.length > 0) {
      setStreamsList(list);
      setHasMore(list.length === take);
    } else {
      setHasMore(false);
    }
  }, [data]);

  const fetchMoreStreams = () => {
    if (!hasMore) {
      return;
    }

    setTimeout(async () => {
      const { data: newData } = await fetchMore({
        variables: {
          filters: {
            searchTerm,
            take,
            skip: streamsList.length,
          },
        },
      });

      if (newData?.findAllStreams.length) {
        setStreamsList(prev => [...prev, ...newData.findAllStreams]);
        setHasMore(newData.findAllStreams.length === take);
      } else {
        setHasMore(false);
      }
    }, 400);
  };

  return (
    <>
      <Heading
        title={
          searchTerm ? `${t('searchHeading')} "${searchTerm}"` : t('heading')
        }
      />
      <InfiniteScroll
        dataLength={streamsList.length}
        next={fetchMoreStreams}
        hasMore={hasMore}
        loader={
          <div className='mt-6 gap-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
            {Array.from({ length: 12 }).map((_, index) => (
              <StreamCardSkeleton key={index} />
            ))}
          </div>
        }
      >
        <StreamsList streams={streamsList} />
      </InfiniteScroll>
    </>
  );
};

export default StreamsContent;
