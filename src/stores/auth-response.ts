export interface AuthResponse {
  user:  User;
  token: string;
}

export interface User {
  id:                number;
  name:              string;
  role:              string;
  email:             string;
  created_at:        Date;
  updated_at:        Date;
}
