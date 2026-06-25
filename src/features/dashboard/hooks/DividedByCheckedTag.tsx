import { useEffect, useState } from "react";
import { stateType } from "../components/InfoCardsContainer/InfoCardsContainer";



/// T:
export default function useDividedByCheckedTag(allStatuses: stateType[]) {
    interface TagsCheckObject {
        [key: string]: number;
    }


    const [CheckedTagsStep, setCheckedTagsStep] = useState<TagsCheckObject>(
        Object.fromEntries(allStatuses.map((status) => [status.id, 0])) as TagsCheckObject
    );

    // useEffect(() => {
    //     setCheckedTagsStep((prev) => {
    //         const sameLength = Object.keys(prev).length === allStatuses.length;
    //         const sameKeys = allStatuses.every((status) => status in prev);
    //         if (sameLength && sameKeys) {
    //             return prev;
    //         }

    //         return Object.fromEntries(
    //             allStatuses.map((status) => [status, prev[status] ?? 0])
    //         ) as TagsCheckObject;
    //     });
    // }, [allStatuses]);

    const toggleTagClick = (statusId:string) => {
        setCheckedTagsStep((prev) => {
            const newCheckedTagsStep = { ...prev };
            newCheckedTagsStep[statusId] = (newCheckedTagsStep[statusId] + 1) % 3; // 0 -> 1 -> 2 -> 0
            return newCheckedTagsStep;
        });
    }

    const getStepCheckedTags = (step: number) : stateType[] => {
        const checkedStatuesId = Object.entries(CheckedTagsStep)
            .filter(([_, value]) => value === step)
            .map(([key, _]) => key);
        return allStatuses.filter((value) => checkedStatuesId.includes(value.id))
    }

    return {
        CheckedTagsStep,
        setCheckedTagsStep,
        toggleTagClick,
        getStepCheckedTags,
    }
}