import { RouteContext } from "@/lib/api/params";
import { route, ok } from "@/lib/api/response";
import { requireAdmin, requireUser } from "@/lib/api/guard";
import { groupActiveSetSchema } from "@/schemas/schemas";
import { deleteActive, updateActive } from "@/services/active";

type Ctx = RouteContext<{ groupId: string; activeId: string }>;
// 액티브 수정
export const PATCH = route<Ctx>(async (req, { params }) => {
    const { groupId, activeId } = await params;
    const user = await requireUser();
    await requireAdmin(groupId, user.id);

    const data = groupActiveSetSchema.parse(await req.json());

    return ok(await updateActive(groupId, activeId, data));
});

// 액티브 삭제
export const DELETE = route<Ctx>(async (_req, { params }) => {
    const { groupId, activeId } = await params;
    const user = await requireUser();
    await requireAdmin(groupId, user.id);

    return ok(await deleteActive(groupId, activeId));
});
