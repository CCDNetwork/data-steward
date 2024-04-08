import { Organization } from '@/services/organizations';
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

  // Manage organization
  static getOrganization = (): Organization | null => {
    const stringOrganization = localStorage.getItem('organization');
    if (!stringOrganization) {
      return null;
    }
    return JSON.parse(stringOrganization);
  };

  static setOrganization = (organization: Organization) => {
    localStorage.setItem('organization', JSON.stringify(organization));
  };

  static removeOrganization = () => {
    localStorage.removeItem('organization');
  };
}
