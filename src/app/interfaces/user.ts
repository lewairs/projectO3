export interface DepartmentSummary{
  id:string;
  name:string;
  code:string;
}
export interface User {
  id: number;
  employeeId:string;
  employeeNumber:string;
  firstName:string;
  lastName:string;
  email:string;
  jobTitle:string;
  department:DepartmentSummary;
  role:string;
  mustChangePassword:boolean;

}