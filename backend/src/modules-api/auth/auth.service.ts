import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../modules-system/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.prisma.nguoi_dung.findUnique({
      where: { email: dto.email },
    });

    if (existing) {
      throw new ConflictException('Email đã tồn tại');
    }

    const hashedPassword = await this.hashPassword(dto.password);

    const user = await this.prisma.nguoi_dung.create({
      data: {
        email: dto.email,
        mat_khau: hashedPassword,
        ho_ten: dto.ho_ten,
        tuoi: dto.tuoi ?? null,
        anh_dai_dien: dto.anh_dai_dien ?? null,
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

  async login(dto: LoginDto) {
    const user = await this.prisma.nguoi_dung.findUnique({
      where: { email: dto.email },
    });

    if (!user || !(await this.verifyPassword(dto.password, user.mat_khau))) {
      throw new UnauthorizedException('Email hoặc mật khẩu không đúng');
    }

    const payload = { sub: user.nguoi_dung_id, email: user.email };

    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  private async hashPassword(password: string) {
    return bcrypt.hash(password, 10);
  }

  private async verifyPassword(password: string, hash: string) {
    return bcrypt.compare(password, hash);
  }
}
