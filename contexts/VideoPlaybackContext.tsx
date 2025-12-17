'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';

interface VideoPlaybackContextType {
  currentlyPlayingId: string | null;
  setCurrentlyPlaying: (id: string | null) => void;
  isMuted: boolean;
  toggleMute: () => void;
}

const VideoPlaybackContext = createContext<VideoPlaybackContextType | undefined>(undefined);

export function VideoPlaybackProvider({ children }: { children: React.ReactNode }) {
  const [currentlyPlayingId, setCurrentlyPlayingId] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(true);

  const setCurrentlyPlaying = useCallback((id: string | null) => {
    setCurrentlyPlayingId(id);
  }, []);

  const toggleMute = useCallback(() => {
    setIsMuted(prev => !prev);
  }, []);

  return (
    <VideoPlaybackContext.Provider
      value={{ currentlyPlayingId, setCurrentlyPlaying, isMuted, toggleMute }}
    >
      {children}
    </VideoPlaybackContext.Provider>
  );
}

export function useVideoPlayback() {
  const context = useContext(VideoPlaybackContext);
  if (context === undefined) {
    throw new Error('useVideoPlayback must be used within a VideoPlaybackProvider');
  }
  return context;
}
