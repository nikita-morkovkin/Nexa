import {
  ChatMessageAddedDocument,
  FindAllMessagesByStreamDocument,
  FindAllMessagesByStreamQuery,
  FindSponsorsByChannelDocument,
  type FindChannelByUsernameQuery,
} from '@/graphql/gql/graphql';
import { useQuery, useSubscription } from '@apollo/client/react';
import MessageItem from './MessageItem';

interface MessagesListProps {
  channel: FindChannelByUsernameQuery['findChannelByUsername'];
}

const MessagesList = ({ channel }: MessagesListProps) => {
  const { data } = useQuery(FindAllMessagesByStreamDocument, {
    variables: {
      streamId: channel.stream.id,
    },
  });
  const messages = data?.findAllMessagesByStream ?? [];

  const { data: sponsorsData } = useQuery(FindSponsorsByChannelDocument, {
    variables: {
      channelId: channel.stream.id,
    },
  });
  const sponsors = sponsorsData?.findSponsorsByChannel;

  const sponsorIds = new Set(sponsors?.map(sponsor => sponsor.user.id));

  useSubscription(ChatMessageAddedDocument, {
    variables: {
      streamId: channel.stream.id,
    },
    onData: ({ client, data }) => {
      const newMessage = data.data?.chatMessageAdded;

      if (!newMessage) return;

      client.cache.updateQuery<FindAllMessagesByStreamQuery>(
        {
          query: FindAllMessagesByStreamDocument,
          variables: { streamId: channel.stream.id },
        },
        cachedData => {
          if (!cachedData) {
            return cachedData;
          }

          return {
            findAllMessagesByStream: [
              newMessage,
              ...cachedData.findAllMessagesByStream,
            ],
          };
        },
      );
    },
  });

  return (
    <div className='flex h-full flex-1 flex-col-reverse overflow-y-auto'>
      {messages.map((message, index) => (
        <MessageItem
          message={message}
          key={index}
          isSponsor={sponsorIds.has(message.user.id)}
        />
      ))}
    </div>
  );
};

export default MessagesList;
