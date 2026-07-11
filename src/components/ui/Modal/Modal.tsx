"use client";
import { X } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children?: React.ReactNode;
  /** 배경(오버레이) 클릭 시 닫힘 여부 */
  closeOnOverlayClick?: boolean;
  /** ESC 키로 닫힘 여부 */
  closeOnEsc?: boolean;
  /** 우측 상단 닫기 버튼 표시 여부 */
  showCloseButton?: boolean;
  /** 스크린리더용 라벨 */
  "aria-label"?: string;
}

const ANIMATION_MS = 200;

export function Modal({
  isOpen,
  onClose,
  children,
  closeOnOverlayClick = true,
  closeOnEsc = true,
  showCloseButton = true,
  "aria-label": ariaLabel,
}: ModalProps) {
  // 포탈은 클라이언트에서만 렌더 (SSR 안전)
  const [mounted, setMounted] = useState(false);
  // 닫힘 애니메이션을 위해 isOpen이 false가 되어도 잠시 유지
  const [visible, setVisible] = useState(false);
  // enter/leave 트랜지션 상태
  const [active, setActive] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // 열림/닫힘에 따른 마운트 및 트랜지션 제어
  useEffect(() => {
    if (isOpen) {
      setVisible(true);
      // 다음 프레임에 active를 켜서 enter 트랜지션 발동
      const id = requestAnimationFrame(() => setActive(true));
      return () => cancelAnimationFrame(id);
    }
    setActive(false);
    const timer = setTimeout(() => setVisible(false), ANIMATION_MS);
    return () => clearTimeout(timer);
  }, [isOpen]);

  // ESC로 닫기
  useEffect(() => {
    if (!isOpen || !closeOnEsc) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, closeOnEsc, onClose]);

  // 열려 있는 동안 배경 스크롤 잠금
  useEffect(() => {
    if (!visible) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [visible]);

  if (!mounted || !visible) return null;

  return createPortal(
    <div
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-label={ariaLabel}
      className={`fixed inset-0 z-50 overflow-y-auto overscroll-none bg-black/50 transition-opacity duration-200 ${
        active ? "opacity-100" : "opacity-0"
      }`}
    >
      {showCloseButton && (
        <button
          type="button"
          aria-label="닫기"
          className="fixed right-5 top-5 z-10 cursor-pointer text-white opacity-70 transition-opacity hover:opacity-100"
          onClick={onClose}
        >
          <X strokeWidth={4} size={24} />
        </button>
      )}
      <div
        className="flex min-h-full items-center justify-center p-4"
        onMouseDown={(e) => {
          if (closeOnOverlayClick && e.target === e.currentTarget) onClose();
        }}
      >
        <div
          className={`transition-all duration-200 ${
            active ? "scale-100 opacity-100" : "scale-95 opacity-0"
          }`}
          onMouseDown={(e) => e.stopPropagation()}
        >
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
}

interface ModalContentProps {
  children?: React.ReactNode;
  backgroundColor?: string;
  className?: string;
}

export function ModalContent({
  children,
  backgroundColor,
  className = "",
}: ModalContentProps) {
  return (
    <div
      className={`rounded-2xl p-5 shadow-xl bg-zinc-100 dark:bg-zinc-900 ${className}`}
      style={{ backgroundColor }}
    >
      {children}
    </div>
  );
}
