import ReactMarkdown from 'react-markdown';
import remarkBreaks from 'remark-breaks';
import remarkGfm from 'remark-gfm';

export function NoticeContent({ content }: { content:string }) {
    return (
        <div className="min-h-150">
            <div className="prose dark:prose-invert max-w-none prose-p:leading-normal prose-p:my-3">
                {/* remarkBreaks: 엔터 한 번을 <br>로 — 채팅처럼 개행 (기본 마크다운은 공백으로 취급)
                    remarkGfm: 표·취소선·체크리스트·자동링크 (GitHub 확장 문법) */}
                <ReactMarkdown remarkPlugins={[remarkBreaks, remarkGfm]}>{content}</ReactMarkdown>
            </div>
        </div>
    );
}