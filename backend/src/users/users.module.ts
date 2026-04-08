import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';

@Module({
  imports: [MulterModule.register()],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
