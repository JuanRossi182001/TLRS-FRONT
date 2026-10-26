import { Bell, Fence, Map, PawPrint, Radio, Shield, UsersRound } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export type AppNavigationItem = {
  to: string;
  label: string;
  mobileLabel: string;
  icon: LucideIcon;
};

const baseNavigation: AppNavigationItem[] = [
  { to: '/app/map', label: 'Mapa', mobileLabel: 'Mapa', icon: Map },
  { to: '/app/animals', label: 'Animales', mobileLabel: 'Anim.', icon: PawPrint },
  { to: '/app/collars', label: 'Collares', mobileLabel: 'Coll.', icon: Radio },
  { to: '/app/rodeos', label: 'Rodeos', mobileLabel: 'Rodeos', icon: UsersRound },
  { to: '/app/geofences', label: 'Geocercas', mobileLabel: 'Cercas', icon: Fence },
  { to: '/app/alerts', label: 'Alertas', mobileLabel: 'Alertas', icon: Bell },
];

const adminNavigation: AppNavigationItem = {
  to: '/app/admin/dashboard',
  label: 'Panel admin',
  mobileLabel: 'Admin',
  icon: Shield,
};

export function getAppNavigation(isAdmin: boolean) {
  return isAdmin ? [...baseNavigation, adminNavigation] : baseNavigation;
}
