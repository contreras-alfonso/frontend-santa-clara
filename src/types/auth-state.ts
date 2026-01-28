import type { User } from '../stores/auth-response';

export interface AuthState {
  user: User | null;
  token: string | null;
  role: string | null;
  authenticated: boolean;
}
