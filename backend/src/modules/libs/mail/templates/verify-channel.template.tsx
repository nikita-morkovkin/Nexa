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

interface VerifyAccountProps {
  domain: string;
}

const VerifyChannelTemplate = ({ domain }: VerifyAccountProps) => {
  return (
    <Html>
      <Head />
      <Preview>Подтверждение аккаунта</Preview>
      <Tailwind>
        <Body className='mx-auto max-w-2xl p-6 bg-slate-50'>
          <Section className='text-center mb-8'>
            <Heading className='text-3xl text-black font-bold'>
              Подтвердите ваш аккаунт
            </Heading>
            <Text className='text-base text-black'>
              Нажмите на кнопку ниже, чтобы подтвердить вашу электронную почту и
              активировать аккаунт.
            </Text>
            <Link
              href={domain}
              className='inline-flex items-center justify-center rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white'
            >
              Подтвердить аккаунт
            </Link>
          </Section>

          <Section className='bg-gray-100 rounded-xl p-6 mb-6'>
            <Text className='text-gray-600 mt-4'>
              Если вы не регистрировались на нашем сервисе, пожалуйста,
              проигнорируйте это письмо.
            </Text>
          </Section>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default VerifyChannelTemplate;
