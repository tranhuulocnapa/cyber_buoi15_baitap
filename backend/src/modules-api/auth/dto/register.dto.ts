import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
  MinLength,
} from 'class-validator';

export class RegisterDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(6)
  password!: string;

  @IsString()
  @IsNotEmpty()
  ho_ten!: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  tuoi?: number;

  @IsOptional()
  @IsString()
  anh_dai_dien?: string;
}
