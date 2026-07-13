import { RouteContext } from "@/lib/api/params";
import { route, ok } from "@/lib/api/response";
import { requireAdmin, requireUser } from "@/lib/api/guard";
import { groupActiveSetSchema } from "@/schemas/setting/group/schemas";
import { deleteActive, updateActive } from "@/services/active";

type Ctx = RouteContext<{ id: string; activeId: string }>;
// 액티브 수정
export const PATCH = route<Ctx>(async (req, { params }) => {
    const { id, activeId } = await params;
    const user = await requireUser();
    await requireAdmin(id, user.id);

    const data = groupActiveSetSchema.parse(await req.json());

    return ok(await updateActive(id, activeId, data));
});

// 액티브 삭제
export const DELETE = route<Ctx>(async (_req, { params }) => {
    const { id, activeId } = await params;
    const user = await requireUser();
    await requireAdmin(id, user.id);

    return ok(await deleteActive(id, activeId));
});
