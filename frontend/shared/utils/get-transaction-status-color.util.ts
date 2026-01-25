import { TransactionStatus } from '@/graphql/gql/graphql';

export function getTransactionStatusColor(status: TransactionStatus): string {
  switch (status) {
    case TransactionStatus.Pending:
      return 'text-yellow-500';
    case TransactionStatus.Success:
      return 'text-green-500';
    case TransactionStatus.Failed:
      return 'text-red-500';
    case TransactionStatus.Expired:
      return 'text-muted-foreground';
    default:
      return '';
  }
}
