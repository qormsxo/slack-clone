import { Seeder, Factory } from 'typeorm-seeding';
import { DataSource } from 'typeorm';
import { Channels } from '../../entities/Channels';
import { Workspaces } from '../../entities/Workspaces';

export class CreateInitialData implements Seeder {
  public async run(factory: Factory, connecton: DataSource): Promise<any> {
    await connecton
      .createQueryBuilder()
      .insert()
      .into(Workspaces)
      .values([{ id: 1, name: 'Sleact', url: 'sleact' }])
      .execute();
    await connecton
      .createQueryBuilder()
      .insert()
      .into(Channels)
      .values([{ id: 1, name: '일반', WorkspaceId: 1, private: false }])
      .execute();
  }
}
