import { Navigate, createBrowserRouter } from 'react-router-dom';
import { LoginPage } from '../features/auth/pages/LoginPage';
import { AlertsPage } from '../features/alerts/pages/AlertsPage';
import { AdminClientsPage } from '../features/admin/pages/AdminClientsPage';
import { AdminDashboardPage } from '../features/admin/pages/AdminDashboardPage';
import { AdminDevicesPage } from '../features/admin/pages/AdminDevicesPage';
import { AdminUsersPage } from '../features/admin/pages/AdminUsersPage';
import { AdminRoute } from '../features/auth/components/AdminRoute';
import { DeviceDetailPage } from '../features/devices/pages/DeviceDetailPage';
import { DevicesPage } from '../features/devices/pages/DevicesPage';
import { MapPage } from '../features/map/pages/MapPage';
import { ProtectedRoute } from '../features/auth/components/ProtectedRoute';
import { AppLayout } from '../shared/layouts/AppLayout';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/app/map" replace />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/app',
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/app/map" replace />,
      },
      {
        path: 'map',
        element: <MapPage />,
      },
      {
        path: 'devices',
        element: <DevicesPage />,
      },
      {
        path: 'devices/:deviceId',
        element: <DeviceDetailPage />,
      },
      {
        path: 'alerts',
        element: <AlertsPage />,
      },
      {
        path: 'admin',
        element: <AdminRoute />,
        children: [
          {
            index: true,
            element: <Navigate to="/app/admin/dashboard" replace />,
          },
          {
            path: 'dashboard',
            element: <AdminDashboardPage />,
          },
          {
            path: 'devices',
            element: <AdminDevicesPage />,
          },
          {
            path: 'clients',
            element: <AdminClientsPage />,
          },
          {
            path: 'users',
            element: <AdminUsersPage />,
          },
        ],
      },
    ],
  },
]);
