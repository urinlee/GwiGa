import { z } from "zod";
import { route } from "@/lib/api/route";
import { ok } from "@/lib/api/response";
import { verifyAdmin } from "@/lib/dal";
import { RecruitStatus } from "@/generated/prisma/enums";
import { updateRecruitStatus } from "@/services/recruit";

type Params = { groupId: string; recruitId: string };

const recruitStatusSchema = z.object({ status: z.enum(RecruitStatus) });

// 모집 열기/마감
export const PATCH = route<Params>(async (req, { params }) => {
    await verifyAdmin(params.groupId);

    const { status } = recruitStatusSchema.parse(await req.json());
    return ok(await updateRecruitStatus(params.groupId, params.recruitId, status));
});
