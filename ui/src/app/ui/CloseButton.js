"use client";
import { useCallback } from "react";
import { FaTimes } from "react-icons/fa";

export default function CloseButton() {
  const handleClose = useCallback(() => {
    window?.electron?.closeWindow();
  }, []);

  return (
    <button
      className="p-2 text-white pointer-events-auto cursor-pointer"
      onClick={handleClose}
    >
      <FaTimes size={"0.75em"} />
    </button>
  );
}
