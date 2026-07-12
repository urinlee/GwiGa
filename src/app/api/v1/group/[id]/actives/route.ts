import { z } from "zod";
import { RouteContext } from "@/lib/api/params";
import { route, ok, created } from "@/lib/api/response";
import { requireAdmin, requireUser } from "@/lib/api/guard";
import { groupActiveSetSchema } from "@/schemas/setting/group/schemas";
import { createActive, listActives } from "@/services/group/active";

type Ctx = RouteContext<{ id: string }>;

// 액티브 목록
export const GET = route<Ctx>(async (_req, { params }) => {
    const { id } = await params;
    const user = await requireUser();
    await requireAdmin(id, user.id);

    return ok(await listActives(id));
});

// applyToAll은 액티브 속성이 아니라 "생성 동작" 플래그라 스키마에서 분리해 받는다
const createActiveSchema = groupActiveSetSchema.extend({
    applyToAll: z.boolean().optional().default(false),
});

// 액티브 생성
export const POST = route<Ctx>(async (req, { params }) => {
    const { id } = await params;
    const user = await requireUser();
    await requireAdmin(id, user.id);

    const { applyToAll, ...data } = createActiveSchema.parse(await req.json());

    return created(await createActive(id, data, applyToAll));
});
