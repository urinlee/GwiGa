"use client";

import LoginButton from "@/components/ui/LoginButton/LoginButton";
import { signIn } from "next-auth/react";

const GoogleLoginButton = {
    text: "구글 계정으로 로그인",
    iconPath: "/login/google_icon.png",
    style: "bg-white text-gray-800 dark:bg-gray-300 dark:text-gray-800",
    onClick: () => {
      signIn("google", { callbackUrl: "/" });
    }
}


export default function Login() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-4xl font-bold mb-4">로그인</h1>
      <p className="text-lg text-gray-600 mb-8">계속하려면 로그인하세요.</p>
      <div className="w-180">
        <LoginButton {...GoogleLoginButton} />
      </div>
    </div>
  );
}