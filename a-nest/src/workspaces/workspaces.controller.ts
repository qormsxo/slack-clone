import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { WorkspacesService } from './workspaces.service';
import { User } from '../common/decorators/user.decorator';
import { Users } from 'src/entities/Users';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';

@ApiTags('WORKSPACE')
@Controller('/api/workspaces')
export class WorkspacesController {
  constructor(private workspacesService: WorkspacesService) {}

  // 내 workspaces
  @Get()
  getMyWorkspaces(@User() user: Users) {
    return this.workspacesService.findMyWorkspaces(user.id);
  }
  // @Post()
  // test(@Body() body: CreateWorkspaceDto) {
  //   console.log('???????????????');
  //   console.log(body);
  //   return body;
  // }

  @ApiOperation({ summary: '워크스페이스 만들기' })
  @Post()
  createWorkspace(@User() user: Users, @Body() body: CreateWorkspaceDto) {
    console.log(body.name, body.url, user.id);
    return this.workspacesService.createWorkspace(body.name, body.url, user.id);
  }

  @ApiOperation({ summary: '워크스페이스 멤버 가져오기' })
  @Get(':url/members')
  getWorkspaceMembers(@Param('url') url: string) {
    return this.workspacesService.getWorkspaceMembers(url);
  }

  @ApiOperation({ summary: '워크스페이스 멤버 초대하기' })
  @Post(':url/members')
  inviteMembersToWorkspace(@Param('url') url: string, @Body('email') email) {
    return this.workspacesService.createWorkspaceMembers(url, email);
  }

  @ApiOperation({ summary: '워크스페이스 멤버 삭제' })
  @Delete(':url/members/:id')
  kickMemberFromWorkspace() {}

  @ApiOperation({ summary: '워크스페이스 특정멤버 가져오기' })
  @Get(':url/members/:id')
  getMemberInfoInWorkspaace(
    @Param('url') url: string,
    @Param('id') id: number,
  ) {
    return this.workspacesService.getWorkspaceMember(url, id);
  }

  @ApiOperation({ summary: '워크스페이스 특정멤버 가져오기' })
  @Get(':url/users/:id')
  async DEPRECATED_getWorkspaceUser(
    @Param('url') url: string,
    @Param('id') id: number,
  ) {
    return this.workspacesService.getWorkspaceMember(url, id);
  }
}
