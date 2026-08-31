import type { User } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://lern-no.vercel.app/api';

export const authService = {
  async register(data: { name: string; email: string; password: string; role: string }): Promise<{ token: string; user: User }> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || 'Registration failed.');
      }
      return result;
    } catch (error: any) {
      throw new Error(error.message || 'Server connection error.');
    }
  },

  async login(data: { email: string; password: string }): Promise<{ token: string; user: User }> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || 'Login failed.');
      }
      return result;
    } catch (error: any) {
      throw new Error(error.message || 'Server connection error.');
    }
  },

  async getMe(token: string): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || 'Failed to fetch current user.');
    }
    return result.user;
  },

  async getAllUsers(token: string): Promise<User[]> {
    const response = await fetch(`${API_BASE_URL}/admin/users`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || 'Failed to fetch users list.');
    }
    return result.users;
  },
};
