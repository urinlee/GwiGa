import { auth } from "@/lib/auth";

export interface CurrentUser {
    id: string,
    name:string,
}

export async function getUser() : Promise<CurrentUser | null> {
    const session = await auth();
    if (!session) return null;

    return {
        id: session.user.id,
        name: session.user.name
    }
}