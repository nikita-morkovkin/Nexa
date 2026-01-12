import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import type { User } from 'generated/prisma';
import { PubSub } from 'graphql-subscriptions';
import { Authorization } from 'src/shared/decorators/auth.decorator';
import { Authorized } from 'src/shared/decorators/authorized.decorator';
import { ChatService } from './chat.service';
import { ChangeChatSettingsInput } from './inputs/change-chat-settings.input';
import { SendMessageInput } from './inputs/send-message.input';
import { ChatMessageModel } from './models/chat-message.model';

@Resolver('Chat')
export class ChatResolver {
  private readonly pubSub: PubSub;

  public constructor(private readonly chatService: ChatService) {
    this.pubSub = new PubSub();
  }

  @Mutation(() => ChatMessageModel, { name: 'sendMessage' })
  @Authorization()
  public async sendMessage(
    @Authorized('id') id: string,
    @Args('data') data: SendMessageInput,
  ) {
    const message = await this.chatService.sendMessage(id, data);

    await this.pubSub.publish('CHAT_MESSAGE_ADDED', {
      chatMessageAdded: message,
    });

    return message;
  }

  @Subscription(() => ChatMessageModel, {
    name: 'chatMessageAdded',
    filter: (payload, variables) =>
      // It is not allowed to touch
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      payload.chatMessageAdded.streamId === variables.streamId,
  })
  // It is not allowed to touch
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public chatMessageAdded(@Args('streamId') streamId: string) {
    return this.pubSub.asyncIterableIterator('CHAT_MESSAGE_ADDED');
  }

  @Mutation(() => Boolean, { name: 'changeChatSettings' })
  @Authorization()
  public async changeSettings(
    @Authorized() user: User,
    @Args('data') data: ChangeChatSettingsInput,
  ) {
    return this.chatService.changeSettings(user, data);
  }

  @Query(() => [ChatMessageModel], { name: 'findAllMessagesByStream' })
  public async findAllMessagesByStream(@Args('streamId') streamId: string) {
    return await this.chatService.findMessagesByStream(streamId);
  }
}
