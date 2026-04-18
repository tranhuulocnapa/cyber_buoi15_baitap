import { Module } from '@nestjs/common';
import { ImagesService } from './images.service';
import { ImagesController } from './images.controller';
import { PrismaModule } from '../../modules-system/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ImagesController],
  providers: [ImagesService],
})
export class ImagesModule {}
