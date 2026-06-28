"use client";
import { X } from "lucide-react";
import React from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children?: React.ReactNode;
}

export function Modal({ isOpen, onClose, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative">
        <button
          className="absolute right-3 top-3 opacity-50 hover:opacity-100 cursor-pointer"
          onClick={onClose}
        >
          <X strokeWidth={4} size={24} />
        </button>
        {children}
      </div>
    </div>
  );
}

interface ModalContentProps {
  children?: React.ReactNode;
  backgroundColor?: string;
}

export function ModalContent({
  children,
  backgroundColor = "#f0f0f0",
}: ModalContentProps) {
  return (
    <div className="p-5 rounded-2xl" style={{ backgroundColor }}>
      {children}
    </div>
  );
}
