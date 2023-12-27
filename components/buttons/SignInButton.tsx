// サインインボタンではなく、サインインページに行くボタン
import Link from 'next/link';
import React from 'react';
import { Button } from '@tremor/react';

export default function SignInButton() {
  return (
    <Link href="/login" passHref>
      <Button variant='secondary' color="green" type="button">Log In</Button>
    </Link>
  );
};

