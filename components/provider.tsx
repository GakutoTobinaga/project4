"use client";

import { SessionProvider } from "next-auth/react";

type Props = {
  children?: React.ReactNode;
};

export const NextAuthProvider = ({ children }: Props) => { // 1⃣
  return <SessionProvider>{children}</SessionProvider>; 
};
