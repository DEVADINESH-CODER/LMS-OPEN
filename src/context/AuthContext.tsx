import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthUser, Student, TeacherAdmin } from '../types';
import { storageService } from '../lib/storage-provider';
import { verifySessionToken } from '../lib/security';

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  loginStudent: (registerNumber: string, pin: string) => Promise<AuthUser>;
  loginTeacher: (email: string, password: string) => Promise<AuthUser>;
  logout: () => void;
  changePin: (currentPin: string, newPin: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'lms_active_auth_session';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Synchronously initialize user from localStorage on initial page render
  const [user, setUser] = useState<AuthUser | null>(() => {
    if (typeof window === 'undefined') return null;
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) {
        const parsed: AuthUser = JSON.parse(stored);
        if (parsed && (parsed.role === 'teacher' || parsed.role === 'student')) {
          return parsed;
        }
      }
    } catch {
      // Fallback
    }
    return null;
  });

  const [isLoading, setIsLoading] = useState(false);

  // Background hydration: verify active student status
  useEffect(() => {
    const checkFreshStatus = async () => {
      try {
        const stored = localStorage.getItem(AUTH_STORAGE_KEY);
        if (stored) {
          const parsedUser: AuthUser = JSON.parse(stored);
          if (parsedUser && parsedUser.role === 'student' && parsedUser.student) {
            const students = storageService.getStudents();
            const freshStudent = students.find(s => s.id === parsedUser.student.id);
            if (freshStudent) {
              if (!freshStudent.isActive) {
                // Only log out if student was explicitly deactivated
                setUser(null);
                localStorage.removeItem(AUTH_STORAGE_KEY);
              } else {
                setUser({
                  ...parsedUser,
                  student: freshStudent
                });
              }
            }
          }
        }
      } catch (err) {
        console.error('Session hydration failed:', err);
      }
    };

    checkFreshStatus();
  }, []);

  const loginStudent = async (registerNumber: string, pin: string): Promise<AuthUser> => {
    const authResult = await storageService.loginStudent(registerNumber, pin);
    setUser(authResult);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authResult));
    return authResult;
  };

  const loginTeacher = async (email: string, password: string): Promise<AuthUser> => {
    const authResult = await storageService.loginTeacher(email, password);
    setUser(authResult);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authResult));
    return authResult;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  };

  const changePin = async (currentPin: string, newPin: string): Promise<void> => {
    if (!user || user.role !== 'student') throw new Error('Only students can change their PIN.');
    await storageService.changeStudentPin(user.student.id, currentPin, newPin);
    
    // Update local state
    const updatedUser: AuthUser = {
      ...user,
      student: {
        ...user.student,
        mustChangePin: false
      }
    };
    setUser(updatedUser);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, loginStudent, loginTeacher, logout, changePin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
