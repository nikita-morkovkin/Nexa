import { useCallback, useSyncExternalStore } from 'react';

export function useMediaQuery(
  query: string,
  defaultValue: boolean = false,
): boolean {
  const subscribe = useCallback(
    (callback: () => void) => {
      const matchMediaList = window.matchMedia(query);
      matchMediaList.addEventListener('change', callback);

      return () => matchMediaList.removeEventListener('change', callback);
    },
    [query],
  );

  const getSnapshot = useCallback(() => {
    return window.matchMedia(query).matches;
  }, [query]);

  const getServerSnapshot = useCallback(() => {
    return defaultValue;
  }, [defaultValue]);

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
