import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';

@Controller('api/workspace/:url/channels')
export class ChannelsController {
    @Get()
    getAllChannels(@Query() query , @Param() param) {
     
    }

    @Post()
    createChannels(){

    }

    @Get(':name')
    getSpecificChannel(){

    }

    @Post()
    postchannel(){

    }

    @Get(':name/chats')
    getChat(@Query() query , @Param() param) {
        console.log(query)
        console.log(param)
    }

    @Post(":name/chats")
    postChat(@Body() body){
    }

    @Get(":name/members")
    getAllMembers(){

    }

    @Get(":name/members")
    inviteMembers(){

    }
}
