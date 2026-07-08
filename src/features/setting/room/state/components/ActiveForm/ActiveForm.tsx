"use client";
import { ActiveSettingForm } from "@/schemas/setting/room/schemas";
import { useForm } from "react-hook-form";
import { ActivePreview, SelectActive } from "../SelectActive/SelectActive";
import { useEffect, useState } from "react";





export function RoomActiveSettingsForm({ roomid }: { roomid: string }) {

    const [actives, setActives] = useState<ActiveSettingForm[]>([]);

    useEffect(() => {
        const fetchActives = async () => {
            const response = await fetch(`/api/group/${roomid}/setting/active`);
            if (response.ok) {
                const data = await response.json();
                setActives(data);
            } else {
                console.error("Failed to fetch actives");
            }
        }
        fetchActives();
    }, [roomid]);




    return (
        <form>
            <SelectActive actives={actives} />
        </form>
    )
}