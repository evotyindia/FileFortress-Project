
"use client";

import { useEffect } from 'react';

const SESSION_TIMEOUT = 5 * 60 * 1000; // 5 minutes
const LAST_ACTIVE_KEY = 'lastActiveTime';

export function MainLayoutClient({ children }: { children: React.ReactNode }) {

  useEffect(() => {
    const handleActivity = () => {
      sessionStorage.setItem(LAST_ACTIVE_KEY, Date.now().toString());
    };
    
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        handleActivity();
      } else {
        checkSession();
      }
    };
    
    const checkSession = () => {
      const lastActiveTime = sessionStorage.getItem(LAST_ACTIVE_KEY);
      if (lastActiveTime) {
        const timeSinceLastActive = Date.now() - parseInt(lastActiveTime, 10);
        if (timeSinceLastActive > SESSION_TIMEOUT) {
          sessionStorage.removeItem(LAST_ACTIVE_KEY);
          // Clear chat history on session timeout
          sessionStorage.removeItem('chatMessages');
          // Hard reload to clear all component state
          window.location.reload();
        }
      }
    };

    // Initial check and setup
    checkSession();
    handleActivity(); // Set initial activity time

    // Set up event listeners
    window.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('pagehide', handleActivity); // More reliable for closing/navigating away
    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('keydown', handleActivity);
    window.addEventListener('scroll', handleActivity);

    // Set up an interval to check periodically, as a fallback
    const intervalId = setInterval(checkSession, 60 * 1000); // Check every minute

    return () => {
      window.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('pagehide', handleActivity);
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('keydown', handleActivity);
      window.removeEventListener('scroll', handleActivity);
      clearInterval(intervalId);
    };
  }, []);

  return <>{children}</>;
}
