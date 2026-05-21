export type UserRole = 'admin' | 'client_user';

export type CurrentUser = {
  id: number;
  name: string;
  role: UserRole;
  clientId?: number;
};

export type LoginRequest = {
  username: string;
  password: string;
};

export type TokenResponse = {
  access_token: string;
  token_type?: string;
};

export type AuthContextValue = {
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};
