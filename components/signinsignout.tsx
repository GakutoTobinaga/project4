"use client"
// ナヴィゲーションバー右上のボタンを切り替えるコンポーネント
import { useSession } from "next-auth/react";
import SignOutButton from "./buttons/SignOutButton";
import SignInButton from "./buttons/SignInButton";
import LoadingButton from "./buttons/LoadingButton";


// ?
interface status2 {
  status: "authenticated" | "loading" | "unauthenticated"
}
// 外側から引数で受け取って認証にする。ライブラリや認証方法が変わったらできなくなる

export default function SigninSignout( statusX : any ) {
  
  const { status } = useSession();
  if (status === "loading") {
    // ローディング中の表示
    return <LoadingButton/>
  }

  if (status === "authenticated") {
    // 認証されていたらサインアウトボタン
    return <SignOutButton/>;
  } else {
    // されていないならサインインへのリンクボタン
    return <SignInButton/>;
  }
}

