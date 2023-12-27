// SignOutButton.tsx
import React from 'react';
import { Button } from '@tremor/react';
import { signOut } from 'next-auth/react';

export default function SignOutButton() {
  return (
    <>
    <div className='border-t font-mono'>
      <Button variant='secondary' color='red' onClick={() => signOut()}>Sign Out</Button>
    </div>
    </>
  );
};
