import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateImageDto {
  @IsString()
  @IsNotEmpty()
  ten_hinh!: string;

  @IsString()
  @IsNotEmpty()
  duong_dan!: string;

  @IsOptional()
  @IsString()
  mo_ta?: string;
}
