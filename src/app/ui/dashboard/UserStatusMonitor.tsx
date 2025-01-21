'use client';

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import Cookies from 'js-cookie';

export default function UserStatusMonitor() {
  const router = useRouter();
  const { getUser, refreshData } = useKindeBrowserClient();

  useEffect(() => {
    const checkUserStatus = async () => {
      try {
        // Fetch current user data
        const currentUser = getUser();
        console.log(currentUser);
        if (!currentUser || !currentUser.id) {
          console.error("Unable to retrieve current user.");
          return;
        }

        const response = await fetch('/api/auth/user-status', { method: 'GET' });

        if (!response.ok) {
          console.error('Error checking user suspension:', await response.json());
          return;
        }

        const data = await response.json();

        // Check if the current user is in the suspended list
        const isSuspended = data.suspendedUsers?.some(
          (user: { id: string }) => user.id === currentUser.id
        );

        if (isSuspended) {
          console.log(`User ${currentUser.id} is suspended.`);

          // Destroy related cookies
          Cookies.remove('access_token', { path: '/' });
          // Cookies.remove('refresh_token', { path: '/' });
          // Cookies.remove('__clnds', { path: '/' });
          // Cookies.remove('next-auth.callback-url', { path: '/' });
          // Cookies.remove('next-auth.csrf-token', { path: '/' });

          await refreshData();
          router.push('/login'); // Redirect to login
        }
      } catch (error) {
        console.error('Error during user status check:', error);
      }
    };

    const interval = setInterval(checkUserStatus, 60000); // Check every minute
    checkUserStatus(); // Immediate check on mount

    return () => clearInterval(interval);
  }, [router, getUser, refreshData]);

  return null;
}
