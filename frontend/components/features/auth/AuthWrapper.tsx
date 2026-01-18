import { Button } from '@/components/ui/common/Button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/common/Card';
import Image from 'next/image';
import Link from 'next/link';
import { PropsWithChildren } from 'react';

interface AuthWrapperProps {
  heading: string;
  backButtonLabel?: string;
  backButtonHref?: string;
}

const AuthWrapper = ({
  children,
  heading,
  backButtonHref,
  backButtonLabel,
}: PropsWithChildren<AuthWrapperProps>) => {
  return (
    <div className='flex min-h-screen w-full items-center justify-center'>
      <Card className='w-[450px]'>
        <CardHeader className='flex items-center justify-center gap-x-4'>
          <Image
            src='/icons/logo.svg'
            alt='MorkovkinStream'
            width={40}
            height={40}
          />
          <CardTitle className='text-xl'>{heading}</CardTitle>
        </CardHeader>
        <CardContent>{children}</CardContent>
        <CardFooter className='-mt-2'>
          {backButtonLabel && backButtonHref && (
            <Button variant='ghost' className='w-full' asChild>
              <Link href={backButtonHref}>{backButtonLabel}</Link>
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default AuthWrapper;
