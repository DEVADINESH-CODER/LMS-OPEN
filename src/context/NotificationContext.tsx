import React, { createContext, useContext, useState, useEffect } from 'react';
import { InAppNotification } from '../types';
import { storageService } from '../lib/storage-provider';
import { useAuth } from './AuthContext';

interface NotificationContextType {
  notifications: InAppNotification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  refreshNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<InAppNotification[]>([]);

  const fetchNotifications = () => {
    if (!user) {
      setNotifications([]);
      return;
    }
    const role = user.role;
    const userId = role === 'student' ? user.student.id : user.teacher.id;
    const classId = role === 'student' ? user.student.classId : undefined;
    const list = storageService.getNotifications(role, userId, classId);
    setNotifications(list);
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 10000); // Polling every 10s
    return () => clearInterval(interval);
  }, [user]);

  const markAsRead = (id: string) => {
    storageService.markNotificationAsRead(id);
    fetchNotifications();
  };

  const markAllAsRead = () => {
    if (!user) return;
    storageService.markAllNotificationsAsRead(
      user.role, 
      user.role === 'student' ? user.student.classId : undefined
    );
    fetchNotifications();
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      markAsRead,
      markAllAsRead,
      refreshNotifications: fetchNotifications
    }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) throw new Error('useNotifications must be used within a NotificationProvider');
  return context;
};
