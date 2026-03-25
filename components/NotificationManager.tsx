'use client';

import { useEffect } from 'react';

// Reusable function to trigger notifications from anywhere in the app
export const sendNotification = async (title: string, body: string, actionUrl?: string) => {
  if ('Notification' in window && 'serviceWorker' in navigator) {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      try {
        const registration = await navigator.serviceWorker.ready;
        registration.showNotification(title, {
          body,
          icon: '/favicon.ico',
          vibrate: [200, 100, 200],
          tag: 'healthsaas-alert',
          actions: [
            { action: 'view', title: 'View' },
            { action: 'dismiss', title: 'Dismiss' }
          ],
          data: { url: actionUrl }
        } as any);
      } catch (error) {
        console.error('Service Worker showNotification error', error);
        // Fallback to native UI notification
        new Notification(title, { body, icon: '/favicon.ico' });
      }
    }
  } else if ('Notification' in window) {
    // Fallback if Service Worker is not supported but Notification is
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      new Notification(title, { body, icon: '/favicon.ico' });
    }
  }
};

export function NotificationManager() {
  useEffect(() => {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      navigator.serviceWorker.register('/sw.js')
        .then(function(swReg) {
          console.log('Service Worker is registered', swReg);
        })
        .catch(function(error) {
          console.error('Service Worker Error', error);
        });
    }
  }, []);

  return (
    <button
      onClick={() => sendNotification('HealthSaaS Alert', 'New patient record added to the system.')}
      className="fixed bottom-8 right-8 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-2xl hover:scale-110 transition-transform"
      title="Test Notification"
    >
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
      </svg>
    </button>
  );
}
