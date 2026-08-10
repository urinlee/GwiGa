import { route } from "@/lib/api/route";
import { ok } from "@/lib/api/response";
import { verifyAdmin } from "@/lib/dal";
import { activeSchema } from "@/schemas/schemas";
import { deleteActive, updateActive } from "@/services/active";

type Params = { groupId: string; activeId: string };

// 액티브 수정
export const PATCH = route<Params>(async (req, { params }) => {
    await verifyAdmin(params.groupId);

    const data = activeSchema.parse(await req.json());
    return ok(await updateActive(params.groupId, params.activeId, data));
});

// 액티브 삭제
export const DELETE = route<Params>(async (_req, { params }) => {
    await verifyAdmin(params.groupId);

    return ok(await deleteActive(params.groupId, params.activeId));
});
