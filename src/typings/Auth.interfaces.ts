export interface FormAuthPropsInterface {
  isRegister: boolean;
}
export interface AuthInterface {
  email: string;
  password: string;
  displayedName?: string;
  repPassword?: string;
}

export interface AuthErrorInterface {
  error: {
    code: string;
    message: string;
  };
}
