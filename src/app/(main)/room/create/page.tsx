"use client"
import Button from "@/components/ui/Button/Button";
import GetInput from "@/components/ui/GetInput/GetInput";
import CreateStatusList from "@/features/room/create/components/CreateStatusList/CreateStatusList";
import CreateTagsList from "@/features/room/create/components/CreateTagsList/CreateTagsList";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { SyntheticEvent, useState } from "react";


interface SubmitRes {
    id:string
}

export default function CreateRoomPage() {

    const router = useRouter();
    const [isCreating, setisCreating] = useState<boolean>(false)

    const handleSubmit = async (e: SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        setisCreating(true)
        
        const formData = new FormData(e.currentTarget);
        const name : string= formData.get("RoomTitle") as string;
        const description : string = formData.get("RoomDescription") as string;
        const Tags : string[] = formData.getAll("RoomTag") as string[];
        const Statuses : string[] = formData.getAll("RoomStatus") as string[];

        const body = { name, description, tag: Tags, status: Statuses };
        console.log("[요청 body]", body);

        try {
            const res = await fetch("/api/group/setting/new", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(body)
            })

            const data = await res.json() as SubmitRes;

            router.push(`/room/${data.id}/invite?type=new`);

        } catch(error) {
            alert(error)
        }
    }

    return (
        <div className="flex flex-col gap-6 py-20">
            <h1 className="text-3xl font-bold">방 만들기</h1>
            <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
                <GetInput label="방 제목" name="RoomTitle" placeholder="방 제목을 입력하세요" required />
                <GetInput label="방 설명" name="RoomDescription" placeholder="방 설명을 입력하세요" isLong maxLength={2000} />
                <CreateTagsList tags={["2026"]}/>
                <CreateStatusList defaultStatusList={["귀가", "입금"]}/>
                <div className="flex items-center justify-center gap-3">
                    <Button type="submit" size="lg" icon={<Plus className="size-4" />} disabled={isCreating}>{isCreating ? "만드는중..." : "방 만들기"}</Button>
                </div>
            </form>
        </div>
    );
}

//TODO: reactForm 사용하기