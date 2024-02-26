import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';

export default class CreateA3FeedbackDto {
  @IsOptional()
  @IsString()
  deviceID: string;

  @IsOptional()
  @IsString()
  customerName: string;

  @IsOptional()
  @IsString()
  customerEmail: string;

  @IsOptional()
  @IsString()
  feedbackText: string;

  @IsOptional()
  @IsString()
  feedbackReply: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  feedbackImages: string[];

  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  feedbackFiles: string[];

  @IsOptional()
  @IsNumber()
  rating: number;
}
