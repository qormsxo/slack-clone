import { Module } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { dataSource } from './dataSource';

@Module({})
export class DatabaseModule {
  constructor(private dataSource: DataSource) {
    this.dataSource
      .initialize()
      .then(() => {
        console.log('Data Source has been initialized!');
      })
      .catch((err) => {
        console.error('Error during Data Source initialization', err);
      });
  }
}
