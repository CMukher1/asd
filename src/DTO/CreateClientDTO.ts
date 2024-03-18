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
  MinLength,
  IsISO31661Alpha2,
} from "class-validator";

class CreateClientDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(20)
  client_name!: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  client_description!: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(3)
  @MinLength(2)
  @IsISO31661Alpha2()
  countryCode!: string;
}

export { CreateClientDto };
