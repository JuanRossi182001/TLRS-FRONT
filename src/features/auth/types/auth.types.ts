export type UserRole = 'admin' | 'client_user';

export type CurrentUser = {
  id: number;
  name: string;
  role: UserRole;
  clientId?: number;
};
