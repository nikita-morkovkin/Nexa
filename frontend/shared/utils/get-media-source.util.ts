import { MEDIA_URL } from '@/shared/constants/url.constants';

export function getMediaSource(path: string | undefined | null) {
  if (!path) return '';

  if (path.startsWith('http') || path.startsWith('https')) {
    return path;
  }

  return MEDIA_URL + path;
}
