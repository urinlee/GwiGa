"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";

export function QueryProvider({ children }: { children: React.ReactNode }) {
  // useState로 한 번만 생성한다. new를 렌더 본문에서 바로 부르면
  // 리렌더마다 client가 새로 만들어져 캐시가 초기화된다.
  const [client] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // 대부분의 데이터(그룹·이벤트·공지)는 몇 분 낡아도 괜찮아 5분을 기본으로 둔다.
            // 실시간이 필요한 쿼리는 각자 덮는다. 예: 결제 상태 → staleTime: 0
            staleTime: 5 * 60 * 1000,
            retry: 1, // 실패 시 1번만 재시도 (기본 3번은 느린 실패를 만든다)
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={client}>
      {children}
      {/* 개발 중에만 번들에 포함된다. 좌하단 아이콘으로 열고 닫는다. */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
