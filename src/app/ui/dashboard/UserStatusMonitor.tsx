'use client';

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { LogoutLink, useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";

export default function UserStatusMonitor() {
  const router = useRouter();
  const { getUser } = useKindeBrowserClient();

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

          // Simulate a click event on the logout link
          const logoutLink = document.getElementById('logout-link');
          if (logoutLink) {
            logoutLink.click(); // This triggers the logout action
          }
        }

      } catch (error) {
        console.error('Error during user status check:', error);
      }
    };

    const interval = setInterval(checkUserStatus, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, [router, getUser]);

  return (
    <LogoutLink id="logout-link" className="hidden" >Sign-out</LogoutLink>
  );
}