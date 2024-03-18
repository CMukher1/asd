import {
  IsInt,
  IsNotEmpty,
  IsString,
  MaxLength,
  IsEmail,
  IsPhoneNumber,
  IsIn,
  IsOptional,
  IsUUID,
} from "class-validator";

class CreateUserDto {

  @IsNotEmpty()
  @IsString()
  @MaxLength(20)
  password!: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(20)
  firstname!: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(20)
  lastname!: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  country!: string;

  @IsOptional()
  @IsString()
  @MaxLength(3)
  langu!: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(30)
  @IsEmail()
  email_id!: string;

  @IsOptional()
  @IsString()
  @IsPhoneNumber(undefined, { message: "Invalid phone number" })
  contact_no!: string;

  @IsOptional()
  @IsString()
  @MaxLength(1)
  @IsIn(["A", "I"]) // Assuming 'A' for active and 'I' for inactive
  status!: string;
}

export { CreateUserDto };
