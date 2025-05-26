import { IsString, IsNotEmpty, Length } from 'class-validator';

export class CreateNoteDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;
}
