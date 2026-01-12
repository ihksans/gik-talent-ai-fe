export interface AuthState {
  userId: string | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
}
