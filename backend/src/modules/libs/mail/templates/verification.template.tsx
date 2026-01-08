import {
  Body,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Tailwind,
  Text,
} from '@react-email/components';
import * as React from 'react';

interface VerificationTemplateProps {
  domain: string;
  token: string;
}

const VerificationTemplate = ({ domain, token }: VerificationTemplateProps) => {
  const verificationUrl = `${domain}/account/verify?token=${token}`;

  return (
    <Html>
      <Head />
      <Preview>Верификация аккаунта</Preview>
      <Tailwind>
        <Body className='mx-auto max-w-2xl p-6 bg-slate-50'>
          <Section className='text-center mb-8'>
            <Heading className='text-3xl text-black font-bold'>
              Подтвердите ваш email
            </Heading>
            <Text className='text-base text-black'>
              Нажмите на кнопку ниже, чтобы подтвердить ваш email.
            </Text>
            <Link
              href={verificationUrl}
              className='inline-flex items-center justify-center
              rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium
              text-white'
            >
              Подтвердить email
            </Link>
          </Section>
          <Section className='text-center'>
            <Text className='text-gray-600'>
              Если у вас есть вопросы, пожалуйста, свяжитесь с нами по адресу
            </Text>
            <Link href='mailto:help@morkovkin.stream' className='text-blue-600'>
              help@morkovkin.stream
            </Link>
          </Section>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default VerificationTemplate;
