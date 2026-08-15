import { route } from "@/lib/api/route";
import { ok } from "@/lib/api/response";
import { verifyAdmin } from "@/lib/dal";
import { getApplicants } from "@/services/recruit";

type Params = { groupId: string; recruitId: string };

// 신청자 명단. 누가 신청했는지는 관리자만 본다.
export const GET = route<Params>(async (_req, { params }) => {
    await verifyAdmin(params.groupId);

    return ok(await getApplicants(params.groupId, params.recruitId));
});
