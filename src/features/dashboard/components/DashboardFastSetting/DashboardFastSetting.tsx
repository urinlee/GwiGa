"use client";

import { Info, Settings } from "lucide-react";
import { useRouter } from "next/navigation";

interface DashboardFastSettingButtonProps {
    icon?: React.ReactNode;
    label: string;
    onClick: () => void;
}

function DashboardFastSettingButton({ icon, label, onClick }: DashboardFastSettingButtonProps) {
    return (
        <button className="flex items-center justify-center w-full h-8 rounded transition-all duration-100 bg-gray-200 cursor-pointer active:bg-gray-300" onClick={onClick}>
            {icon && <span className="mr-2">{icon}</span>}
            <span className="text-sm font-medium text-gray-700">{label}</span>
        </button>
    );
}

export default function DashboardFastSetting({ roomId }: { roomId: string }) {
    const router = useRouter();
    return (
        <div className="flex gap-2">
            <div className="flex-1">
                <DashboardFastSettingButton icon={<Settings size={16} />} label="설정 하러 가기" onClick={() => router.push(`/setting/room/${roomId}/general`)} />
            </div>
            <div className="flex-1">
                <DashboardFastSettingButton icon={<Info size={16} />} label="공지사항 추가하기" onClick={() => router.push(`/room/${roomId}/notices/new`)} />
            </div>
        </div>
    );
}

//TODO: 추후 modal로 공지사항 추가하게 만들기