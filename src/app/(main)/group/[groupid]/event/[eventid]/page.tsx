import { EventSee } from "@/features/event/components/EventSee/EventSee";



interface EventPageProps {
  params: {
    groupid: string;
    eventid: string
  };
}

export default async function EventPage({params}:EventPageProps) {
    const {groupid, eventid} = await params
    return(
        <div>
            <EventSee groupId={groupid} eventId={eventid}></EventSee>
        </div>
    )
}