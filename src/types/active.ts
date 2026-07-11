import type { Active } from "@/generated/prisma/client";

/** 액티브 목록/표시용 읽기 모델. Prisma의 Active에서 파생하므로 스키마와 항상 일치한다. */
export type ActivePreview = Pick<Active, "id" | "name" | "description" | "primaryColor" | "secondaryColor">;
