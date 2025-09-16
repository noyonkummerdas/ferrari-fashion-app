export interface User {
  _id?: string;
  name: string;
  email: string;
  username?: string;
  password?: string;
  type: 'admin' | 'manager' | string;
  photo?: string;
  phone?: string;
  status: 'active' | 'inactive' | string;
  permissions?: any;
  warehouse?: string;
}


