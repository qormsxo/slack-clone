import { Body, Controller, Get, Post, Req, Res ,UseInterceptors,} from '@nestjs/common';
import { JoinRequestDto } from './dto/join.request.dto';
import { UsersService } from './users.service';

import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UndefinedToNullInterceptor } from 'src/common/interceptors/undefinedToNull.interceptor';
import { UserDto } from 'src/common/dto/user.dto';
import { User } from 'src/common/decorators/user.decorator';

@UseInterceptors(UndefinedToNullInterceptor)
@ApiTags('USER')
@Controller('api/users')
export class UsersController {

    constructor(private usersService : UsersService){

    }

    @ApiResponse({
        type: UserDto,
        status: 200,
        description: '성공',
    })
    @ApiOperation({summary:"내정보"})
    @Get()
    getUsers(@User() user) {
        return user
        //res.locals.jwt
    }

    @ApiOperation({summary:"회원가입"})
    @Post()
    postUsers(@Body() data : JoinRequestDto) {
        this.usersService.postUsers(data.email,data.nickname,data.password)
    }

    @ApiResponse({
        type: UserDto,
        status: 200,
        description: '성공',
    })
    @ApiResponse({
        status: 500,
        description: '서버 에러',
    })
    @ApiOperation({summary:"로그인"})
    @Post('/login')
    logIn(@User() user){
        return user;
    }

    @ApiOperation({summary:"로그아웃"})
    @Post('/logout')
    logOut(@Req() req , @Res() res){
        req.logOut();
        res.clearCookie('connect.sid', { httpOnly: true });
        res.send('ok');
    }
}
