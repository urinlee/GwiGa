import type { GroupMember } from "@/generated/prisma/client";
import { getGroupMember, isAdmin } from "@/services/group";
import { getCurrentUser, type CurrentUser } from "@/utils/currentUser";
import { HttpError } from "./response";
import { isGroupNoticeAuthor } from "@/services/groupnotice";

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

/**
 * 해당 그룹의 멤버 필수. 실패 시 403을 던진다.
 * 멤버십 레코드를 그대로 돌려주므로, `GroupMember.id`가 필요한 곳
 * (읽음 기록 등)에서 별도 조회 없이 쓸 수 있다.
 */
export async function requireMember(groupId: string, userId: string): Promise<GroupMember> {
    const member = await getGroupMember(groupId, userId);
    if (!member) {
        throw new HttpError(403, "NOT_A_MEMBER");
    }
    return member;
}

// groupNotice의 작성자인지 확인. 실패 시 403을 던진다.
export async function requireGroupNoticeAuthor(noticeId: string, userId: string): Promise<void> {
    if (!(await isGroupNoticeAuthor(noticeId, userId))) {
        throw new HttpError(403, "NOT_A_AUTHOR");
    }
}

// groupNotice의 작성자이거나 그룹의 어드민인지 확인. 실패 시 403을 던진다.
export async function requireGroupNoticeAuthorOrAdmin(groupId: string, noticeId: string, userId: string): Promise<void> {
    const isAuthor = await isGroupNoticeAuthor(noticeId, userId);
    const isAdminUser = await isAdmin(groupId, userId);

    if (!isAuthor && !isAdminUser) {
        throw new HttpError(403, "NOT_A_AUTHOR_OR_ADMIN");
    }
}
