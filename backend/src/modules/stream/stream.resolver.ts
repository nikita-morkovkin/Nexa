import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import type { User } from 'generated/prisma/client';
import { type FileUpload, GraphQLUpload } from 'graphql-upload-ts';
import { Authorization } from 'src/shared/decorators/auth.decorator';
import { Authorized } from 'src/shared/decorators/authorized.decorator';
import { FileValidationPipe } from 'src/shared/pipes/file-validation.pipe';
import { ChangeStreamInfoInput } from './inputs/change-stream-info.input';
import { FiltersInput } from './inputs/filters.input';
import { GenerateStreamTokenInput } from './inputs/generate-stream-token.input';
import { GenerateTokenModel } from './models/generate-token.model';
import { StreamModel } from './models/stream.model';
import { StreamService } from './stream.service';

@Resolver('Stream')
export class StreamResolver {
  public constructor(private readonly streamService: StreamService) {}

  @Query(() => [StreamModel], { name: 'findAllStreams' })
  public async findAllStreams(
    @Args('filters', { nullable: true }) input: FiltersInput,
  ) {
    return this.streamService.findAll(input);
  }

  @Query(() => [StreamModel], { name: 'getRandomFourStreams' })
  public async getRandomFourStreams() {
    return this.streamService.findRandomStreams();
  }

  @Mutation(() => Boolean, { name: 'changeStreamInfo' })
  @Authorization()
  public async changeStreamInfo(
    @Authorized() user: User,
    @Args('data') data: ChangeStreamInfoInput,
  ) {
    return this.streamService.changeStreamInfo(user, data);
  }

  @Mutation(() => Boolean, { name: 'updateStreamThumbnail' })
  @Authorization()
  public async updateStreamThumbnail(
    @Authorized() user: User,
    @Args('file', { type: () => GraphQLUpload }, FileValidationPipe)
    file: FileUpload,
  ) {
    return await this.streamService.changeThumbnail(user, file);
  }

  @Mutation(() => Boolean, { name: 'removeStreamThumbnail' })
  @Authorization()
  public async removeStreamThumbnail(@Authorized() user: User) {
    return await this.streamService.removeThumbnail(user);
  }

  @Mutation(() => GenerateTokenModel, { name: 'generateStreamToken' })
  public async generateToken(
    @Args('data', { type: () => GenerateStreamTokenInput })
    data: GenerateStreamTokenInput,
  ) {
    return this.streamService.generateToken(data);
  }
}
