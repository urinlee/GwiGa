import type { Account, Profile, Session, User } from "next-auth";
import { JWT } from "next-auth/jwt";




// 로그인 callback
type SignInCallbackParams = {
  user: User;
  account: Account | null;
  profile?: Profile;
};

/// 로그인 시, 이메일이 없는 경우 로그인 실패로 처리
export async function signInCallback({
  user,
}: SignInCallbackParams) {
  if (!user.email) {
    return false;
  }

  return true;
}


// 세션 callback
type SessionCallbackParams = {
  session: Session;
  user: User;

};

/// 세션에 사용자 ID와 역할을 추가하여 반환
export async function sessionCallback({
  session,
  user,

}: SessionCallbackParams) {
  if (session.user) {
    session.user.id = user.id;
    session.user.role = user.role;
  }
  return session;

}