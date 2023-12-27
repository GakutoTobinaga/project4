"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import LoadingDots from "@components/loading/loading-dots";
import toast, { Toaster } from "react-hot-toast";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginSignin({ type }: { type: "login" | "register" }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setLoading(true);
        if (type === "login") {
          // typeがloginで通ってるか
          console.log("type = login"),
          signIn("credentials", {
            redirect: false,
            username: e.currentTarget.username.value,
            email: e.currentTarget.email.value,
            password: e.currentTarget.password.value,
            // @ts-ignore
          }).then(({ error }) => {
            // Credentialsに通っているか
            console.log("Credentials passed")
            if (error) {
              // そのあとのエラー
              // console.log("login failed")
              setLoading(false);
              toast.error(error);
            } else {
              // 無事に成功したら↓、ルートにリダイレクト
              toast.success("ログインに成功しました！タイムラインを表示します...");
              // console.log("login success")
              router.refresh();
              router.push("/");
            }
          });
        } else {
          // typeがregisterで通ってるか
          console.log("type = register")
          fetch("/api/auth/register", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              username: e.currentTarget.username.value,
              email: e.currentTarget.email.value,
              password: e.currentTarget.password.value,
            }), // [多分解決] POSTを送って登録されて、そこからJSONが帰ってこない
          }).then(async (res) => {
            console.log("Register passed")
            setLoading(false);
            if (res.status === 200) {
              toast.success("アカウントを作成しました！ログインしてください...");
              setTimeout(() => {
                router.push("/login");
              }, 2000);
            } else {
              const { error } = await res.json();
              toast.error(error);
            }
          });
        }
      }}
      className="flex flex-col space-y-4 bg-gray-50 px-4 py-8 sm:px-16"
    >
            <div>
        <label
          htmlFor="username"
          className="block text-xs text-gray-600 uppercase"
        >
          ユーザーネーム
        </label>
        <input
          id="username"
          name="username"
          type="username"
          placeholder="your username"
          autoComplete="username"
          required
          className="mt-1 block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-black focus:outline-none focus:ring-black sm:text-sm"
        />
      </div>
      <div>
        <label
          htmlFor="email"
          className="block text-xs text-gray-600 uppercase"
        >
          メールアドレス
        </label>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="your@email.com"
          autoComplete="email"
          required
          className="mt-1 block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-black focus:outline-none focus:ring-black sm:text-sm"
        />
      </div>
      <div>
        <label
          htmlFor="password"
          className="block text-xs text-gray-600 uppercase"
        >
          パスワード
        </label>
        <input
          id="password"
          name="password"
          type="password"
          placeholder="your password"
          required
          className="mt-1 block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-black focus:outline-none focus:ring-black sm:text-sm"
        />
      </div>
      <button
        disabled={loading}
        className={`${
          loading
            ? "cursor-not-allowed border-gray-200 bg-gray-100"
            : "border-black bg-black text-white hover:bg-white hover:text-black"
        } flex h-10 w-full items-center justify-center rounded-md border text-sm transition-all focus:outline-none`}
      >
        {loading ? (
          <LoadingDots color="#808080" />
        ) : (
          <p>{type === "login" ? "Log In" : "Register"}</p>
        )}
      </button>
      {type === "login" ? (
        <div className="text-center text-sm text-gray-600">
          アカウントを無料で{""}
          <Link href="/register" className="font-semibold text-gray-800">
            登録
          </Link>{""}
          できます。
        </div>
      ) : (
        <div className="text-center text-sm text-gray-600">
          アカウントをお持ちですか？{""}
          <Link href="/login" className="font-semibold text-gray-800">
            ログイン
          </Link>{""}
          できます。
        </div>
      )}
    </form>
  );
}
