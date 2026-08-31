import React, { createContext, useContext, useState } from 'react';
import type { User, UserRole } from '../types';
import { mockTeacherUser, mockStudentUser } from '../data/mockUsers';
import { authService } from '../services/authService';

interface AuthContextType {
  user: User | null;
  token: string | null;
  role: UserRole;
  isAuthenticated: boolean;
  login: (data: { email: string; password: string }) => Promise<void>;
  register: (data: { name: string; email: string; password: string; role: string }) => Promise<void>;
  switchRole: (role: UserRole) => void;
  loginAsTeacher: () => void;
  loginAsStudent: () => void;
  loginAsAdmin: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('lernno_jwt_token'));
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('lernno_demo_user');
    return saved ? JSON.parse(saved) : null;
  });

  const role: UserRole = user
    ? user.role.toLowerCase() === 'admin'
      ? 'admin'
      : user.role.toLowerCase() === 'teacher'
      ? 'teacher'
      : 'student'
    : 'student';

  const login = async (credentials: { email: string; password: string }) => {
    const result = await authService.login(credentials);
    setToken(result.token);
    setUser(result.user);
    localStorage.setItem('lernno_jwt_token', result.token);
    localStorage.setItem('lernno_demo_user', JSON.stringify(result.user));
  };

  const register = async (data: { name: string; email: string; password: string; role: string }) => {
    const result = await authService.register(data);
    setToken(result.token);
    setUser(result.user);
    localStorage.setItem('lernno_jwt_token', result.token);
    localStorage.setItem('lernno_demo_user', JSON.stringify(result.user));
  };

  const switchRole = (newRole: UserRole) => {
    const roleLower = newRole.toLowerCase();
    let selectedUser: User;
    if (roleLower === 'teacher') {
      selectedUser = mockTeacherUser;
    } else if (roleLower === 'admin') {
      selectedUser = {
        id: 'admin-1',
        name: 'Allahverdi Ağamalıyev (Super Admin)',
        email: 'agamaliyevallahverdii@gmail.com',
        role: 'admin',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
        title: 'Platform Administrator',
      };
    } else {
      selectedUser = mockStudentUser;
    }
    setUser(selectedUser);
    localStorage.setItem('lernno_demo_user', JSON.stringify(selectedUser));
  };

  const loginAsTeacher = () => {
    setUser(mockTeacherUser);
    localStorage.setItem('lernno_demo_user', JSON.stringify(mockTeacherUser));
  };

  const loginAsStudent = () => {
    setUser(mockStudentUser);
    localStorage.setItem('lernno_demo_user', JSON.stringify(mockStudentUser));
  };

  const loginAsAdmin = () => {
    const adminUser: User = {
      id: 'admin-1',
      name: 'Allahverdi Ağamalıyev (Super Admin)',
      email: 'agamaliyevallahverdii@gmail.com',
      role: 'admin',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
      title: 'Platform Administrator',
    };
    setUser(adminUser);
    localStorage.setItem('lernno_demo_user', JSON.stringify(adminUser));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('lernno_jwt_token');
    localStorage.removeItem('lernno_demo_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        role,
        isAuthenticated: !!user,
        login,
        register,
        switchRole,
        loginAsTeacher,
        loginAsStudent,
        loginAsAdmin,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
