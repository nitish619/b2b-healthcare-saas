import type {Metadata} from 'next';
import './globals.css'; // Global styles
import { NotificationManager } from '@/components/NotificationManager';

export const metadata: Metadata = {
  title: 'HealthSaaS - B2B Healthcare Dashboard',
  description: 'A comprehensive B2B Healthcare SaaS platform for patient management and analytics.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        {children}
        <NotificationManager />
      </body>
    </html>
  );
}
