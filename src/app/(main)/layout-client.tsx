
"use client";

import { useEffect } from 'react';

const SESSION_TIMEOUT = 5 * 60 * 1000; // 5 minutes
const LAST_ACTIVE_KEY = 'lastActiveTime';

export function MainLayoutClient({ children }: { children: React.ReactNode }) {

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        sessionStorage.setItem(LAST_ACTIVE_KEY, Date.now().toString());
      }
    };

    const checkSession = () => {
      const lastActiveTime = sessionStorage.getItem(LAST_ACTIVE_KEY);
      if (lastActiveTime) {
        const timeSinceLastActive = Date.now() - parseInt(lastActiveTime, 10);
        if (timeSinceLastActive > SESSION_TIMEOUT) {
          sessionStorage.removeItem(LAST_ACTIVE_KEY);
          // Hard reload to clear all component state
          window.location.reload();
        }
      }
    };

    // Check session when the component mounts (i.e., page is loaded/revisited)
    checkSession();

    // Set timestamp when tab becomes inactive or is closed
    document.addEventListener('visibilitychange', handleVisibilityChange);
    // 'pagehide' is a more reliable event for when a user navigates away or closes a tab
    window.addEventListener('pagehide', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('pagehide', handleVisibilityChange);
    };
  }, []);

  return <>{children}</>;
}
