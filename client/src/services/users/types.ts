export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  createdAt: Date | null;
  activatedAt: Date | null;
}

export interface UserProfileRequestPayload {
  email: string;
  firstName: string;
  lastName: string;
  password?: string;
}
