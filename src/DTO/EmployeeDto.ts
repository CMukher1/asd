import {
    IsInt,
    IsNotEmpty,
    IsString,
    MaxLength,
    IsUUID,
    IsDateString,
  } from "class-validator";
  
  class CreateEmployeeDto {
  
    @IsNotEmpty()
    @IsDateString()
    dateOfBirth!: Date;
  
    @IsNotEmpty()
    @IsString()
    @MaxLength(4)
    gender!: string;

    @IsNotEmpty()
    @IsString()
    @MaxLength(36)
    jobTitle!: string;
    
    @IsNotEmpty()
    @IsString()
    @MaxLength(36)
    department!: string;
  
    @IsNotEmpty()
    @IsInt()
    salary!: number;
  
    @IsNotEmpty()
    @IsDateString()
    startDate!: Date;
  
    @IsNotEmpty()
    @IsUUID()
    manager!: string;
  
    @IsNotEmpty()
    @IsUUID()
    peopleManager!: string;

    @IsNotEmpty()
    @IsUUID()
    user!: string;

  }
  
  export { CreateEmployeeDto };
  