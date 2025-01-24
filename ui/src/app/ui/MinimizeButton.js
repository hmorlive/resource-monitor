"use client";
import { useCallback } from "react";
import { FaMinus } from "react-icons/fa";

export default function MinimizeButton() {
  const handleMinimize = useCallback(() => {
    window?.electron?.minimizeWindow();
  }, []);

  return (
    <button
      className="p-2 text-white pointer-events-auto cursor-pointer"
      onClick={handleMinimize}
    >
      <FaMinus size={'0.75em'} />
    </button>
  );
}
