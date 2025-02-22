import { Module } from '@nestjs/common';
import { AssetsService } from './resource.service';
import { AssetsController } from './resource.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Resource } from './resource.entity';
import { User } from 'src/user/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Resource, User])],
  providers: [AssetsService],
  exports: [AssetsService],
  controllers: [AssetsController],
})
export class AssetsModule {}
