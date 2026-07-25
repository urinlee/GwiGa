/**
 * 서로 어울리는 두 색을 만든다. Active·Event가 쓰는 (primaryColor, secondaryColor) 쌍을 위한 것.
 *
 * 같은 색상(hue)에서 명도만 다르게 뽑아 자동으로 조화되게 한다.
 *  - primary   : 밝은 톤 (카드 상단 바, 배경)
 *  - secondary : 같은 색 진한 톤 (아이콘 블록, 강조)
 */

export interface ColorPair {
    primary: string; // 밝은 색 #RRGGBB
    secondary: string; // 같은 계열 진한 색 #RRGGBB
}

/** HSL → #RRGGBB. h: 0-360, s·l: 0-100 */
function hslToHex(h: number, s: number, l: number): string {
    const sN = s / 100;
    const lN = l / 100;
    const k = (n: number) => (n + h / 30) % 12;
    const a = sN * Math.min(lN, 1 - lN);
    const f = (n: number) => {
        const color = lN - a * Math.max(-1, Math.min(k(n) - 3, 9 - k(n), 1));
        return Math.round(255 * color)
            .toString(16)
            .padStart(2, "0");
    };
    return `#${f(0)}${f(8)}${f(4)}`.toUpperCase();
}

/**
 * 어울리는 색 한 쌍을 만든다.
 * @param hue 0-360 색상. 생략하면 무작위. 같은 값을 주면 항상 같은 쌍이 나온다.
 */
export function makeColorPair(hue?: number): ColorPair {
    // Math.random()이 없는 환경(스크립트 등)을 대비해 인자로도 받을 수 있게 한다.
    const h = hue ?? Math.floor(Math.random() * 360);
    return {
        // 채도는 낮게(파스텔), 명도로만 대비를 준다 — 원색 쌍보다 UI에 안정적이다.
        primary: hslToHex(h, 55, 92), // 밝고 연함
        secondary: hslToHex(h, 45, 45), // 같은 색 진함
    };
}
