import { Module } from '@nestjs/common';
import { DMsService } from './dms.service';
import { DmsController } from './dms.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Workspaces } from 'src/entities/Workspaces';
import { DMs } from 'src/entities/DMs';
import { Users } from 'src/entities/Users';
import { EventsModule } from 'src/events/events.module';

@Module({
  imports: [TypeOrmModule.forFeature([Workspaces, DMs, Users]), EventsModule],
  providers: [DMsService],
  controllers: [DmsController],
})
export class DmsModule {}
