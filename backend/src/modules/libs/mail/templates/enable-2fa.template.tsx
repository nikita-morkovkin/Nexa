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

interface EnableTwoFactorProps {
  domain: string;
}

const EnableTwoFactorTemplate = ({ domain }: EnableTwoFactorProps) => {
  return (
    <Html>
      <Head />
      <Preview>Включение двухфакторной аутентификации</Preview>
      <Tailwind>
        <Body className='mx-auto max-w-2xl p-6 bg-slate-50'>
          <Section className='text-center mb-8'>
            <Heading className='text-3xl text-black font-bold'>
              Вы инициировали включение двухфакторной аутентификации
            </Heading>
            <Text className='text-base text-black'>
              Нажмите на кнопку ниже, чтобы включить 2FA в вашем аккаунте.
            </Text>
            <Link
              href={domain}
              className='inline-flex items-center justify-center rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white'
            >
              Включить 2FA
            </Link>
          </Section>

          <Section className='bg-gray-100 rounded-xl p-6 mb-6'>
            <Text className='text-gray-600 mt-4'>
              Если этот запрос на включение 2FA не был отправлен вами,
              пожалуйста, проигнорируйте его.
            </Text>
          </Section>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default EnableTwoFactorTemplate;
