import { userRepository, employeeRepository } from '@/Database/Repository';
import { EmployeeEntity } from '@/Database/entities/EmployeeEntity.entitie';
import express, { Request, Response, NextFunction } from 'express';
import { plainToClass } from 'class-transformer';
import { CreateEmployeeDto } from '@/DTO/EmployeeDto';
import { validate } from 'class-validator';
import { In } from 'typeorm';
import {
  DynamicUserInterface,
  getUserDetails,
} from '@/Database/services/UserService';
import { getEmployeeDetails } from '@/Database/services/EmployeeService';

const router = express.Router();

router.get(
  '/getEmployeeDetails',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.user as DynamicUserInterface;

      const data = await getEmployeeDetails(id);

      return res.status(200).json({
        status: 'Success',
        data,
      });
    } catch (err: unknown) {
        if (err instanceof Error) {
          console.log(err.message);
          return res.status(500).send({ message: err.message });
        } else {
          console.log('An unexpected error occurred');
          return res
            .status(500)
            .send({ message: 'An unexpected error occurred' });
        }
      }
  }
);

router.post(
  '/insertEmployee',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { body } = req;
      const { id } = req.user as DynamicUserInterface;
      const createEmployeeDto = plainToClass(CreateEmployeeDto, body);
      const errors = await validate(createEmployeeDto);

      if (errors.length > 0) {
        const errorMessage = errors.map((error) => ({
          property: error.property,
          message: Object.values(error.constraints!),
        }));
        return res.status(400).send({
          errors: errorMessage,
        });
      }

      const {
        dateOfBirth,
        gender,
        jobTitle,
        department,
        salary,
        startDate,
        manager,
        peopleManager,
        user,
      } = createEmployeeDto;

      const userDetails = await userRepository.findOne({ where: { id: user } });

      if (!userDetails) {
        return res.status(404).json({
          message: 'User not found',
        });
      }
      const newEmployee = new EmployeeEntity();

      // Set values for the properties
      newEmployee.dateOfBirth = dateOfBirth;
      newEmployee.gender = gender;
      newEmployee.jobTitle = jobTitle;
      newEmployee.department = department;
      newEmployee.salary = salary;
      newEmployee.startDate = startDate;
      newEmployee.manager = manager;
      newEmployee.peopleManager = peopleManager;
      newEmployee.user = userDetails;
      newEmployee.created_by = id;
      newEmployee.updated_by = id;

      const createdEmployee = await employeeRepository.save(newEmployee);

      return res.status(200).json({
        status: 'Success',
        message: 'Employee created successfully',
        data: createdEmployee,
      });
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.log(err.message);
        return res.status(500).send({ message: err.message });
      } else {
        console.log('An unexpected error occurred');
        return res
          .status(500)
          .send({ message: 'An unexpected error occurred' });
      }
    }
  }
);

export default router;
