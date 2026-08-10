import { z } from "zod";
import { route } from "@/lib/api/route";
import { ok, created } from "@/lib/api/response";
import { verifyAdmin } from "@/lib/dal";
import { activeSchema } from "@/schemas/schemas";
import { createActive, getActives } from "@/services/active";

type Params = { groupId: string };

// 액티브 목록
export const GET = route<Params>(async (_req, { params }) => {
    await verifyAdmin(params.groupId);

    return ok(await getActives(params.groupId));
});

// applyToAll은 액티브 속성이 아니라 "생성 동작" 플래그라 스키마에서 분리해 받는다
const createActiveSchema = activeSchema.extend({
    applyToAll: z.boolean().optional().default(false),
});

// 액티브 생성
export const POST = route<Params>(async (req, { params }) => {
    await verifyAdmin(params.groupId);

    const { applyToAll, ...data } = createActiveSchema.parse(await req.json());
    return created(await createActive(params.groupId, data, applyToAll));
});
