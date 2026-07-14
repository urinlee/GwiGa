import { GetInputArea } from "@/components/ui/GetInput/GetInput";
import { MemberNicknameForm } from "@/schemas/schemas";
import type { UseFormRegister } from "react-hook-form";


export function MemberField({register}: {register: UseFormRegister<MemberNicknameForm>}) {
    return (
        <div>
            <GetInputArea type="text" title="그룹 내 닉네임" description="멤버의 그룹 내 닉네임을 입력하세요" placeholder="" registration={register("nickname")} />
        </div>
    )
}