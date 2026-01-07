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
import type { SessionMetadata } from 'src/shared/types/session-metadata.types';
import * as React from 'react';

interface PasswordRecoveryTemplateProps {
  domain: string;
  token: string;
  metadata: SessionMetadata;
}

const PasswordRecoveryTemplate = ({
  domain,
  token,
  metadata,
}: PasswordRecoveryTemplateProps) => {
  const resetLink = `${domain}/account/reset-password?token=${token}`;

  return (
    <Html>
      <Head />
      <Preview>Сброс пароля аккаунта</Preview>
      <Tailwind>
        <Body className='mx-auto max-w-2xl p-6 gb-slate-50'>
          <Section className='text-center mb-8'>
            <Heading className='text-3xl text-black font-bold'>
              Сброс пароля
            </Heading>
            <Text className='text-base text-black'>
              Нажмите на кнопку ниже, чтобы сбросить ваш пароль.
            </Text>
            <Link
              href={resetLink}
              className='inline-flex items-center justify-center rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white'
            >
              Сбросить пароль
            </Link>
          </Section>

          <Section className='bg-gray-100 rounded-xl p-6 mb-6'>
            <Heading className='text-xl font-semibold text-gray-100'>
              <ul className='list-disc list-inside mt-2'>
                <li>🪐 Расположение: {metadata.ip}</li>
                <li>🌐 Браузер: {metadata.device.browser}</li>
                <li>📱 Операционная система: {metadata.device.os}</li>
                <li>💻 Тип устройства: {metadata.device.type}</li>
              </ul>
              <Text className='text-gray-600'>
                Если этот запрос не был отправлен вами, пожалуйста,
                проигнорируйте его.
              </Text>
            </Heading>
          </Section>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default PasswordRecoveryTemplate;
