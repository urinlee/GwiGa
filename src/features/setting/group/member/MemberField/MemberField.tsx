import { GetInputArea } from "@/components/ui/GetInput/GetInput";
import { useForm } from "react-hook-form";


export function MemberField({register}: {register: ReturnType<typeof useForm>["register"]}) {
    return (
        <div>
            <GetInputArea type="text" title="그룹 내 닉네임" description="멤버의 그룹 내 닉네임을 입력하세요" placeholder="" {...register("search")} />
        </div>
    )
}