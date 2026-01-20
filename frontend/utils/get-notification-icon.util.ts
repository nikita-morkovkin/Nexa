import { NotificationType } from '@/graphql/gql/graphql';
import { Bell, CheckIcon, Fingerprint, Medal, Radio, User } from 'lucide-react';

export function getNotificationIcon(type: NotificationType) {
  switch (type) {
    case NotificationType.StreamStart:
      return Radio;
    case NotificationType.NewFollower:
      return User;
    case NotificationType.NewSponsor:
      return Medal;
    case NotificationType.EnableTwoFactorAuth:
      return Fingerprint;
    case NotificationType.VerifiedChannel:
      return CheckIcon;
    default:
      return Bell;
  }
}
