import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/common/DropdownMenu';
import ChannelAvatar from '@/components/ui/elements/ChannelAvatar';
import { LogoutUserDocument } from '@/graphql/gql/graphql';
import { useAuth } from '@/shared/hooks/useAuth';
import { useCurrentProfile } from '@/shared/hooks/useCurrentProfile';
import { useMutation } from '@apollo/client/react';
import { LayoutDashboard, Loader, LogOut, User } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import Notifications from './notifications/Notifications';

const ProfileMenu = () => {
  const t = useTranslations('layout.headerMenu.profileMenu');
  const router = useRouter();
  const { exit } = useAuth();
  const { user, isLoadingProfile } = useCurrentProfile();
  const [logoutUser] = useMutation(LogoutUserDocument, {
    onCompleted() {
      exit();
      toast.success(t('logoutSuccess'));
      router.push('/account/login');
    },
    onError() {
      toast.error(t('logoutError'));
    },
  });

  return isLoadingProfile || !user ? (
    <Loader className='size-6 animate-spin text-muted-foreground' />
  ) : (
    <>
      <Notifications />
      <DropdownMenu>
        <DropdownMenuTrigger>
          <ChannelAvatar channel={user} />
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end' className='w-[230px]'>
          <div className='flex items-center gap-x-3 p-2'>
            <ChannelAvatar channel={user} />
            <h2 className='text-foreground font-semibold'>{user.username}</h2>
          </div>
          <DropdownMenuSeparator />
          <Link href={`/${user.username}`}>
            <DropdownMenuItem className='hover:cursor-pointer'>
              <User className='size-4 mr-1' />
              <p className='font-semibold'>{t('channel')}</p>
            </DropdownMenuItem>
          </Link>
          <Link href={`/dashboard/settings`}>
            <DropdownMenuItem className='hover:cursor-pointer'>
              <LayoutDashboard className='size-4 mr-1' />
              <p className='font-semibold'>{t('dashboard')}</p>
            </DropdownMenuItem>
          </Link>
          <DropdownMenuItem
            onClick={() => logoutUser()}
            className='hover:cursor-pointer'
          >
            <LogOut className='size-4 mr-1' />
            <p className='font-semibold'>{t('logout')}</p>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default ProfileMenu;
