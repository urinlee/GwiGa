import { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { Modal, ModalContent } from "./Modal";

const meta = {
    title: "Components/UI/Modal",
    component: Modal,
    tags: ["autodocs"],
    parameters: { layout: "centered" },
    args: {
        onClose: () => {},
    },
} satisfies Meta<typeof Modal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        isOpen: true,
        children: (
            <ModalContent>
                <p className="text-zinc-800">모달 내용입니다.</p>
            </ModalContent>
        ),
    },
};

export const Closed: Story = {
    args: {
        isOpen: false,
        children: <ModalContent><p>보이지 않아야 합니다.</p></ModalContent>,
    },
};

export const WithToggle: Story = {
    args: { isOpen: false },
    render: () => {
        const [isOpen, setIsOpen] = useState(false);
        return (
            <>
                <button
                    className="px-4 py-2 bg-zinc-800 text-white rounded-lg"
                    onClick={() => setIsOpen(true)}
                >
                    모달 열기
                </button>
                <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
                    <ModalContent>
                        <p className="text-zinc-800">배경 클릭 또는 X로 닫을 수 있어요.</p>
                    </ModalContent>
                </Modal>
            </>
        );
    },
};
