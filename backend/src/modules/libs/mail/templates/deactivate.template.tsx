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

interface DeactivateProps {
  domain: string;
  token: string;
  metadata: SessionMetadata;
}

const DeactivateTemplate = ({ domain, token, metadata }: DeactivateProps) => {
  const deactivateLink = `${domain}/account/deactivate?token=${token}`;

  return (
    <Html>
      <Head />
      <Preview>Деактивация аккаунта</Preview>
      <Tailwind>
        <Body className='mx-auto max-w-2xl p-6 bg-slate-50'>
          <Section className='text-center mb-8'>
            <Heading className='text-3xl text-black font-bold'>
              Вы инициировали деактивацию вашего аккаунта
            </Heading>
            <Text className='text-base text-black'>
              Нажмите на кнопку ниже, чтобы деактивировать ваш аккаунт.
            </Text>
            <Link
              href={deactivateLink}
              className='inline-flex items-center justify-center rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white'
            >
              Деактивировать аккаунт
            </Link>
          </Section>

          <Section className='bg-gray-100 rounded-lg p-6 text-center mb-6'>
            <Heading className='text-2xl text-black font-bold'>
              Код подтверждения
            </Heading>
            <Heading className='text-2xl text-black font-bold'>{token}</Heading>
            <Text className='text-black'>
              Этот код действует в течение 5 минут.
            </Text>
          </Section>

          <Section className='bg-gray-100 rounded-xl p-6 mb-6'>
            <Heading className='text-xl font-semibold text-black mb-4'>
              Информация о запросе:
            </Heading>
            <ul className='list-disc list-inside mt-2 text-gray-700'>
              <li>
                🪐 Расположение: {metadata.location.city},{' '}
                {metadata.location.country}
              </li>
              <li>🌐 IP-адрес: {metadata.ip}</li>
              <li>🌐 Браузер: {metadata.device.browser}</li>
              <li>📱 Операционная система: {metadata.device.os}</li>
              <li>💻 Тип устройства: {metadata.device.type}</li>
            </ul>
            <Text className='text-gray-600 mt-4'>
              Если этот запрос на деактивацию аккаунта не был отправлен вами,
              пожалуйста, проигнорируйте его.
            </Text>
          </Section>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default DeactivateTemplate;
