import Button from "@/components/ui/Button/Button";
import GetInput from "@/components/ui/GetInput/GetInput";
import { Toogle } from "@/components/ui/Toogle/Toogle";
import CreateStatusList from "@/features/room/create/components/CreateStatusList/CreateStatusList";
import CreateTagsList from "@/features/room/create/components/CreateTagsList/CreateTagsList";
import { Plus } from "lucide-react";



export default function CreateRoomPage() {
    return (
        <div className="flex flex-col gap-6 py-20">
            <h1 className="text-3xl font-bold">방 만들기</h1>
            <form className="flex flex-col gap-6">
                <GetInput label="방 제목" placeholder="방 제목을 입력하세요" required />
                <GetInput label="방 설명" placeholder="방 설명을 입력하세요" isLong maxLength={2000} />
                <CreateTagsList tags={["2026"]}/>
                <CreateStatusList defaultStatusList={["귀가", "입금"]}/>
                <div className="flex items-center justify-center gap-3">
                    <Button type="submit" size="lg" icon={<Plus className="size-4" />}>방 만들기</Button>
                </div>
            </form>
        </div>
    );
}