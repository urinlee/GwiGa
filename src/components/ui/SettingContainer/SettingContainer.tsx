


export function SettingContainer({ children }: { children?: React.ReactNode }) {
    return (
        <div className="flex w-full">
            <div className="w-full px-4 py-6 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200">
                {children}
            </div>
        </div>
    );
}