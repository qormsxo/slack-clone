import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ApiOperation } from '@nestjs/swagger';
import multer from 'multer';
import { User } from 'src/common/decorators/user.decorator';
import { Users } from 'src/entities/Users';
import { ChannelsService } from './channels.service';
import { CreateChannelDto } from './dto/create-channel.dto';
import { PostChatDto } from './dto/post-chat.dto';
import path from 'path';
import * as fs from 'fs';

try {
  fs.readdirSync('uploads');
} catch (error) {
  console.error('uploads 폴더가 없어서 생성');
  fs.mkdirSync('uploads');
}

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

  @ApiOperation({ summary: '채팅 전송' })
  @Post(':name/chats')
  postChat(
    @Param('url') url,
    @Param('name') name,
    @Body() body: PostChatDto,
    @User() user: Users,
  ) {
    return this.channelsService.postChat(url, name, body.content, user.id);
  }

  @ApiOperation({ summary: '이미지 전송' })
  @UseInterceptors(
    FilesInterceptor('image', 10, {
      // multer 설정
      storage: multer.diskStorage({
        destination(req, file, cb) {
          cb(null, 'uploads/');
        },
        filename(req, file, cb) {
          const ext = path.extname(file.originalname);
          cb(null, path.basename(file.originalname, ext) + Date.now() + ext);
        },
      }),
      limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    }),
  )
  @Post(':name/images')
  postImage(
    @UploadedFiles() files: Express.Multer.File[],
    @Param('url') url: string,
    @Param('name') name: string,
    @User() user: Users,
  ) {
    return this.channelsService.createWorkspaceChannelImages(
      url,
      name,
      files,
      user.id,
    );
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
