import Header from '@/components/layouts/header/Header';
import { ReactNode } from 'react';

export default async function WebsiteLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <div className='flex w-full flex-col'>
      <div className='flex-1'>
        <div className='fixed inset-0 z-50 h[75px] w-full'>
          <Header />
        </div>
        <main className='mt-[75px]'>{children}</main>
      </div>
    </div>
  );
}
