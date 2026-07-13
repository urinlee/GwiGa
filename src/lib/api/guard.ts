import { isAdmin, isMember } from "@/services/group";
import { getCurrentUser, type CurrentUser } from "@/utils/currentUser";
import { HttpError } from "./response";

/** 로그인 필수. 실패 시 401을 던진다. */
export async function requireUser(): Promise<CurrentUser> {
    const user = await getCurrentUser();
    if (!user) {
        throw new HttpError(401, "NOT_LOGGED_IN", "need login");
    }
    return user;
}

/** 해당 그룹의 어드민 필수. 실패 시 403을 던진다. */
export async function requireAdmin(groupId: string, userId: string): Promise<void> {
    if (!(await isAdmin(groupId, userId))) {
        throw new HttpError(403, "FORBIDDEN");
    }
}

/** 해당 그룹의 멤버 필수. 실패 시 403을 던진다. */
export async function requireMember(groupId: string, userId: string): Promise<void> {
    if (!(await isMember(groupId, userId))) {
        throw new HttpError(403, "NOT_A_MEMBER");
    }
}
