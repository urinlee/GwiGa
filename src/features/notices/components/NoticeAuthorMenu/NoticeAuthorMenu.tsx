"use client";

export function NoticeAuthorMenu({ noticeId }: { noticeId: string }) {

    const onClick = (_e: React.MouseEvent<HTMLButtonElement>, type: string) => {
        if (type === "edit") {
            window.location.href = `/group/${window.location.pathname.split("/")[2]}/notices/${noticeId}/edit`;
        } else if (type === "delete") {
            if (confirm("정말 삭제하시겠습니까?")) {
                fetch(`/api/v1/group/${window.location.pathname.split("/")[2]}/groupnotice/${noticeId}`, {
                    method: "DELETE",
                }).then((res) => {
                    if (res.ok) {
                        alert("삭제되었습니다.");
                        window.location.href = `/group/${window.location.pathname.split("/")[2]}/notices`;
                    } else {
                        alert("삭제에 실패했습니다.");
                    }
                });
            }
        }
    }
    return(
        <div className="flex justify-end gap-2">
            <button className="text-zinc-600 font-semibold cursor-pointer" onClick={(e) => onClick(e, "edit")}>수정하기</button>
            <span>·</span>
            <button className="text-red-700 font-extrabold cursor-pointer" onClick={(e) => onClick(e, "delete")}>삭제하기</button>
        </div>
    )
}