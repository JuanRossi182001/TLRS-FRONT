import { Navigate, createBrowserRouter } from 'react-router-dom';
import { LoginPage } from '../features/auth/pages/LoginPage';
import { AlertsPage } from '../features/alerts/pages/AlertsPage';
import { DeviceDetailPage } from '../features/devices/pages/DeviceDetailPage';
import { DevicesPage } from '../features/devices/pages/DevicesPage';
import { MapPage } from '../features/map/pages/MapPage';
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
    element: <AppLayout />,
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
    ],
  },
]);
