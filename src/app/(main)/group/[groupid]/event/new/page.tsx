import { NewEventForm } from "@/features/event/components/NewEventForm/NewEventForm";



export default async function NewEventPage({
    params,
  }: {
    params: Promise<{ groupid: string }>
  }) {
    const { groupid } = await params;
    return(
        <div>
            <NewEventForm groupId={groupid}></NewEventForm>
        </div>
    )
}