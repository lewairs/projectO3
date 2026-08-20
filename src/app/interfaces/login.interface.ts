
export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthDepartment{
    id:string;
    name:string;
    code:string;
}

export interface AuthUser{
    id:string;
    employeeId:string;
    employeeNumber:string;
    firstName:string;
    lastName:string;
    email:string;
    jobTitle:string;
    department:AuthDepartment;
    role:string;
    mustChangePassword:boolean;

}

export interface LoginResponse {
  accessToken: string;
  tokenType:'Bearer';
  expiresIn: number;
  user: AuthUser;
}