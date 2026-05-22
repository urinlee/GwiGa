import { ComponentProps } from "react";
import CreateNewSection from "../CreateNewSection/CreateNewSection";
import { HistoryContentSection } from "../HistoryContentSection/HistoryContentSection";


type historyContentSectionProps = ComponentProps<typeof HistoryContentSection>;

export interface contentSectionContainerProps {
    HistoryContents?: historyContentSectionProps[];
}

export default function ContentSectionContainer({ HistoryContents }: contentSectionContainerProps) {
    return(
        <div>
            <div className="block md:hidden pb-5"><CreateNewSection /></div>
            <div className="grid grid-cols-2 gap-4 md:flex md:flex-col">
                <div className="hidden md:block"><CreateNewSection /></div>
                {HistoryContents?.map((props, index) => (
                    <HistoryContentSection key={index} {...props} />
                ))}
            </div>
        </div>
    )
}