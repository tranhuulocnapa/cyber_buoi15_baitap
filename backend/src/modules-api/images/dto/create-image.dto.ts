import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateImageDto {
  @IsString()
  @IsNotEmpty()
  ten_hinh!: string;

  @IsOptional()
  @IsString()
  mo_ta?: string;
}
