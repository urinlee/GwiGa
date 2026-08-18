import { useState } from "react";
import type { stateType } from "../types";



/// T:
export default function useDividedByCheckedTag(allStatuses: stateType[]) {
    interface TagsCheckObject {
        [key: string]: number;
    }


    // 손댄 상태만 담는 덮어쓰기 맵. 처음부터 전체 id로 채우면 allStatuses가 바뀔 때
    // 새 상태의 값이 undefined로 남아 토글이 NaN이 된다.
    const [CheckedTagsStep, setCheckedTagsStep] = useState<TagsCheckObject>({});

    /** 0: 참조 안 함, 1: 이 상태가 아닌 것만, 2: 이 상태만. 손댄 적 없으면 0. */
    const getTagStep = (statusId: string) => CheckedTagsStep[statusId] ?? 0;

    const toggleTagClick = (statusId:string) => {
        setCheckedTagsStep((prev) => ({
            ...prev,
            [statusId]: ((prev[statusId] ?? 0) + 1) % 3, // 0 -> 1 -> 2 -> 0
        }));
    }

    const getStepCheckedTags = (step: number) : stateType[] => {
        // 지금 있는 상태 목록을 기준으로 고른다. 사라진 상태의 잔여 값은 자연히 빠진다.
        return allStatuses.filter((status) => getTagStep(status.id) === step)
    }

    return {
        CheckedTagsStep,
        setCheckedTagsStep,
        getTagStep,
        toggleTagClick,
        getStepCheckedTags,
    }
}
