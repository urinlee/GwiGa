import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";

/**
 * 라우트에서 던지는 표준 HTTP 에러.
 * 가드/서비스 어디서든 `throw new HttpError(403, "FORBIDDEN")` 처럼 던지면
 * `route()` 래퍼가 잡아서 일관된 JSON 응답으로 변환한다.
 */
export class HttpError extends Error {
    constructor(
        public readonly status: number,
        public readonly code: string,
        message?: string,
    ) {
        super(message ?? code);
        this.name = "HttpError";
    }
}

/** 성공 응답 (기본 200). */
export function ok<T>(data: T, status = 200) {
    return NextResponse.json(data, { status });
}

/** 생성 성공 응답 (201). */
export function created<T>(data: T) {
    return NextResponse.json(data, { status: 201 });
}

/** 에러 응답. body는 `{ code, error }`로 통일한다. */
export function fail(status: number, code: string, message?: string) {
    return NextResponse.json({ code, error: message ?? code }, { status });
}

/** 알 수 없는 에러를 표준 응답으로 변환한다. */
export function toResponse(err: unknown) {
    if (err instanceof HttpError) {
        return fail(err.status, err.code, err.message);
    }
    if (err instanceof ZodError) {
        return NextResponse.json(
            { code: "VALIDATION", error: err.flatten() },
            { status: 400 },
        );
    }
    console.error(err);
    return fail(500, "INTERNAL_ERROR");
}

type Handler<Ctx> = (req: NextRequest, ctx: Ctx) => Promise<Response> | Response;

/**
 * 라우트 핸들러 래퍼. try/catch를 매번 쓰지 않아도 되도록
 * HttpError / ZodError / 그 외 예외를 표준 응답으로 변환한다.
 *
 * @example
 * export const POST = route<RouteContext<{ id: string }>>(async (req, { params }) => {
 *   const { id } = await params;
 *   const user = await requireUser();
 *   await requireAdmin(id, user.id);
 *   const data = schema.parse(await req.json());
 *   return created(await createActive(id, data));
 * });
 */
export function route<Ctx>(handler: Handler<Ctx>) {
    return async (req: NextRequest, ctx: Ctx): Promise<Response> => {
        try {
            return await handler(req, ctx);
        } catch (err) {
            return toResponse(err);
        }
    };
}
