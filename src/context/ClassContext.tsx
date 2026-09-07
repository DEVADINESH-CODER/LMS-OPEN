import React, { createContext, useContext, useState, useEffect } from 'react';
import { ClassId, ClassInfo } from '../types';
import { storageService } from '../lib/storage-provider';
import { useAuth } from './AuthContext';

interface ClassContextType {
  classes: ClassInfo[];
  activeClassId: ClassId;
  activeClass: ClassInfo;
  setActiveClassId: (id: ClassId) => void;
  refreshClasses: () => void;
}

const ClassContext = createContext<ClassContextType | undefined>(undefined);

export const ClassProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [classes, setClasses] = useState<ClassInfo[]>(storageService.getClasses());
  const [activeClassId, setActiveClassIdState] = useState<ClassId>('C1-112');

  // If user is a student, automatically lock activeClassId to their assigned class
  useEffect(() => {
    if (user && user.role === 'student') {
      setActiveClassIdState(user.student.classId);
    }
  }, [user]);

  const refreshClasses = () => {
    setClasses(storageService.getClasses());
  };

  const setActiveClassId = (id: ClassId) => {
    // Only teacher can manually switch active class
    if (user && user.role === 'student') {
      console.warn('Students cannot switch classes');
      return;
    }
    setActiveClassIdState(id);
  };

  const activeClass = classes.find(c => c.id === activeClassId) || classes[0];

  return (
    <ClassContext.Provider value={{ classes, activeClassId, activeClass, setActiveClassId, refreshClasses }}>
      {children}
    </ClassContext.Provider>
  );
};

export const useClass = () => {
  const context = useContext(ClassContext);
  if (!context) throw new Error('useClass must be used within a ClassProvider');
  return context;
};
