import { NextResponse } from 'next/server';
import { User } from '@/app/lib/auth-definitions';

// Fetch all users from the Kinde management API
async function fetchUsers() {
  const response = await fetch(`${process.env.KINDE_ISSUER_URL}/api/v1/users`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${process.env.KINDE_API_TOKEN}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Error fetching users: ${response.statusText}`);
  }

  const data = await response.json();
  return data.users;
}

// Refresh user claims to invalidate tokens
async function refreshUserClaims(user_id: string) {
  const response = await fetch(`${process.env.KINDE_ISSUER_URL}/api/v1/users/${user_id}/refresh_claims`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.KINDE_API_TOKEN}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Error refreshing claims for user ${user_id}: ${response.statusText}`);
  }

  const claims = await response.json();
  console.log(claims);
  return claims;
}

// Main API handler
export async function GET() {
  try {
    const users = await fetchUsers();

    const suspendedUsers = users.filter((user: User) => user.is_suspended);
    // console.log(suspendedUsers);

    // Refresh claims for all suspended users
    for (const user of suspendedUsers) {
      await refreshUserClaims(user.id);
    }

    return NextResponse.json({
      success: true,
      suspendedUsers,
    });
  } catch (error) {
    return NextResponse.json({ success: false, error}, { status: 500 });
  }
}
