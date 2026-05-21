"use client";
interface ButtonProps {
    title: string;
    callback?: () => void;
    icon?: React.ReactNode;
}

export default function Button({ 
    title, 
    callback, 
    icon }: ButtonProps) {
    const handleonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        callback && callback();
    }
    return (
        <button className="bg-button-bg text-text-force-primary px-4 py-2 rounded-md font-[600] cursor-pointer" onClick={handleonClick}>
            <div className="flex items-center gap-1">
                {icon && <span className="mr-2 flex items-center">{icon}</span>}
                <div>
                    <span className="leading-none">{title}</span>
                </div>
            </div>
        </button>
    )
}