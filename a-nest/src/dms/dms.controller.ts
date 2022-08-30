import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import {
  ApiQuery,
  ApiParam,
  ApiTags,
  ApiCookieAuth,
  ApiOperation,
} from '@nestjs/swagger';
import * as fs from 'fs';
import { url } from 'inspector';
import multer from 'multer';
import { User } from 'src/common/decorators/user.decorator';
import { LoggedInGuard } from '../auth/logged-in.guard';
import { Users } from '../entities/Users';
import { DMsService } from './dms.service';
import path from 'path';

try {
  fs.readdirSync('uploads');
} catch (error) {
  console.error('uploads 폴더가 없어 uploads 폴더를 생성합니다.');
  fs.mkdirSync('uploads');
}

@ApiTags('DMs')
@ApiCookieAuth('connect.sid')
@UseGuards(LoggedInGuard)
@Controller('api/workspaces/:url/dms')
export class DmsController {
  constructor(private dmsService: DMsService) {}
  @ApiOperation({ summary: '워크스페이스 DM 모두 가져오기' })
  @Get()
  getWorkspaceChannels(@Param('url') url, @User() user: Users) {
    return this.dmsService.getWorkspaceDMs(url, user.id);
  }

  @ApiOperation({ summary: '워크스페이스 특정 DM 채팅 모두 가져오기' })
  @Get(':id/chats')
  async getWorkspaceDMChats(
    @Param('url') url,
    @Param('id') id: number,
    @Query('perPage') perPage: number,
    @Query('page') page: number,
    @User() user: Users,
  ) {
    return this.dmsService.getWorkspaceDMChats(url, id, user.id, perPage, page);
  }

  @ApiOperation({ summary: '워크스페이스 특정 DM 채팅보내기' })
  @Post(':id/chats')
  async createWorkspaceDMChats(
    @Param('url') url,
    @Param('id') id: number,
    @Body('content') content,
    @User() user: Users,
  ) {
    return this.dmsService.createWorkspaceDMChats(url, content, id, user.id);
  }

  @ApiOperation({ summary: '워크스페이스 특정 DM 이미지 업로드하기' })
  @UseInterceptors(
    FilesInterceptor('image', 10, {
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
  @Post(':id/images')
  async createWorkspaceDMImages(
    @Param('url') url,
    @Param('id') id: number,
    @UploadedFiles() files: Express.Multer.File[],
    @User() user: Users,
  ) {
    return this.dmsService.createWorkspaceDMImages(url, files, id, user.id);
  }

  @ApiOperation({ summary: '안 읽은 개수 가져오기' })
  @Get(':id/unreads')
  async getUnreads(
    @Param('url') url,
    @Param('id') id: number,
    @Query('after') after: number,
    @User() user: Users,
  ) {
    return this.dmsService.getDMUnreadsCount(url, id, user.id, after);
  }

  //   @Get(':id/chats')
  //   getChat(@Query() query, @Param() param) {
  //     console.log(query.perPage, query.page);
  //     console.log(param.id, param.url);
  //   }
  //   @Post(':id/chats')
  //   postChat(@Body() body) {}
}
