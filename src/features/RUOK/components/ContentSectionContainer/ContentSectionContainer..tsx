import { ComponentProps } from "react";
import CreateNewSection from "../CreateNewSection/CreateNewSection";
import { HistoryContentSection } from "../HistoryContentSection/HistoryContentSection";
import Link from "next/link";


type historyContentSectionProps = ComponentProps<typeof HistoryContentSection>;

interface ContentId {
    id:string;
    admin:boolean;
}

export interface contentSectionContainerProps {
    HistoryContents?: (historyContentSectionProps & ContentId)[];
}

export default function ContentSectionContainer({ HistoryContents }: contentSectionContainerProps) {
    return(
        <div>
            <div className="block md:hidden pb-5"><CreateNewSection /></div>
            <div className="grid grid-cols-2 gap-4 md:flex md:flex-col">
                <div className="hidden md:block"><CreateNewSection /></div>
                {HistoryContents?.map(({ id, admin, ...props }) => (
                    <Link key={id} href={`/room/${id}/dashboard`}>
                        <HistoryContentSection key={id} {...props} />
                    </Link>
                ))}
            </div>
        </div>
    )
}