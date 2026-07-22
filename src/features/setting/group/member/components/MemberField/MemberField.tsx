import { GetInputArea } from "@/components/ui/GetInput/GetInput";
import { MemberNicknameFormValues } from "@/schemas/schemas";
import type { UseFormRegister } from "react-hook-form";


export function MemberField({register}: {register: UseFormRegister<MemberNicknameFormValues>}) {
    return (
        <div>
            <GetInputArea type="text" title="그룹 내 닉네임" description="멤버의 그룹 내 닉네임을 입력하세요" placeholder="" registration={register("nickname")} />
        </div>
    )
}