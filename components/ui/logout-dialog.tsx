'use client';

import { useState } from 'react';
import { clearTokens } from '@/lib/axios';
import { useAuth } from '@/components/providers/auth-provider';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './dialog';
import { Button } from './button';
import { LogOut } from 'lucide-react';

interface LogoutDialogProps {
  children?: React.ReactNode;
}

export function LogoutDialog({ children }: LogoutDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { checkAuth } = useAuth();

  const handleLogout = async () => {
    setLoading(true);

    try {
      // Clear tokens from localStorage
      clearTokens();

      // Close dialog
      setOpen(false);

      // Recheck auth status to update the UI
      await checkAuth();
    } catch (err: unknown) {
      console.error('Error logging out:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-heading">LOGOUT</DialogTitle>
          <DialogDescription className="text-base">
            Are you sure you want to log out?
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-3 py-4">
          <Button
            variant="default"
            size="lg"
            onClick={handleLogout}
            disabled={loading}
            className="w-full font-heading text-base"
          >
            {loading ? (
              <>
                <span className="mr-2">●</span>
                LOGGING OUT...
              </>
            ) : (
              <>
                <LogOut className="mr-2 h-5 w-5" />
                LOGOUT
              </>
            )}
          </Button>

          <Button
            variant="neutral"
            size="lg"
            onClick={() => setOpen(false)}
            disabled={loading}
            className="w-full font-heading text-base"
          >
            CANCEL
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
