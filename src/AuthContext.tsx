/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'talent' | 'recruiter';
  avatar?: string;
  companyName?: string;
  location?: string;
  phone?: string;
  bio?: string;
  website?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, role: 'talent' | 'recruiter') => void;
  register: (name: string, email: string, role: 'talent' | 'recruiter') => void;
  updateProfile: (updatedFields: Partial<Omit<User, 'id'>>) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check localStorage for saved user
    const savedUser = localStorage.getItem('talentHubUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = (email: string, role: 'talent' | 'recruiter') => {
    // Simulated login
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name: email.split('@')[0],
      email: email,
      role: role,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
      companyName: 'Acme Corp',
      location: 'Jakarta, Indonesia',
      phone: '+62 812-3456-7890',
      bio: 'We design and craft beautiful digital experiences.',
      website: 'https://acme.com'
    };
    setUser(newUser);
    localStorage.setItem('talentHubUser', JSON.stringify(newUser));
  };

  const register = (name: string, email: string, role: 'talent' | 'recruiter') => {
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name: name,
      email: email,
      role: role,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
      companyName: 'Acme Corp',
      location: 'Jakarta, Indonesia',
      phone: '+62 812-3456-7890',
      bio: 'We design and craft beautiful digital experiences.',
      website: 'https://acme.com'
    };
    setUser(newUser);
    localStorage.setItem('talentHubUser', JSON.stringify(newUser));
  };

  const updateProfile = (updatedFields: Partial<Omit<User, 'id'>>) => {
    setUser(prevUser => {
      if (!prevUser) return null;
      const updated = { ...prevUser, ...updatedFields };
      localStorage.setItem('talentHubUser', JSON.stringify(updated));
      return updated;
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('talentHubUser');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, updateProfile, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
