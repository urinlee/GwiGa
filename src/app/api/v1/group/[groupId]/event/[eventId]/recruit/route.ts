import { route } from "@/lib/api/route";
import { created, ok } from "@/lib/api/response";
import { verifyAdmin, verifyMember } from "@/lib/dal";
import { recruitSchema } from "@/schemas/schemas";
import { createRecruit, getRecruits } from "@/services/recruit";

type Params = { groupId: string; eventId: string };

// 이 이벤트의 모집 회차 목록
export const GET = route<Params>(async (_req, { params }) => {
    await verifyMember(params.groupId);

    return ok(await getRecruits(params.groupId, params.eventId));
});

// 회차 열기
export const POST = route<Params>(async (req, { params }) => {
    await verifyAdmin(params.groupId);

    const data = recruitSchema.parse(await req.json());
    return created(await createRecruit(params.groupId, params.eventId, data));
});
