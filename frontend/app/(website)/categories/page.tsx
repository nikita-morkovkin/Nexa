import CategoriesList from '@/components/features/category/list/CategoriesList';
import {
  FindAllCategoriesDocument,
  FindAllCategoriesQuery,
} from '@/graphql/gql/graphql';
import { SERVER_URL } from '@/shared/constants/url.constants';
import { type Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

function generateFakeCategories() {
  const fakeData = [
    {
      title: 'Brawl Stars',
      slug: 'brawl-stars',
      thumbnailUrl:
        'https://static-cdn.jtvnw.net/ttv-boxart/1614555877-285x380.jpg',
    },
    {
      title: 'GTA VI',
      slug: 'gta-vi',
      thumbnailUrl:
        'https://static-cdn.jtvnw.net/ttv-boxart/1614555877-285x380.jpg',
    },
    {
      title: 'Just Chatting',
      slug: 'just-chatting',
      thumbnailUrl:
        'https://static-cdn.jtvnw.net/ttv-boxart/509658-285x380.jpg',
    },
    {
      title: 'Dota 2',
      slug: 'dota-2',
      thumbnailUrl: 'https://static-cdn.jtvnw.net/ttv-boxart/29595-285x380.jpg',
    },
    {
      title: 'League of Legends',
      slug: 'league-of-legends',
      thumbnailUrl: 'https://static-cdn.jtvnw.net/ttv-boxart/21779-285x380.jpg',
    },
    {
      title: 'Minecraft',
      slug: 'minecraft',
      thumbnailUrl:
        'https://static-cdn.jtvnw.net/ttv-boxart/27471_IGDB-285x380.jpg',
    },
    {
      title: 'VALORANT',
      slug: 'valorant',
      thumbnailUrl:
        'https://static-cdn.jtvnw.net/ttv-boxart/516575-285x380.jpg',
    },
  ];

  return fakeData.map((data, i) => ({
    ...data,
    id: i.toString(),
  }));
}

async function findAllCategories() {
  try {
    const query = FindAllCategoriesDocument.loc?.source.body;

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
      !data.data.findAllCategories ||
      data.data.findAllCategories.length === 0
    ) {
      return { categories: generateFakeCategories() };
    }

    return {
      categories: data.data
        .findAllCategories as FindAllCategoriesQuery['findAllCategories'],
    };
  } catch (error) {
    console.error(error);
    return { categories: generateFakeCategories() };
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('categories');

  return {
    title: t('heading'),
    description: t('description'),
  };
}

export default async function CategoriesPage() {
  const t = await getTranslations('userNav');
  const { categories } = await findAllCategories();

  return (
    <div className=''>
      <CategoriesList heading={t('categories')} categories={categories} />
    </div>
  );
}
