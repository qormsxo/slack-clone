import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { Users } from '../entities/Users';
import { WorkspaceMembers } from '../entities/WorkspaceMembers';
import { ChannelMembers } from '../entities/ChannelMembers';
import { DataSource } from 'typeorm';

class MockUserRepository {
  #data = [
    {
      id: 1,
      email: 'test1@gmail.com',
    },
  ];
  findOne(where: { email: string }) {
    const data = this.#data.find((v) => v.email === where.email);
    if (data) {
      return data;
    }
    return null;
  }
}
class MockWorkspaceMeberRepository {}
class MockChannelMebersRepository {}

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forFeature([Users, WorkspaceMembers, ChannelMembers]),
        TypeOrmModule.forRootAsync({
          useFactory: () => ({
            type: 'mariadb',
            username: 'root',
            password: 'root',
            database: 'sleact',
            synchronize: false,
            logging: true,
          }),
        }),
      ],
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(Users),
          useClass: MockUserRepository,
        },
        {
          provide: getRepositoryToken(WorkspaceMembers),
          useClass: MockWorkspaceMeberRepository,
        },
        {
          provide: getRepositoryToken(ChannelMembers),
          useClass: MockChannelMebersRepository,
        },
        {
          provide: DataSource,
          useClass: class MockDataSource {},
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findbyEmail은 이메일로 유저를 찾아야 함', () => {
    expect(service.findByEmail('test1@gmail.com')).resolves.toStrictEqual({
      email: 'test1@gmail.com',
      id: 1,
    });
  });

  it('findByEmail은 유저를 못찾으면 null 반환해야함', () => {
    expect(service.findByEmail('test@gmail.com')).resolves.toBe(null);
  });
});
