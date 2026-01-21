import { useAuthStore } from '@/store/auth/auth.store';

export function useAuth() {
  const isAuth = useAuthStore(state => state.isAuth);
  const setIsAuth = useAuthStore(state => state.setIsAuth);

  const auth = () => setIsAuth(true);
  const exit = () => setIsAuth(false);

  return {
    isAuth,
    auth,
    exit,
  };
}
