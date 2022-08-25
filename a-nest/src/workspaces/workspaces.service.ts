import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Workspaces } from 'src/entities/Workspaces';
import { Repository, QueryRunner, DataSource } from 'typeorm';
import { Channels } from 'src/entities/Channels';
import { WorkspaceMembers } from 'src/entities/WorkspaceMembers';
import { ChannelMembers } from 'src/entities/ChannelMembers';
import { Users } from 'src/entities/Users';

@Injectable()
export class WorkspacesService {
  constructor(
    @InjectRepository(Workspaces)
    private workspaceRepository: Repository<Workspaces>,
    @InjectRepository(Channels)
    private channelRepository: Repository<Channels>,
    @InjectRepository(WorkspaceMembers)
    private workspaceMembersRepository: Repository<WorkspaceMembers>,
    @InjectRepository(ChannelMembers)
    private channelMembersRepository: Repository<ChannelMembers>,
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,

    private dataSource: DataSource,
  ) {}

  async findById(id: number) {
    return this.workspaceRepository.findOne({ where: { id } });
  }

  async findMyWorkspaces(myId: number) {
    return this.workspaceRepository.find({
      where: {
        WorkspaceMembers: [{ UserId: myId }],
      },
    });
  }
  async createWorkspace(name: string, url: string, myId: number) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();
    try {
      // 워크스페이스 만들기
      const workspace = await queryRunner.manager
        .getRepository(Workspaces)
        .save({
          name,
          url,
          OwnerId: myId,
        });
      // 멤버에 나 집어넣기
      const workspacemember = new WorkspaceMembers(); // class 생성
      workspacemember.UserId = myId; // 데이터 집어넣기
      workspacemember.WorkspaceId = workspace.id;
      //채널 생성
      const channel = new Channels();
      channel.name = '일반';
      channel.WorkspaceId = workspace.id;
      // 멤버 추가 , 채널 생성 쿼리 한번에 하기
      const [, channelReturned] = await Promise.all([
        queryRunner.manager
          .getRepository(WorkspaceMembers)
          .save(workspacemember),
        queryRunner.manager.getRepository(Channels).save(channel),
      ]);
      // 채널멤버에 나 추가
      await queryRunner.manager.getRepository(ChannelMembers).save({
        UserId: myId,
        ChannelId: channelReturned.id,
      });
    } catch (error) {
      console.log(error);
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  // 워크스페이스 멤버 초대 (트랜잭션 처리 아직안함)
  async createWorkspaceMembers(url: string, email: string) {
    // url 로 워크스페이스 정보 가져오기
    const workspace = await this.workspaceRepository.findOne({
      where: { url },
      // relations : ['Channels'], 이거도 된다
      join: {
        alias: 'workspace',
        innerJoinAndSelect: {
          channels: 'workspace.Channels',
        },
      },
    });
    // 이메일로 초대할 유저 정보 가져오기
    const user = await this.usersRepository.findOne({ where: { email } });
    if (!user) {
      return null;
    }
    const workspaceMember = new WorkspaceMembers();
    workspaceMember.WorkspaceId = workspace.id;
    workspaceMember.UserId = user.id;
    // 워크스페이스에 초대
    await this.workspaceMembersRepository.save(workspaceMember);
    const channelMember = new ChannelMembers();
    // 일반 채널에 자동참가
    channelMember.ChannelId = workspace.Channels.find(
      (v) => v.name === '일반',
    ).id;
    channelMember.UserId = user.id;
    await this.channelMembersRepository.save(channelMember);
  }
  // 워크스페이스에 있는 멤버들 가져오기
  async getWorkspaceMembers(url: string) {
    return await this.usersRepository
      .createQueryBuilder('user')
      .innerJoin('user.WorkspaceMembers', 'members')
      .innerJoin('members.Workspace', 'workspace', 'workspace.url = :url', {
        url,
      })
      .getMany();
  }
  // 이건 왜있는거임? 한명인가
  async getWorkspaceMember(url: string, id: number) {
    return this.usersRepository
      .createQueryBuilder('user')
      .where('user.id = :id', { id })
      .innerJoinAndSelect(
        'user.Workspaces',
        'workspaces',
        'workspaces.url = :url',
        {
          url,
        },
      )
      .getOne();
  }
}
