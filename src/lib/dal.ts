import "server-only";
import { cache } from "react";
import type { CurrentUser } from "@/utils/currentUser";
import { getCurrentUser } from "@/utils/currentUser";
import { HttpError } from "@/lib/api/response";
import { getGroupMember, isAdmin } from "@/services/group";
import { getEventMember } from "@/services/event";
import { isGroupNoticeAuthor } from "@/services/groupnotice";

/**
 * 인가를 한곳에 모은 Data Access Layer.
 * 라우트 핸들러와 서버 컴포넌트가 같은 함수를 쓰고, cache 덕에 한 요청에서 여러 번 불러도 조회는 한 번이다.
 * 실패는 HttpError를 던진다 — 라우트에서는 route()가 응답으로 바꾸고, 페이지에서는 error 바운더리로 간다.
 */

/** 로그인 필수. 실패 401. */
export const verifySession = cache(async (): Promise<CurrentUser> => {
    const user = await getCurrentUser();
    if (!user) throw new HttpError(401, "NOT_LOGGED_IN", "need login");
    return user;
});

/** 그룹 멤버 필수. 실패 403. member는 GroupMember 레코드(읽음 기록 등에 쓴다). */
export const verifyMember = cache(async (groupId: string) => {
    const user = await verifySession();
    const member = await getGroupMember(groupId, user.id);
    if (!member) throw new HttpError(403, "NOT_A_MEMBER");
    return { user, member };
});

/** 그룹 어드민 필수. 실패 403. */
export const verifyAdmin = cache(async (groupId: string) => {
    const user = await verifySession();
    if (!(await isAdmin(groupId, user.id))) throw new HttpError(403, "FORBIDDEN");
    return { user };
});

/** 이벤트 참가자 필수. 실패 403. */
export const verifyEventMember = cache(async (eventId: string) => {
    const user = await verifySession();
    const eventMember = await getEventMember(eventId, user.id);
    if (!eventMember) throw new HttpError(403, "NOT_A_MEMBER");
    return { user, eventMember };
});

/** 공지 작성자이거나 그룹 어드민. 실패 403. */
export const verifyNoticeAuthorOrAdmin = cache(async (groupId: string, noticeId: string) => {
    const user = await verifySession();
    const [author, admin] = await Promise.all([
        isGroupNoticeAuthor(noticeId, user.id),
        isAdmin(groupId, user.id),
    ]);
    if (!author && !admin) throw new HttpError(403, "NOT_A_AUTHOR_OR_ADMIN");
    return { user };
});
