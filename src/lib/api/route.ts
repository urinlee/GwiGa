import { NextRequest } from "next/server";
import type { RouteContext } from "./params";
import { toResponse } from "./response";

type Handler<TParams> = (
    req: NextRequest,
    ctx: { params: TParams },
) => Promise<Response> | Response;

/**
 * params를 대신 await하고, HttpError / ZodError / 그 외 예외를 표준 응답으로 바꾼다.
 * 인가는 여기서 하지 않는다 — 핸들러 안에서 dal의 verify* 를 부른다.
 *
 * @example
 * export const GET = route<{ groupId: string }>(async (req, { params }) => {
 *   const { member } = await verifyMember(params.groupId);
 *   return ok(await getNotices(params.groupId, member.id));
 * });
 */
export function route<TParams extends Record<string, string> = Record<string, string>>(
    handler: Handler<TParams>,
) {
    return async (req: NextRequest, raw: RouteContext<TParams>): Promise<Response> => {
        try {
            return await handler(req, { params: await raw.params });
        } catch (err) {
            return toResponse(err);
        }
    };
}
