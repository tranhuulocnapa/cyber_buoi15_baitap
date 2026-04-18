import { IsInt, IsNotEmpty } from 'class-validator';

export class SaveImageDto {
  @IsInt()
  @IsNotEmpty()
  hinh_id!: number;
}
