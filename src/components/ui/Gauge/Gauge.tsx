import { cn } from "@/lib/cn";

export interface GaugeMarker {
    /** 0~max 사이 값. 이 위치에 세로 기준선을 그린다. */
    value: number;
    /** 마커 색 (기본 반투명 회색) */
    color?: string;
    /** 접근성/툴팁 라벨 */
    label?: string;
}

export interface GaugeProps {
    /** 현재 값 */
    value: number;
    /** 게이지 100% 기준값 */
    max: number;
    /** 채움 색 (기본 zinc-500) */
    color?: string;
    /** 임의의 기준선 마커들 (최소 인원, 목표 금액 등) */
    markers?: GaugeMarker[];
    /** 트랙 커스터마이즈. 기본 "h-2 rounded-full bg-zinc-200" 위에 덧씌운다. */
    className?: string;
    /** 접근성 라벨 */
    ariaLabel?: string;
}

const clamp01 = (n: number) => Math.min(Math.max(n, 0), 1);

/**
 * 값 대비 채움을 보여주는 범용 게이지바.
 * 단위/라벨 텍스트는 도메인마다 다르므로 호출부에서 감싸 쓴다(예: EventGage).
 * markers로 임의의 기준선(최소 인원, 목표 금액 등)을 표시할 수 있다.
 */
export function Gauge({ value, max, color = "#71717a", markers = [], className, ariaLabel }: GaugeProps) {
    // max가 0/음수면 나눗셈이 깨지므로 방어.
    const toPct = (n: number) => (max > 0 ? clamp01(n / max) * 100 : 0);

    return (
        <div
            className={cn("relative h-2 w-full overflow-hidden rounded-full bg-zinc-200", className)}
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={max}
            aria-valuenow={Math.min(Math.max(value, 0), max)}
            aria-label={ariaLabel}
        >
            <div
                className="h-full rounded-full transition-[width] duration-500 ease-out"
                style={{ width: `${toPct(value)}%`, backgroundColor: color }}
            />
            {markers.map((marker, i) => (
                <span
                    key={i}
                    className="absolute top-0 bottom-0 w-0.5 -translate-x-1/2"
                    style={{ left: `${toPct(marker.value)}%`, backgroundColor: marker.color ?? "rgba(82,82,91,0.7)" }}
                    aria-label={marker.label}
                />
            ))}
        </div>
    );
}
