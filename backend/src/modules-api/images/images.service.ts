import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../modules-system/prisma/prisma.service';
import { CreateImageDto } from './dto/create-image.dto';
import type { Multer } from 'multer';

@Injectable()
export class ImagesService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllImages(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const [images, total] = await Promise.all([
      this.prisma.hinh_anh.findMany({
        include: {
          nguoi_dung: {
            select: {
              nguoi_dung_id: true,
              ho_ten: true,
              anh_dai_dien: true,
            },
          },
        },
        skip,
        take: limit,
        orderBy: { hinh_id: 'desc' },
      }),
      this.prisma.hinh_anh.count(),
    ]);

    return {
      items: images,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async searchImages(name: string, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const [images, total] = await Promise.all([
      this.prisma.hinh_anh.findMany({
        where: {
          ten_hinh: {
            contains: name,
          },
        },
        include: {
          nguoi_dung: {
            select: {
              nguoi_dung_id: true,
              ho_ten: true,
              anh_dai_dien: true,
            },
          },
        },
        skip,
        take: limit,
        orderBy: { hinh_id: 'desc' },
      }),
      this.prisma.hinh_anh.count({
        where: {
          ten_hinh: {
            contains: name,
          },
        },
      }),
    ]);

    return {
      items: images,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getImageDetail(imageId: number) {
    const image = await this.prisma.hinh_anh.findUnique({
      where: { hinh_id: imageId },
      include: {
        nguoi_dung: {
          select: {
            nguoi_dung_id: true,
            email: true,
            ho_ten: true,
            anh_dai_dien: true,
          },
        },
      },
    });

    if (!image) {
      throw new NotFoundException('Ảnh không tồn tại');
    }

    return image;
  }

  async createImage(userId: number, dto: CreateImageDto, file: Multer.File) {
    const duong_dan = `/uploads/${file.filename}`;

    const image = await this.prisma.hinh_anh.create({
      data: {
        ten_hinh: dto.ten_hinh,
        duong_dan,
        mo_ta: dto.mo_ta,
        nguoi_dung_id: userId,
      },
      include: {
        nguoi_dung: {
          select: {
            nguoi_dung_id: true,
            ho_ten: true,
            anh_dai_dien: true,
          },
        },
      },
    });

    return image;
  }

  async deleteImage(imageId: number, userId: number) {
    const image = await this.prisma.hinh_anh.findUnique({
      where: { hinh_id: imageId },
      select: { nguoi_dung_id: true },
    });

    if (!image) {
      throw new NotFoundException('Ảnh không tồn tại');
    }

    if (image.nguoi_dung_id !== userId) {
      throw new ForbiddenException('Bạn không có quyền xóa ảnh này');
    }

    await this.prisma.hinh_anh.delete({
      where: { hinh_id: imageId },
    });

    return { hinh_id: imageId };
  }
}
