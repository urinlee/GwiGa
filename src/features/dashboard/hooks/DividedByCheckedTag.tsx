import { useMemo, useState } from "react";



/// T:
export default function useDividedByCheckedTag(allStatuses: readonly string[]) {
    interface TagsCheckObject {
        [key: typeof allStatuses[number]]: number;
    }

    const [checkedTagsStep, setCheckedTagsStep] = useState<TagsCheckObject>(
        {}
    );

    const CheckedTagsStep = useMemo(
        () =>
            Object.fromEntries(
                allStatuses.map((status) => [status, checkedTagsStep[status] ?? 0])
            ) as TagsCheckObject,
        [allStatuses, checkedTagsStep]
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
            .filter(([, value]) => value === step)
            .map(([key]) => key);
    }

    return {
        CheckedTagsStep,
        setCheckedTagsStep,
        toggleTagClick,
        getStepCheckedTags,
    }
}
