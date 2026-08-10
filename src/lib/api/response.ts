import { NextResponse } from "next/server";
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

// 라우트 핸들러 래퍼는 미들웨어 체인과 함께 route.ts에 있다.
