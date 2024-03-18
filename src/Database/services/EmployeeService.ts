import { employeeRepository } from '../Repository';

export const getEmployeeDetails = async (id: string) => {
  if (!id) return {};

  const emplyeeDetails = await employeeRepository
    .createQueryBuilder('employee')
    .leftJoinAndSelect('employee.userId', 'user')
    .where('employee.id =:id', { id })
    .getOne();

  return emplyeeDetails;
};
