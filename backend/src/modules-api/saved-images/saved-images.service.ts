import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../modules-system/prisma/prisma.service';
import { SaveImageDto } from './dto/save-image.dto';

@Injectable()
export class SavedImagesService {
  constructor(private readonly prisma: PrismaService) {}

  async checkIfSaved(userId: number, imageId: number) {
    const saved = await this.prisma.luu_anh.findUnique({
      where: {
        nguoi_dung_id_hinh_id: {
          nguoi_dung_id: userId,
          hinh_id: imageId,
        },
      },
    });

    return !!saved;
  }

  async saveImage(userId: number, dto: SaveImageDto) {
    const image = await this.prisma.hinh_anh.findUnique({
      where: { hinh_id: dto.hinh_id },
    });

    if (!image) {
      throw new NotFoundException('Ảnh không tồn tại');
    }

    const existing = await this.prisma.luu_anh.findUnique({
      where: {
        nguoi_dung_id_hinh_id: {
          nguoi_dung_id: userId,
          hinh_id: dto.hinh_id,
        },
      },
    });

    if (existing) {
      return { saved: true, message: 'Ảnh đã được lưu trước đó' };
    }

    const saved = await this.prisma.luu_anh.create({
      data: {
        nguoi_dung_id: userId,
        hinh_id: dto.hinh_id,
        ngay_luu: new Date(),
      },
    });

    return { saved: true, hinh_id: saved.hinh_id };
  }

  async unsaveImage(userId: number, imageId: number) {
    const image = await this.prisma.hinh_anh.findUnique({
      where: { hinh_id: imageId },
    });

    if (!image) {
      throw new NotFoundException('Ảnh không tồn tại');
    }

    const existing = await this.prisma.luu_anh.findUnique({
      where: {
        nguoi_dung_id_hinh_id: {
          nguoi_dung_id: userId,
          hinh_id: imageId,
        },
      },
    });

    if (!existing) {
      throw new NotFoundException('Bạn chưa lưu ảnh này');
    }

    await this.prisma.luu_anh.delete({
      where: {
        nguoi_dung_id_hinh_id: {
          nguoi_dung_id: userId,
          hinh_id: imageId,
        },
      },
    });

    return { hinh_id: imageId };
  }
}
