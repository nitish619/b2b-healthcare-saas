'use client';

import { Bell, Search, User } from 'lucide-react';
import { Input } from '@/components/ui';

export function Navbar() {
  return (
    <header className="flex h-16 items-center justify-between border-b bg-card px-8 text-card-foreground">
      <div className="flex w-full max-w-md items-center">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input 
            placeholder="Search patients, reports..." 
            className="pl-10 bg-muted/50 border-none focus-visible:ring-1"
          />
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <button className="relative rounded-full p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors">
          <Bell className="h-5 w-5" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-destructive" />
        </button>
        <div className="flex items-center space-x-3 border-l pl-4">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium">Dr. Nitish Chavan</p>
            <p className="text-xs text-muted-foreground">Chief Medical Officer</p>
          </div>
          <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <User className="h-5 w-5" />
          </div>
        </div>
      </div>
    </header>
  );
}
