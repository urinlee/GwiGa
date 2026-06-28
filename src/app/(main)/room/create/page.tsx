"use client"
import Button from "@/components/ui/Button/Button";
import { GetInputArea } from "@/components/ui/GetInput/GetInput";
import CreateStatusList from "@/features/room/create/components/CreateStatusList/CreateStatusList";
import CreateTagsList from "@/features/room/create/components/CreateTagsList/CreateTagsList";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { BaseSyntheticEvent } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";


interface SubmitRes {
    id:string
}

const createRoomSchema = z.object({
    name: z.string().trim().min(1, "방 제목을 입력하세요").max(50, "최대 50자까지 입력할 수 있어요"),
    description: z.string().trim().max(2000, "최대 2000자까지 입력할 수 있어요"),
});

type CreateRoomForm = z.infer<typeof createRoomSchema>;

export default function CreateRoomPage() {

    const router = useRouter();
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<CreateRoomForm>({
        resolver: zodResolver(createRoomSchema),
        defaultValues: { name: "", description: "" },
    });

    // 태그/상태는 hidden input(RoomTag/RoomStatus)으로 렌더링되므로 제출 시 FormData로 함께 읽는다.
    const onSubmit = async (data: CreateRoomForm, event?: BaseSyntheticEvent) => {
        const formData = new FormData(event?.target as HTMLFormElement);
        const tag = formData.getAll("RoomTag") as string[];
        const status = formData.getAll("RoomStatus") as string[];

        const body = { name: data.name, description: data.description, tag, status };
        console.log("[요청 body]", body);

        try {
            const res = await fetch("/api/group/setting/new", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(body)
            })

            const result = await res.json() as SubmitRes;

            router.push(`/room/${result.id}/invite?type=new`);

        } catch(error) {
            alert(error)
        }
    }

    return (
        <div className="flex flex-col gap-6 py-20">
            <h1 className="text-3xl font-bold">방 만들기</h1>
            <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)}>
                <GetInputArea type="textarea" isLong={false} title="방 제목" description="방 제목을 입력하세요" required registration={register("name")} error={errors.name?.message} />
                <GetInputArea type="textarea" title="방 설명" description="방 설명을 입력하세요" maxLength={2000} registration={register("description")} error={errors.description?.message} />
                <div className="flex gap-6 flex-col py-6 px-2">
                    <CreateTagsList tags={["2026"]}/>
                    <CreateStatusList defaultStatusList={["귀가", "입금"]}/>
                </div>
                <div className="flex items-center justify-center gap-3">
                    <Button type="submit" size="lg" icon={<Plus className="size-4" />} disabled={isSubmitting}>{isSubmitting ? "만드는중..." : "방 만들기"}</Button>
                </div>
            </form>
        </div>
    );
}