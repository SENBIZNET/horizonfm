import React, { createContext, useContext, useState, useEffect } from 'react';
import { db, auth, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, query, where, orderBy, onSnapshot, updateDoc, doc, Timestamp, addDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'breaking' | 'live' | 'system';
  read: boolean;
  createdAt: any;
  link?: string;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => Promise<void>;
  requestPushPermission: () => Promise<void>;
  sendTestNotification: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    let unsubscribeSnap: (() => void) | null = null;

    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      // Clean up previous listener if any
      if (unsubscribeSnap) {
        unsubscribeSnap();
        unsubscribeSnap = null;
      }

      if (user) {
        const q = query(
          collection(db, 'notifications'),
          where('userId', '==', user.uid),
          orderBy('createdAt', 'desc')
        );

        unsubscribeSnap = onSnapshot(q, (snapshot) => {
          const fetched: Notification[] = [];
          let unread = 0;
          snapshot.forEach((docSnap) => {
            const data = docSnap.data() as Notification;
            fetched.push({ ...data, id: docSnap.id });
            if (!data.read) unread++;
          });
          setNotifications(fetched);
          setUnreadCount(unread);
        }, (error) => {
          // Only report error if we are still suppose to be listening
          if (auth.currentUser) {
            handleFirestoreError(error, OperationType.LIST, 'notifications');
          }
        });
      } else {
        setNotifications([]);
        setUnreadCount(0);
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeSnap) unsubscribeSnap();
    };
  }, []);

  const markAsRead = async (id: string) => {
    try {
      await updateDoc(doc(db, 'notifications', id), { read: true });
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  const requestPushPermission = async () => {
    if (!('Notification' in window)) {
      console.log('This browser does not support desktop notification');
      return;
    }

    const permission = await window.Notification.requestPermission();
    if (permission === 'granted') {
      console.log('Notification permission granted.');
      // In a real app, you'd get the FCM token here
    }
  };

  // Mock function for demo purposes since the user can't trigger them from a backend yet
  const sendTestNotification = async () => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      // NOTE: This will fail with current rules (allow create: if false) 
      // but I'll use it as a reference for how a "system" would do it.
      // For the demo to work without a backend, I might need to TEMPORARILY allow create in rules
      // or just simulate it locally. 
      // Actually, I'll update rules to allow create IF it's a test for now, or just handle it.
      console.log("Mocking notification...");
      // For actual implementation in a real cloud environment, this would be a Cloud Function.
    } catch (error) {
       console.error(error);
    }
  };

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, markAsRead, requestPushPermission, sendTestNotification }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
