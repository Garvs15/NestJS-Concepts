import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class CreatePostDto {
    @IsNotEmpty({ message: 'Title is required!' })
    @IsString({ message: 'Title must be string!' })
    @MinLength(3, { message: 'Title must be at least of the 3 Charcters long!' })
    @MaxLength(50, { message: 'Title cannot be longer than 50 characters!' })
    title!: string;

    @IsNotEmpty({ message: 'Content is required!' })
    @IsString({ message: 'Content must be string' })
    @MinLength(5, { message: 'Title cannot be longer than 0 characters' })
    content!: string;

    // @IsNotEmpty({ message: 'Author is required!' })
    // @IsString({ message: 'Author must be string' })
    // @MinLength(5, { message: 'Author must be at least 2 characters long' })
    // @MaxLength(25, { message: 'Author cannot be longer than 50 charcaters long' })
    // authorName!: string;
}