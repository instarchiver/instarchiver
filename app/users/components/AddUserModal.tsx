'use client';

import { useState } from 'react';
import { Instagram, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCreateUser } from '@/hooks/useUsers';
import { APIError } from '@/lib/api/users.api';

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddUserModal({ isOpen, onClose }: AddUserModalProps) {
  const [username, setUsername] = useState('');
  const [error, setError] = useState<string | null>(null);
  const createUserMutation = useCreateUser();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!username.trim()) {
      setError('Username is required');
      return;
    }

    try {
      await createUserMutation.mutateAsync(username.trim());
      // Success - close modal and reset form
      setUsername('');
      onClose();
    } catch (err) {
      if (err instanceof APIError) {
        setError(err.message);
      } else {
        setError('Failed to add user. Please try again.');
      }
    }
  };

  const handleClose = () => {
    if (!createUserMutation.isPending) {
      setUsername('');
      setError(null);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={open => !open && handleClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-[var(--main)] border-2 border-[var(--border)] rounded-[var(--radius-base)] flex items-center justify-center">
              <Instagram className="w-6 h-6 text-[var(--main-foreground)]" />
            </div>
            <div className="text-left">
              <DialogTitle className="text-xl font-bold">Add Instagram User</DialogTitle>
              <DialogDescription className="text-sm">
                Enter the Instagram username to add to your archive
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4">
          {/* Username Input */}
          <div className="flex flex-col gap-2">
            <label htmlFor="username" className="text-sm font-[var(--font-weight-heading)]">
              Username
            </label>
            <Input
              id="username"
              type="text"
              placeholder="e.g., instagram"
              value={username}
              onChange={e => setUsername(e.target.value)}
              disabled={createUserMutation.isPending}
              className="w-full"
              autoFocus
            />
            <p className="text-xs text-[var(--foreground)]/60">
              Enter the username without the @ symbol
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-50 border-2 border-red-500 rounded-[var(--radius-base)]">
              <p className="text-sm text-red-700 font-[var(--font-weight-base)]">{error}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 justify-end mt-2">
            <Button
              type="button"
              variant="neutral"
              onClick={handleClose}
              disabled={createUserMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="default"
              disabled={createUserMutation.isPending || !username.trim()}
              className="flex items-center gap-2"
            >
              {createUserMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Adding...
                </>
              ) : (
                <>
                  <Instagram className="w-4 h-4" />
                  Add User
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
