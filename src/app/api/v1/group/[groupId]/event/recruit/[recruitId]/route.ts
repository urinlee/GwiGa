import { z } from "zod";
import { route } from "@/lib/api/route";
import { ok } from "@/lib/api/response";
import { verifyAdmin } from "@/lib/dal";
import { RecruitStatus } from "@/generated/prisma/enums";
import { recruitSchema } from "@/schemas/schemas";
import { updateRecruit, updateRecruitStatus } from "@/services/recruit";

type Params = { groupId: string; recruitId: string };

// strict()라야 status만 온 카드의 열기/마감과 전체 필드를 보내는 수정 폼이 갈린다.
const statusOnlySchema = z.object({ status: z.enum(RecruitStatus) }).strict();

// 모집 열기·마감(status만) 또는 회차 내용 수정(전체 필드)
export const PATCH = route<Params>(async (req, { params }) => {
    await verifyAdmin(params.groupId);

    const body = await req.json();

    const statusOnly = statusOnlySchema.safeParse(body);
    if (statusOnly.success) {
        return ok(await updateRecruitStatus(params.groupId, params.recruitId, statusOnly.data.status));
    }

    const data = recruitSchema.parse(body);
    return ok(await updateRecruit(params.groupId, params.recruitId, data));
});
