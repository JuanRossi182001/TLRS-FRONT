import type { CurrentUser } from '../types/auth.types';

export const adminUserMock: CurrentUser = {
  id: 99,
  name: 'Admin Demo',
  role: 'admin',
};

export const clientUserMock: CurrentUser = {
  id: 1,
  name: 'Productor Demo',
  role: 'client_user',
  clientId: 1,
};

export const currentUserMock: CurrentUser = clientUserMock;
