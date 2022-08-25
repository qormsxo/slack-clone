import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { User } from 'src/common/decorators/user.decorator';
import { Users } from 'src/entities/Users';
import { ChannelsService } from './channels.service';
import { CreateChannelDto } from './dto/create-channel.dto';
import { PostChatDto } from './dto/post-chat.dto';

@Controller('api/workspaces/:url/channels')
export class ChannelsController {
  constructor(private channelsService: ChannelsService) {}
  @Get()
  getAllChannels(@Param('url') url: string, @User() user) {
    return this.channelsService.getWorkspaceChannels(url, user.id);
  }

  @Post()
  createChannels() {}

  @Get(':name')
  getWorkspaceChannel(@Param('url') url, @Param('name') name) {
    return this.channelsService.getWorkspaceChannel(url, name);
  }

  @Post()
  postchannel(
    @Param('url') url,
    @Body() body: CreateChannelDto,
    @User() user: Users,
  ) {
    return this.channelsService.createWorkspaceChannels(
      url,
      body.name,
      user.id,
    );
  }

  @Get(':name/chats')
  getChat(
    @Param('url') url: string,
    @Param('name') name: string,
    @Query() query,
  ) {
    console.log(url, name, query.perPage, query.page);
    return this.channelsService.getWorkspaceChannelChats(
      url,
      name,
      query.perPage,
      query.page,
    );
  }

  @Post(':name/chats')
  postChat(
    @Param('url') url,
    @Param('name') name,
    @Body() body: PostChatDto,
    @User() user: Users,
  ) {
    return this.channelsService.postChat(url, name, body.content, user.id);
  }
  @Post(':name/images')
  postImage(@Body() body) {
    // return this.channelsService
  }

  @ApiOperation({ summary: '안 읽은 개수 가져오기' })
  @Get(':name/unreads')
  async getUnreads(
    @Param('url') url,
    @Param('name') name,
    @Query('after') after: number,
  ) {
    return this.channelsService.getChannelUnreadsCount(url, name, after);
  }

  @Get(':name/members')
  getAllMembers(@Param('url') url: string, @Param('name') name: string) {
    return this.channelsService.getWorkspaceChannelMembers(url, name);
  }

  @Get(':name/members')
  inviteMembers() {}
}
