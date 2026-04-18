import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../modules-system/prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async getCurrentUser(userId: number) {
    const user = await this.prisma.nguoi_dung.findUnique({
      where: { nguoi_dung_id: userId },
      select: {
        nguoi_dung_id: true,
        email: true,
        ho_ten: true,
        tuoi: true,
        anh_dai_dien: true,
      },
    });

    if (!user) {
      throw new NotFoundException('Người dùng không tồn tại');
    }

    return user;
  }

  async updateProfile(userId: number, dto: UpdateUserDto) {
    const user = await this.prisma.nguoi_dung.update({
      where: { nguoi_dung_id: userId },
      data: {
        ho_ten: dto.ho_ten,
        tuoi: dto.tuoi,
        anh_dai_dien: dto.anh_dai_dien,
      },
      select: {
        nguoi_dung_id: true,
        email: true,
        ho_ten: true,
        tuoi: true,
        anh_dai_dien: true,
      },
    });

    return user;
  }

  async getSavedImages(userId: number) {
    const savedImages = await this.prisma.luu_anh.findMany({
      where: { nguoi_dung_id: userId },
      include: {
        hinh_anh: {
          include: {
            nguoi_dung: {
              select: {
                nguoi_dung_id: true,
                ho_ten: true,
                anh_dai_dien: true,
              },
            },
          },
        },
      },
      orderBy: { ngay_luu: 'desc' },
    });

    return savedImages.map((item) => item.hinh_anh);
  }

  async getMyImages(userId: number) {
    const images = await this.prisma.hinh_anh.findMany({
      where: { nguoi_dung_id: userId },
      include: {
        nguoi_dung: {
          select: {
            nguoi_dung_id: true,
            ho_ten: true,
            anh_dai_dien: true,
          },
        },
      },
      orderBy: { hinh_id: 'desc' },
    });

    return images;
  }
}
