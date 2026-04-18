import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../modules-system/prisma/prisma.service';
import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class CommentsService {
  constructor(private readonly prisma: PrismaService) {}

  async getCommentsByImageId(imageId: number) {
    const image = await this.prisma.hinh_anh.findUnique({
      where: { hinh_id: imageId },
    });

    if (!image) {
      throw new NotFoundException('Ảnh không tồn tại');
    }

    const comments = await this.prisma.binh_luan.findMany({
      where: { hinh_id: imageId },
      include: {
        nguoi_dung: {
          select: {
            nguoi_dung_id: true,
            ho_ten: true,
            anh_dai_dien: true,
          },
        },
      },
      orderBy: { ngay_binh_luan: 'desc' },
    });

    return comments;
  }

  async createComment(
    userId: number,
    imageId: number,
    dto: CreateCommentDto,
  ) {
    const image = await this.prisma.hinh_anh.findUnique({
      where: { hinh_id: imageId },
    });

    if (!image) {
      throw new NotFoundException('Ảnh không tồn tại');
    }

    const comment = await this.prisma.binh_luan.create({
      data: {
        noi_dung: dto.noi_dung,
        nguoi_dung_id: userId,
        hinh_id: imageId,
        ngay_binh_luan: new Date(),
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

    return comment;
  }
}
