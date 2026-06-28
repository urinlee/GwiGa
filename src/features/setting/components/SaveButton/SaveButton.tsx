
import styles from "./SaveButton.module.css";

export function SaveButton({ isSubmitting = false }: { isSubmitting?: boolean }) {
    return (
        <div className={`fixed bottom-6 right-20 ${styles.slideUp}`}>
            <div className="flex items-center gap-3 justify-center bg-zinc-200/80 px-4 py-2 rounded-lg shadow-lg shadow-black/20 opacity-70 hover:opacity-100 transition-opacity duration-300">

                <div className="text-[12px] font-semibold">꼭 저장하기 버튼을 눌러주세요!</div>
                <button type="submit" disabled={isSubmitting} className="bg-zinc-600 hover:bg-zinc-700 disabled:opacity-50 text-zinc-200 font-bold py-1 px-4 rounded shadow-lg">
                    {isSubmitting ? "저장 중..." : "저장"}
                </button>
            </div>
        </div>
    );
}