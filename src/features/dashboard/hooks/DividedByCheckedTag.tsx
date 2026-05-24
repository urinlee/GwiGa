import { useState } from "react";
import { set } from "zod";



/// T:
export default function useDividedByCheckedTag(allStatuses: readonly string[]) {
    interface TagsCheckObject {
        [key: typeof allStatuses[number]]: number;
    }

    const [CheckedTagsStep, setCheckedTagsStep] = useState<TagsCheckObject>(
        Object.fromEntries(allStatuses.map((status) => [status, 0])) as TagsCheckObject
    );

    const toggleTagClick = (status: typeof allStatuses[number]) => {
        setCheckedTagsStep((prev) => {
            const newCheckedTagsStep = { ...prev };
            newCheckedTagsStep[status] = (newCheckedTagsStep[status] + 1) % 3; // 0 -> 1 -> 2 -> 0
            return newCheckedTagsStep;
        });
    }

    const getStepCheckedTags = (step: number) => {
        return Object.entries(CheckedTagsStep)
            .filter(([_, value]) => value === step)
            .map(([key, _]) => key);
    }

    return {
        CheckedTagsStep,
        setCheckedTagsStep,
        toggleTagClick,
        getStepCheckedTags,
    }
}