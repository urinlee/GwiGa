
export interface NoticeBadge {
    id: string;
    name: string;
    backgroundColor: string;
    textColor: string;
}

interface NoticeHeroProps {
    groupId: string;
    noticeId: string;
    title: string;
    date: string;
    authorName: string;
    viewCount?: number;
    badge?: NoticeBadge;
}

export function NoticeHero({ groupId, noticeId, title, date, authorName, viewCount, badge }: NoticeHeroProps) {
    return(
        <div className="pt-10 dark:border-neutral-700">
            <a className="text-[12px] text-zinc-500 my-6" href={`/group/${groupId}/notices`}>&lt; 목록으로 돌아가기</a>
            <div className="mx-2 mt-2">
                {badge && (
                    <span className="px-4 py-2 rounded-lg font-bold text-[#ffffff]" style={{ backgroundColor: badge.backgroundColor, color: badge.textColor }}>
                        {badge.name}
                    </span>
                )}
                <div className='mx-2 mt-5'>
                    <h1 className="text-4xl pb-3 font-bold">{title}</h1>
                    <p className="text-[12px] text-neutral-400 [&>span]:mr-4">
                        <span>조회수 - {viewCount ?? 0}</span>
                        <span>작성일 - {date}</span>
                        <span>작성자 - {authorName}</span>
                    </p>
                </div>
            </div>
        </div>
    )
}