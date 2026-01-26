import StreamsList from '@/components/features/streams/list/StreamsList';
import {
  FindRandomStreamsDocument,
  FindRandomStreamsQuery,
} from '@/graphql/gql/graphql';
import { SERVER_URL } from '@/shared/constants/url.constants';
import { getTranslations } from 'next-intl/server';

function generateFakeStreams() {
  const fakeData = [
    {
      title: 'Мы играем в Бравл Старс! Прокачка до 30 ранга',
      category: { title: 'Brawl Stars', slug: 'brawl-stars' },
      username: 'BrawlMaster',
    },
    {
      title: 'Проходим GTA 6 | Первые миссии на ультрах',
      category: { title: 'GTA VI', slug: 'gta-vi' },
      username: 'RockstarGamer',
    },
    {
      title: 'Утренний Чилл | Общаемся и смотрим видосы',
      category: { title: 'Just Chatting', slug: 'just-chatting' },
      username: 'StreamerGirl',
    },
    {
      title: 'ФИНАЛ ТУРНИРА ПО COUNTER-STRIKE 2',
      category: { title: 'Counter-Strike 2', slug: 'cs2' },
      username: 'CyberPro',
    },
  ];

  return fakeData.map((data, i) => ({
    title: data.title,
    thumbnailUrl: `https://picsum.photos/400/225?random=${i}`,
    isLive: true,
    user: {
      username: data.username,
      avatar: `https://api.dicebear.com/9.x/avataaars/svg?seed=${data.username}`,
      isVerified: i % 2 === 0,
    },
    category: data.category,
  }));
}

async function findRandomStreams() {
  try {
    const query = FindRandomStreamsDocument.loc?.source.body;

    const response = await fetch(SERVER_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
      next: {
        revalidate: 30,
      },
    });

    const data = await response.json();

    if (
      !data.data ||
      !data.data.getRandomFourStreams ||
      data.data.getRandomFourStreams.length === 0
    ) {
      return { streams: generateFakeStreams() };
    }

    return {
      streams: data.data
        .getRandomFourStreams as FindRandomStreamsQuery['getRandomFourStreams'],
    };
  } catch (error) {
    console.error(error);
    return { streams: generateFakeStreams() };
  }
}

export default async function HomePage() {
  const t = await getTranslations('home');
  const { streams } = await findRandomStreams();

  return (
    <div className='space-y-10'>
      <StreamsList heading={t('streamsHeading')} streams={streams} />
    </div>
  );
}
