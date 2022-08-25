import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from '../entities/Users';
import bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Users) private usersRepository: Repository<Users>,
  ) {}

  async validateUser(email: string, password: string) {
    // 유저 가져오기
    const user = await this.usersRepository.findOne({
      where: { email },
      select: ['id', 'email', 'password'],
    });
    console.log(email, password, user);
    // 유저 없으면 return null
    if (!user) {
      return null;
    }
    // 비밀번호 맞는지 확인
    const result = await bcrypt.compare(password, user.password);
    // 비밀번호 맞으면 로그인
    if (result) {
      // 구조분해 할당 문법 (비밀번호만 빼고 나머지)
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    }
    return null;
  }
}
