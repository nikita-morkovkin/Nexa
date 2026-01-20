'use client';

import ChannelAvatar from '@/components/ui/elements/ChannelAvatar';
import { useCurrentProfile } from '../../hooks/useCurrentProfile';

export default function Home() {
  const { user, isLoadingProfile } = useCurrentProfile();

  return (
    <div>
      {isLoadingProfile ? (
        <div>Загрузка пользователя</div>
      ) : user ? (
        <div>
          {JSON.stringify(user)}
          <ChannelAvatar
            channel={{ username: user.username, avatar: user.avatar }}
          />
        </div>
      ) : (
        <div>Пользователь не авторизован</div>
      )}
    </div>
  );
}
