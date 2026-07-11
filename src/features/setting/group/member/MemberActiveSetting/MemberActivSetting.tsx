import { Active } from "@/generated/prisma/client";
import { ActivePreview } from "@/types/active";
import { CircleMinus, CirclePlus } from "lucide-react";
import { useState } from "react";
import { ActiveList } from "../../active/components/ActiveList/ActiveList";
import { Modal, ModalContent } from "@/components/ui/Modal/Modal";


interface MemberActiveSettingProps {
    groupAllActives: Active[];
    assignedActives: Active[];
}


export function AddMemberActiveModal({isOpen, onClose, groupAllActives, assignedActives, handleClickActive}: {isOpen: boolean, onClose: () => void, groupAllActives: Active[], assignedActives: Active[], handleClickActive: (active: Active) => void}) {
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalContent>
                <div className="w-100 h-100">
                    <h2 className="text-lg font-semibold">이 그룹의 모든 액티브</h2>
                    <div className="h-full w-full p-2">
                        <div className="h-full overflow-y-scroll">
                            {groupAllActives.map((active) => {
                                const isAssigned = assignedActives.some((assigned) => assigned.id === active.id);
                                return (
                                    <div key={active.id} className="flex items-center justify-between p-2 border-b border-zinc-200 dark:border-zinc-700">
                                        <div className="flex items-center gap-2">
                                            <div className="h-4 w-4 rounded-full" style={{backgroundColor: active.primaryColor ?? "#F4F4F5"}} />
                                            <span>{active.name}</span>
                                        </div>
                                        {isAssigned ? (
                                            <CircleMinus className="text-red-500 cursor-pointer" onClick={() => handleClickActive(active)} />
                                        ) : (
                                            <CirclePlus className="text-green-500 cursor-pointer" onClick={() => handleClickActive(active)} />
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </ModalContent>
        </Modal>
    )
}





export function MemberActiveSetting({groupAllActives, assignedActives}: MemberActiveSettingProps) {

    const [selectedActive, setSelectedActive] = useState<ActivePreview | undefined>(assignedActives[0]);
    const [isAddActiveModalOpen, setIsAddActiveModalOpen] = useState(false);
    const [newAssignedActives, setNewAssignedActives] = useState<Active[]>(assignedActives);


    const handleOnClose = () => {
        setIsAddActiveModalOpen(false);
    }


    const handleClickActive = (active: Active) => {
        const isAssigned = newAssignedActives.some((assigned) => assigned.id === active.id);
        if (isAssigned) {
            setNewAssignedActives((prev) => prev.filter((prevActive) => prevActive.id !== active.id));
        } else {
            setNewAssignedActives((prev) => [...prev, active]);
        }
    }


    return (
        <div className="rounded-xl border border-zinc-200 bg-white p-2 dark:border-zinc-700 dark:bg-zinc-900/40 max-h-100 overflow-y-auto">
            <ActiveList actives={assignedActives} selectedActive={selectedActive} onSelect={setSelectedActive} />
            <div className="flex items-center justify-center gap-2 py-4 cursor-pointer hover:bg-zinc-50" onClick={() => setIsAddActiveModalOpen(true)}>
                <CirclePlus/>
            </div>
            {isAddActiveModalOpen && <AddMemberActiveModal isOpen={isAddActiveModalOpen} onClose={handleOnClose} groupAllActives={groupAllActives} assignedActives={newAssignedActives} handleClickActive={handleClickActive} />}
        </div>
    )
}