import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { Workspaces } from '../../entities/Workspaces';

export class CreateWorkspaceDto extends PickType(Workspaces, ['name', 'url']) {}
