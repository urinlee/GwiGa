import { cache } from "react";
import { auth } from "@/lib/auth";

export interface CurrentUser {
    id: string,
    name:string,
}

/** 한 렌더 패스 안에서 세션을 한 번만 디코드하도록 cache로 감싼다. */
export const getCurrentUser = cache(async (): Promise<CurrentUser | null> => {
    const session = await auth();
    if (!session) return null;

    return {
        id: session.user.id,
        name: session.user.name
    }
});
