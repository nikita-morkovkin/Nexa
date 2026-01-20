import {
  ClearSessionCookieDocument,
  FindCurrentProfileDocument,
} from '@/graphql/gql/graphql';
import { useMutation, useQuery } from '@apollo/client/react';
import { useEffect } from 'react';
import { useAuth } from './useAuth';

export const useCurrentProfile = () => {
  const { isAuth, exit } = useAuth();

  const { data, loading, refetch, error } = useQuery(
    FindCurrentProfileDocument,
    {
      skip: !isAuth,
    },
  );

  const [clearSessionCookie] = useMutation(ClearSessionCookieDocument);

  useEffect(() => {
    if (!error) {
      return;
    }

    if (isAuth) {
      clearSessionCookie();
    }

    exit();
  }, [error, isAuth, clearSessionCookie, exit]);

  return {
    user: data?.findCurrentProfile ?? null,
    isLoadingProfile: loading,
    refetch,
  };
};
