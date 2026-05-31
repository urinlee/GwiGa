import type { Account, NextAuthConfig, Profile, Session, User } from "next-auth";
import { JWT } from "next-auth/jwt";




// 로그인 callback
/// 로그인 시, 이메일이 없는 경우 로그인 실패로 처리
export const signInCallback: NonNullable<
  NextAuthConfig["callbacks"]
>["signIn"] = async ({ user }) => {
  if (!user.email) {
    return false;
  }
  return true;
};


// 세션 callback
/// 세션에 사용자 ID와 역할을 추가하여 반환
export const sessionCallback: NonNullable<
  NextAuthConfig["callbacks"]
>["session"] = async ({ session, user }) => {
  if (session.user) {
    session.user.id = user.id;
  }
  return session;
};