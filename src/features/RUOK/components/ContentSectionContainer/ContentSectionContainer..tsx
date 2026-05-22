import { ComponentProps } from "react";
import CreateNewSection from "../CreateNewSection/CreateNewSection";
import { HistoryContentSection } from "../HistoryContentSection/HistoryContentSection";


type HistoryContentSectionProps = ComponentProps<typeof HistoryContentSection>;

export interface CreateNewSectionProps {
    HistoryContents?: HistoryContentSectionProps[];
}

export default function ContentSectionContainer({ HistoryContents }: CreateNewSectionProps) {
    return(
        <div className="flex flex-col gap-4">
            <CreateNewSection />
            {HistoryContents?.map((props, index) => (
                <HistoryContentSection key={index} {...props} />
            ))}
        </div>
    )
}