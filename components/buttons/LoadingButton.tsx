// LoadingButton.tsx
import React from 'react';
import { Button } from '@tremor/react';

export default function LoadingButton() {
  return (
    <>
    <div className='border-t font-mono'>
    <Button variant='secondary' color='gray'>
        Loading...
    </Button>
    </div>
    </>
  );
};
