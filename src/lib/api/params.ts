/**
 * Next route handler의 두 번째 인자(context) 타입.
 *
 * 이 버전 Next에서 `params`는 Promise로 전달되므로 `await params`가 필요하다.
 * 각 route 파일에서 타입을 따로 정의하거나 다른 route 파일에서 import하지 말고
 * 여기서 가져다 쓴다.
 *
 * @example
 * export async function GET(req: Request, { params }: RouteContext<{ id: string }>) {
 *   const { id } = await params;
 * }
 */
export type RouteContext<TParams extends Record<string, string> = Record<string, string>> = {
    params: Promise<TParams>;
};
