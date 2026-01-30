import { Button } from '@/components/ui/common/Button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
} from '@/components/ui/common/Form';
import { Textarea } from '@/components/ui/common/Textarea';
import EmojiPicker from '@/components/ui/elements/EmojiPicker';
import {
  SendChatMessageDocument,
  type FindChannelByUsernameQuery,
} from '@/graphql/gql/graphql';
import {
  sendMessageSchema,
  type TypeSendMessageSchema,
} from '@/schemas/chat/send-message.schema';
import { useMutation } from '@apollo/client/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { SendHorizonal } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

interface SendMessageFormProps {
  channel: FindChannelByUsernameQuery['findChannelByUsername'];
  isDisabled: boolean;
}

const SendMessageForm = ({ channel, isDisabled }: SendMessageFormProps) => {
  const t = useTranslations('stream.chat.sendMessage');

  const form = useForm<TypeSendMessageSchema>({
    resolver: zodResolver(sendMessageSchema),
    defaultValues: {
      text: '',
    },
  });

  const [sendMessage, { loading: isLoadingSendMessage }] = useMutation(
    SendChatMessageDocument,
    {
      onError() {
        toast.error(t('errorMessage'));
      },
    },
  );

  const { isValid } = form.formState;

  const handleSubmit = (data: TypeSendMessageSchema) => {
    sendMessage({
      variables: { data: { streamId: channel.stream.id, text: data.text } },
    });
    form.reset();
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className='flex mt-3 items-center gap-x-4'
      >
        <FormField
          control={form.control}
          name='text'
          render={({ field }) => (
            <FormItem className='w-full'>
              <FormControl>
                <div className='relative'>
                  <Textarea
                    rows={1}
                    onInput={event => {
                      event.currentTarget.style.height = 'auto';
                      event.currentTarget.style.height = `${event.currentTarget.scrollHeight}px`;
                    }}
                    onKeyDown={event => {
                      if (event.key === 'Enter' && !event.shiftKey) {
                        event.preventDefault();
                        form.handleSubmit(handleSubmit)();
                      }
                    }}
                    placeholder={t('placeholder')}
                    {...field}
                    className='min-h-[40px] resize-none pr-5'
                    disabled={isDisabled || isLoadingSendMessage}
                  />

                  <div className='absolute right-2 top-2 cursor-pointer'>
                    <EmojiPicker
                      onChange={(emoji: string) =>
                        field.onChange(`${field.value} ${emoji}`)
                      }
                      isDisabled={isDisabled || isLoadingSendMessage}
                    />
                  </div>
                </div>
              </FormControl>
            </FormItem>
          )}
        />
        <Button
          size={'icon'}
          type='submit'
          disabled={isDisabled || !isValid || isLoadingSendMessage}
        >
          <SendHorizonal className='size-5' />
        </Button>
      </form>
    </Form>
  );
};

export default SendMessageForm;
