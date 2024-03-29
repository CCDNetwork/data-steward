import { Tenant } from '@/services/tenants';
import { User, initialUser } from '@/services/users';

export class LocalStorage {
  // Manage token
  static getToken = () => localStorage.getItem('token') || sessionStorage.getItem('token');
  static setToken = (token: string) => localStorage.setItem('token', token);
  static setTokenToSession = (token: string) => sessionStorage.setItem('token', token);
  static removeToken = () => {
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
  };

  // Manage user
  static getUser = (): User => {
    const user = localStorage.getItem('user');
    if (!user) {
      return initialUser;
    }
    return JSON.parse(user);
  };
  static setUser = (user: User) => localStorage.setItem('user', JSON.stringify(user));
  static removeUser = () => localStorage.removeItem('user');

  // Manage tenant
  static getTenant = (): Tenant | null => {
    const stringTenant = localStorage.getItem('tenant');
    if (!stringTenant) {
      return null;
    }
    return JSON.parse(stringTenant);
  };

  static setTenant = (tenant: Tenant) => {
    localStorage.setItem('tenant', JSON.stringify(tenant));
  };

  static removeTenant = () => {
    localStorage.removeItem('tenant');
  };
}
