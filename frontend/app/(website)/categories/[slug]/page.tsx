import CategoryOverview from '@/components/features/category/overview/CategoryOverview';
import {
  FindCategoryBySlugDocument,
  FindCategoryBySlugQuery,
  FindCategoryBySlugQueryVariables,
} from '@/graphql/gql/graphql';
import { SERVER_URL } from '@/shared/constants/url.constants';
import { getMediaSource } from '@/shared/utils/get-media-source.util';
import { type Metadata } from 'next';

function generateFakeCategory(
  slug: string,
): FindCategoryBySlugQuery['findCategoryBySlug'] {
  return {
    title: slug
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' '),
    thumbnailUrl:
      'https://static-cdn.jtvnw.net/ttv-boxart/1614555877-285x380.jpg',
    description:
      'This is a mock category description. In a real environment, this data would be fetched from the server.',
    streams: [
      {
        title: 'Exploring the new update!',
        thumbnailUrl: null,
        isLive: true,
        user: {
          username: 'morkovkin',
          avatar: null,
          isVerified: true,
        },
        category: {
          title: 'Brawl Stars',
          slug: 'brawl-stars',
        },
      },
      {
        title: 'Road to Global Elite',
        thumbnailUrl: null,
        isLive: false,
        user: {
          username: 'streamer_pro',
          avatar: null,
          isVerified: false,
        },
        category: {
          title: 'Counter-Strike 2',
          slug: 'cs2',
        },
      },
    ],
  };
}

async function findCategoryBySlug(slug: string) {
  try {
    const query = FindCategoryBySlugDocument.loc?.source.body;
    const variables: FindCategoryBySlugQueryVariables = { slug };

    const response = await fetch(SERVER_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query, variables }),
      next: {
        revalidate: 30,
      },
    });

    const data = await response.json();

    if (!data.data || !data.data.findCategoryBySlug) {
      return {
        category: generateFakeCategory(slug),
      };
    }

    return {
      category: data.data
        .findCategoryBySlug as FindCategoryBySlugQuery['findCategoryBySlug'],
    };
  } catch (error) {
    console.error(error);
    return {
      category: generateFakeCategory(slug),
    };
  }
}

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const data = await findCategoryBySlug(params.slug);

  return {
    title: data.category.title,
    description: data.category.description,
    openGraph: {
      images: {
        url: getMediaSource(data.category.thumbnailUrl),
        alt: data.category.title,
      },
    },
  };
}

export default async function CategoryPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const params = await props.params;
  const data = await findCategoryBySlug(params.slug);

  return <CategoryOverview category={data.category} />;
}
