import { ok, route } from "@/lib/api/response";
import {RouteContext} from "@/lib/api/params";
import { getGroupNoticeBadges } from "@/services/groupnotice";

type CTX = RouteContext<{ groupId: string }>;

    
export const GET = route<CTX>(async (_req, { params }) => {
    const { groupId } = await params;
    return ok(getGroupNoticeBadges(groupId));
});