import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ImagesService } from './images.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { CreateImageDto } from './dto/create-image.dto';

@Controller('images')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  @Get()
  async getAllImages(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ) {
    const data = await this.imagesService.getAllImages(
      Number(page),
      Number(limit),
    );
    return {
      status: true,
      message: 'Lấy danh sách ảnh thành công',
      data,
    };
  }

  @Get('search')
  async searchImages(
    @Query('name') name: string,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ) {
    const data = await this.imagesService.searchImages(
      name,
      Number(page),
      Number(limit),
    );
    return {
      status: true,
      message: 'Tìm kiếm ảnh thành công',
      data,
    };
  }

  @Get(':id')
  async getImageDetail(@Param('id', ParseIntPipe) imageId: number) {
    const image = await this.imagesService.getImageDetail(imageId);
    return {
      status: true,
      message: 'Lấy chi tiết ảnh thành công',
      data: image,
    };
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async createImage(
    @CurrentUser('id') userId: number,
    @Body() dto: CreateImageDto,
  ) {
    const image = await this.imagesService.createImage(userId, dto);
    return {
      status: true,
      message: 'Tạo ảnh thành công',
      data: image,
    };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deleteImage(
    @Param('id', ParseIntPipe) imageId: number,
    @CurrentUser('id') userId: number,
  ) {
    const result = await this.imagesService.deleteImage(imageId, userId);
    return {
      status: true,
      message: 'Xóa ảnh thành công',
      data: result,
    };
  }
}
