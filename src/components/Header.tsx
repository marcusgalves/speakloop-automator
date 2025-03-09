
import React from 'react';
import { useUpload } from '@/context/UploadContext';
import { Button } from '@/components/ui/button';
import { LogOut, LogIn } from 'lucide-react';

export function Header() {
  const { isAuthenticated, authenticate, logout } = useUpload();

  return (
    <header className="w-full py-6">
      <div className="container max-w-5xl mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-medium tracking-tight">
              <span className="text-primary font-semibold">Speak</span>
              <span className="text-foreground font-light">Loop</span>
              <span className="text-muted-foreground text-sm font-light"> Automator</span>
            </h1>
          </div>

          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={logout}
                className="flex items-center space-x-1 text-muted-foreground hover:text-foreground transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span>Disconnect</span>
              </Button>
            ) : (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={authenticate}
                className="flex items-center space-x-1"
              >
                <LogIn className="h-4 w-4" />
                <span>Connect YouTube</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
